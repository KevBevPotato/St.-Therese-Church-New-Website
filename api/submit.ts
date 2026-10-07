import { createSign } from "node:crypto";

type JsonObject = Record<string, unknown>;
type HeaderMap = Record<string, string | string[] | undefined>;

interface ApiRequest {
  method?: string;
  headers: HeaderMap;
  body?: unknown;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(value: JsonObject): void;
}

const MAX_BODY_BYTES = 20_000;
const MAX_FIELD_LENGTH = 2_000;
const RATE_LIMIT_PER_MINUTE = 6;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class SheetsSubmissionError extends Error {
  constructor(
    readonly reason: string,
    readonly upstreamStatus?: number
  ) {
    super(reason);
    this.name = "SheetsSubmissionError";
  }
}

const ENGAGEMENT_TABS: Record<string, string> = {
  pledge: "Pledges",
  signup: "Signups",
  suggestion: "Suggestions",
  referral: "Referrals",
};
const ALLOWED_ENGAGEMENT_IDS = new Set([
  "pledge-nursery",
  "pledge-supper-week",
  "signup-lector",
  "signup-usher",
  "signup-music",
  "signup-supper",
  "signup-youth-mentor",
  "signup-nursery-help",
  "suggestion",
  "referral",
]);
const ALLOWED_INTEREST_IDS = new Set([
  "nursery",
  "lector",
  "usher",
  "altar-server",
  "music",
  "supper-week",
  "youth-ministry-mentors",
  "connect-groups",
  "group-studies",
  "annual-parish-picnic",
  "wednesday-faith-formation",
  "st-vincent-de-paul-food-drive",
  "altar-society",
  "knights-of-columbus",
  "catholic-daughters",
]);
const ALLOWED_FIELDS = new Set([
  "form_type",
  "from_name",
  "from_email",
  "from_phone",
  "project_id",
  "project_title",
  "item_id",
  "item_label",
  "quantity",
  "pledge_amount",
  "memo_template",
  "note",
  "engagement_type",
  "engagement_id",
  "context_project_id",
  "context_project_title",
  "sunday_mass",
  "preferred_mass",
  "interest",
  "experience",
  "preferred_date",
  "role_interest",
  "role",
  "roles",
  "availability",
  "context_opportunity",
  "suggestion",
  "their_name",
  "their_phone",
  "your_name",
  "your_phone",
  "opportunity",
  "full_name",
  "email",
  "phone",
  "notes",
  "signup_mode",
  "signup_kind",
  "participant_name",
  "participant_grade",
  "guardian_name",
  "week_id",
  "week_date",
  "availability_type",
  "week_ids",
  "preferred_roles",
  "website",
]);
const MEMBERSHIP_FIELDS = new Set([
  "family_name",
  "first_name",
  "spouse_name",
  "title",
  "street_address",
  "city",
  "zip_code",
  "phone_unlisted",
  "date_registered",
  "changing_membership_from",
  "marital_status",
  "email",
  "church_attendance",
  "mass_usually_attend",
  "financial_support",
  "tithe_envelopes",
  "child_count",
]);
const PERSON_FIELDS = [
  "first_name",
  "preferred_name",
  "last_name",
  "maiden_name",
  "religion",
  "employment",
  "work_phone",
  "gender",
  "date_of_birth",
  "baptism",
  "baptism_year",
  "communion",
  "communion_year",
  "confirmation",
  "confirmation_year",
];
const ADULT_ONLY_FIELDS = [
  "marriage_date",
  "annulment_status",
  "second_marriage_status",
];
for (const member of ["head", "spouse"]) {
  for (const field of [...PERSON_FIELDS, ...ADULT_ONLY_FIELDS]) {
    MEMBERSHIP_FIELDS.add(`${member}_${field}`);
  }
}

function isMembershipField(key: string): boolean {
  if (MEMBERSHIP_FIELDS.has(key)) return true;
  const match = /^child_(\d{1,2})_(.+)$/.exec(key);
  return (
    !!match &&
    Number(match[1]) >= 1 &&
    Number(match[1]) <= 12 &&
    PERSON_FIELDS.includes(match[2])
  );
}

function respond(
  response: ApiResponse,
  status: number,
  body: JsonObject
): void {
  response.status(status).json(body);
}

function getString(body: JsonObject, key: string): string {
  const value = body[key];
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function requestHost(headers: HeaderMap): string {
  const host = headers.host;
  return (Array.isArray(host) ? host[0] : host || "").toLowerCase();
}

function hasSameOrigin(request: ApiRequest): boolean {
  const origin = request.headers.origin;
  if (typeof origin !== "string") return false;

  try {
    return new URL(origin).host.toLowerCase() === requestHost(request.headers);
  } catch {
    return false;
  }
}

function validateBody(bodyValue: unknown): {
  body?: JsonObject;
  tab?: string;
  error?: string;
} {
  if (!bodyValue || typeof bodyValue !== "object" || Array.isArray(bodyValue)) {
    return { error: "A JSON object is required." };
  }

  const body = bodyValue as JsonObject;
  const formType = getString(body, "form_type");
  if (Buffer.byteLength(JSON.stringify(body), "utf8") > MAX_BODY_BYTES) {
    return { error: "The submission is too large." };
  }

  for (const [key, value] of Object.entries(body)) {
    if (
      !ALLOWED_FIELDS.has(key) &&
      !(formType === "membership" && isMembershipField(key))
    )
      return { error: "The submission has an unsupported field." };
    if (key === "quantity" || key === "pledge_amount") continue;
    if (typeof value !== "string" || value.length > MAX_FIELD_LENGTH) {
      return { error: "A submission field is invalid or too long." };
    }
  }

  if (getString(body, "website"))
    return { error: "The submission could not be accepted." };

  let tab: string;
  let required: string[];

  switch (formType) {
    case "interest": {
      tab = "Signups";
      required = ["from_name", "from_email", "interest", "context_opportunity"];
      const signupKind = getString(body, "signup_kind");
      const interestId = getString(body, "context_opportunity");
      if (!ALLOWED_INTEREST_IDS.has(interestId)) {
        return { error: "The requested signup is invalid." };
      }
      if (!["join", "volunteer", "class_registration"].includes(signupKind)) {
        return { error: "The selected signup type is invalid." };
      }
      if (
        signupKind === "class_registration" &&
        interestId !== "wednesday-faith-formation"
      ) {
        return {
          error: "Class registration is not available for this signup.",
        };
      }
      if (signupKind === "class_registration") {
        required.push("participant_name", "guardian_name");
      }
      break;
    }
    case "membership": {
      tab = "Membership Registration";
      required = [
        "family_name",
        "first_name",
        "street_address",
        "city",
        "zip_code",
        "email",
        "child_count",
      ];
      const childCount = Number(getString(body, "child_count"));
      if (!Number.isInteger(childCount) || childCount < 0 || childCount > 12) {
        return { error: "The number of children must be between 0 and 12." };
      }
      for (let child = 1; child <= childCount; child++) {
        required.push(`child_${child}_first_name`, `child_${child}_last_name`);
      }
      if (
        getString(body, "title") &&
        !["Mr./Mrs.", "Mr.", "Mrs.", "Ms.", "Miss", "Dr./Mrs."].includes(
          getString(body, "title")
        )
      ) {
        return { error: "The selected title is invalid." };
      }
      if (
        getString(body, "marital_status") &&
        !["M", "C", "I", "N", "X", "O", "S", "D", "W"].includes(
          getString(body, "marital_status")
        )
      ) {
        return { error: "The selected marital status is invalid." };
      }
      break;
    }
    case "pledge":
      tab = "Pledges";
      required = ["from_name", "from_email", "project_id", "item_id"];
      break;
    case "engagement": {
      const engagementType = getString(body, "engagement_type");
      const engagementId = getString(body, "engagement_id");
      if (
        !ENGAGEMENT_TABS[engagementType] ||
        !ALLOWED_ENGAGEMENT_IDS.has(engagementId)
      ) {
        return { error: "The requested form is invalid." };
      }
      tab = ENGAGEMENT_TABS[engagementType];
      required =
        engagementType === "pledge"
          ? ["from_name", "from_email", "item_id"]
          : engagementType === "referral"
            ? ["their_name", "their_phone"]
            : engagementType === "suggestion"
              ? ["from_email", "suggestion"]
              : ["from_name", "from_email"];
      break;
    }
    case "supper-volunteer":
      tab = "WednesdaySupperVolunteers";
      required = ["full_name", "email", "signup_mode"];
      if (!["specific", "willing"].includes(getString(body, "signup_mode"))) {
        return { error: "The signup mode is invalid." };
      }
      break;
    case "lector":
      tab = "Lector Signups";
      required = ["from_name", "from_email", "sunday_mass"];
      break;
    default:
      return { error: "The requested form is invalid." };
  }

  if (required.some(key => !getString(body, key))) {
    return { error: "Please complete all required fields." };
  }

  const email = getString(body, "from_email") || getString(body, "email");
  if (email && !EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (
    formType === "pledge" ||
    getString(body, "engagement_type") === "pledge"
  ) {
    const quantity = Number(body.quantity);
    const amount = Number(body.pledge_amount);
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100 ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 1_000_000
    ) {
      return { error: "The pledge amount or quantity is invalid." };
    }
  }

  return { body, tab };
}

function base64Url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

async function getGoogleAccessToken(
  serviceAccountEmail: string,
  privateKey: string
): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: serviceAccountEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: issuedAt,
      exp: issuedAt + 3600,
    })
  );
  const unsignedToken = `${header}.${claim}`;
  let assertion: string;
  try {
    const signer = createSign("RSA-SHA256");
    signer.update(unsignedToken);
    signer.end();
    assertion = `${unsignedToken}.${signer.sign(privateKey, "base64url")}`;
  } catch {
    throw new SheetsSubmissionError("invalid_service_account_private_key");
  }

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
    });
  } catch {
    throw new SheetsSubmissionError("google_token_network_error");
  }

  if (!tokenResponse.ok) {
    throw new SheetsSubmissionError(
      "google_token_http_error",
      tokenResponse.status
    );
  }
  const tokenBody: unknown = await tokenResponse.json().catch(() => {
    throw new SheetsSubmissionError("google_token_invalid_json");
  });
  if (
    !tokenBody ||
    typeof tokenBody !== "object" ||
    !("access_token" in tokenBody) ||
    typeof tokenBody.access_token !== "string"
  ) {
    throw new SheetsSubmissionError("google_token_invalid_response");
  }
  return tokenBody.access_token;
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function valueForHeader(header: string, body: JsonObject): string | number {
  const normalizedHeader = normalizeHeader(header);
  const aliases: Record<string, string> = {
    name: "from_name",
    full_name: "from_name",
    email: "from_email",
    phone: "from_phone",
    timestamp: "submitted_at",
    date_submitted: "submitted_at",
    submission_date: "submitted_at",
    form: "form_type",
  };
  const key = aliases[normalizedHeader] || normalizedHeader;
  const value = body[normalizedHeader] ?? body[key];
  return typeof value === "string" || typeof value === "number" ? value : "";
}

class RateLimitError extends Error {
  constructor(
    readonly reason: string,
    readonly upstreamStatus?: number
  ) {
    super(reason);
    this.name = "RateLimitError";
  }
}

async function enforceRateLimit(request: ApiRequest): Promise<boolean> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, "");
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const rawIp =
    request.headers["x-real-ip"] || request.headers["x-forwarded-for"];
  const ip = Array.isArray(rawIp) ? rawIp[0] : rawIp?.split(",")[0]?.trim();
  if (!redisUrl) throw new RateLimitError("missing_url");
  if (!redisToken) throw new RateLimitError("missing_token");
  if (!ip) throw new RateLimitError("missing_client_ip");
  try {
    if (new URL(redisUrl).protocol !== "https:") {
      throw new RateLimitError("invalid_url_protocol");
    }
  } catch (error) {
    if (error instanceof RateLimitError) throw error;
    throw new RateLimitError("invalid_url");
  }

  const key = `public-form:${ip}`;
  const script =
    "local count = redis.call('INCR', KEYS[1]); if count == 1 or redis.call('TTL', KEYS[1]) < 0 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; return count";
  const response = await fetch(redisUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(["EVAL", script, "1", key, RATE_LIMIT_WINDOW_SECONDS]),
  }).catch(() => {
    throw new RateLimitError("upstash_network_error");
  });
  if (!response.ok) {
    throw new RateLimitError("upstash_http_error", response.status);
  }
  const result: unknown = await response.json().catch(() => {
    throw new RateLimitError("upstash_invalid_json");
  });
  if (
    !result ||
    typeof result !== "object" ||
    !("result" in result) ||
    typeof result.result !== "number"
  ) {
    throw new RateLimitError(
      result && typeof result === "object" && "error" in result
        ? "upstash_command_error"
        : "upstash_invalid_response"
    );
  }
  return result.result <= RATE_LIMIT_PER_MINUTE;
}

async function appendToSheet(
  spreadsheetId: string,
  accessToken: string,
  tab: string,
  body: JsonObject
): Promise<void> {
  const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values`;
  const headerRange = encodeURIComponent(`'${tab.replace(/'/g, "''")}'!1:1`);
  const headerResponse = await fetch(`${baseUrl}/${headerRange}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!headerResponse.ok)
    throw new Error("Could not read the destination sheet headers.");

  const headerData: unknown = await headerResponse.json();
  const headers =
    headerData &&
    typeof headerData === "object" &&
    "values" in headerData &&
    Array.isArray(headerData.values) &&
    Array.isArray(headerData.values[0])
      ? headerData.values[0].filter(
          (value): value is string => typeof value === "string"
        )
      : [];
  if (headers.length === 0)
    throw new Error("The destination sheet has no header row.");

  const normalizedHeaders = new Set(headers.map(normalizeHeader));
  const hasSubmissionColumn = [
    "from_name",
    "full_name",
    "name",
    "from_email",
    "email",
    "family_name",
    "suggestion",
    "their_name",
  ].some(header => normalizedHeaders.has(header));
  if (!hasSubmissionColumn)
    throw new Error("The destination sheet headers are not configured.");

  const submission = { ...body, submitted_at: new Date().toISOString() };
  const headerKeys = new Set(
    headers.map(header => {
      const normalized = normalizeHeader(header);
      const aliases: Record<string, string> = {
        name: "from_name",
        full_name: "from_name",
        email: "from_email",
        phone: "from_phone",
        timestamp: "submitted_at",
        date_submitted: "submitted_at",
        submission_date: "submitted_at",
        form: "form_type",
      };
      return aliases[normalized] || normalized;
    })
  );
  const missingColumn = Object.entries(submission).some(
    ([key, value]) =>
      key !== "form_type" &&
      key !== "website" &&
      value !== "" &&
      value !== undefined &&
      !headerKeys.has(key) &&
      !headers.some(header => normalizeHeader(header) === key)
  );
  if (missingColumn)
    throw new Error(
      "The destination sheet is missing one or more submission columns."
    );

  const row = headers.map(header => valueForHeader(header, submission));
  const appendRange = encodeURIComponent(`'${tab.replace(/'/g, "''")}'!A:ZZ`);
  const appendResponse = await fetch(
    `${baseUrl}/${appendRange}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    }
  );
  if (!appendResponse.ok) throw new Error("Could not append the submission.");
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse
): Promise<void> {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Vary", "Origin");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    respond(response, 405, { error: "Method not allowed." });
    return;
  }
  if (!hasSameOrigin(request)) {
    respond(response, 403, { error: "Request origin is not allowed." });
    return;
  }

  const validation = validateBody(request.body);
  if (validation.error || !validation.body || !validation.tab) {
    respond(response, 400, {
      error: validation.error || "Invalid submission.",
    });
    return;
  }

  try {
    if (!(await enforceRateLimit(request))) {
      respond(response, 429, {
        error: "Too many submissions. Please wait and try again.",
      });
      return;
    }
  } catch (error) {
    console.error("Form rate-limit check failed.", {
      reason:
        error instanceof RateLimitError ? error.reason : "unexpected_error",
      ...(error instanceof RateLimitError && error.upstreamStatus
        ? { upstreamStatus: error.upstreamStatus }
        : {}),
    });
    respond(response, 503, {
      error: "Form submissions are temporarily unavailable.",
    });
    return;
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!email || !privateKey || !spreadsheetId) {
    respond(response, 503, {
      error: "Form submissions are temporarily unavailable.",
    });
    return;
  }

  let submissionStage = "google_authorization";
  try {
    const accessToken = await getGoogleAccessToken(email, privateKey);
    submissionStage = "sheets_append";
    await appendToSheet(
      spreadsheetId,
      accessToken,
      validation.tab,
      validation.body
    );
    respond(response, 200, { success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const knownReasons: Record<string, string> = {
      "Could not read the destination sheet headers.":
        "sheet_header_read_failed",
      "The destination sheet has no header row.": "sheet_header_row_empty",
      "The destination sheet headers are not configured.":
        "sheet_headers_not_configured",
      "The destination sheet is missing one or more submission columns.":
        "sheet_submission_columns_missing",
      "Could not append the submission.": "sheet_append_failed",
      "Google authorization failed.": "google_authorization_failed",
      "Google authorization returned an invalid response.":
        "google_authorization_invalid_response",
    };
    console.error("Form submission failed.", {
      stage: submissionStage,
      reason:
        error instanceof SheetsSubmissionError
          ? error.reason
          : knownReasons[message] || "unexpected_error",
      ...(error instanceof SheetsSubmissionError && error.upstreamStatus
        ? { upstreamStatus: error.upstreamStatus }
        : {}),
    });
    respond(response, 502, {
      error: "The submission could not be saved. Please try again later.",
    });
  }
}
