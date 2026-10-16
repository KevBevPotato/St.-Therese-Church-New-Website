import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

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
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ENGAGEMENT_TABS: Record<string, string> = {
  pledge: "Get Involved",
  signup: "Get Involved",
  suggestion: "Suggestions",
  referral: "Referrals",
  request_help: "Request Help",
};
const POWERCHURCH_TRACKING_TABS = new Set([
  "Parish Registrations",
  "Faith Formation",
  "Suggestions",
  "Referrals",
  "Get Involved",
  "Request Help",
]);
const POWERCHURCH_TRACKING_HEADER = "Uploaded to PowerChurch?";
const ALLOWED_ENGAGEMENT_IDS = new Set([
  "pledge-nursery",
  "pledge-supper-week",
  "signup-lector",
  "signup-usher",
  "signup-music",
  "signup-supper",
  "signup-youth-mentor",
  "signup-nursery-help",
  "request-help",
  "suggestion",
  "referral",
]);
const ENGAGEMENT_FORM_NAMES: Record<string, string> = {
  "pledge-nursery": "Nursery Pledge",
  "pledge-supper-week": "Wednesday Supper Pledge",
  "signup-lector": "Lector Signup",
  "signup-usher": "Usher Signup",
  "signup-music": "Music Ministry Signup",
  "signup-supper": "Wednesday Supper Signup",
  "signup-youth-mentor": "Youth Mentor Signup",
  "signup-nursery-help": "Nursery Volunteer Signup",
  "request-help": "Request Help",
  suggestion: "Suggestion",
  referral: "Referral",
};
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
  "request_details",
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
  "number_of_children",
  "father_full_name",
  "father_religion",
  "father_cell",
  "father_email",
  "father_contact_preference",
  "mother_full_name",
  "mother_religion",
  "mother_cell",
  "mother_email",
  "mother_contact_preference",
  "street_address",
  "city",
  "state",
  "zip_code",
  "is_member",
  "mass_attendance",
  "tuition_option",
  "tuition_paid",
  "needs_financial_assistance",
  "special_needs",
  "parent_1_first_name",
  "parent_1_last_name",
  "parent_1_relationship",
  "parent_1_other_relationship",
  "parent_1_cell",
  "parent_1_religion",
  "parent_1_email",
  "parent_2_first_name",
  "parent_2_last_name",
  "parent_2_relationship",
  "parent_2_other_relationship",
  "parent_2_cell",
  "parent_2_religion",
  "parent_2_email",
  "has_second_parent",
  "parent_2_different_address",
  "parent_2_street_address",
  "parent_2_city",
  "parent_2_zip_code",
  "same_emergency_contact",
  "week_id",
  "week_date",
  "availability_type",
  "week_ids",
  "preferred_roles",
  "website",
]);
const FAITH_FORMATION_CHILD_FIELDS = new Set([
  "first_name",
  "last_name",
  "grade",
  "date_of_birth",
  "school",
  "emergency_contact_guardian_first_name",
  "sacraments_received",
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
  "previous_church_membership",
  "previous_church_address",
  "previous_church_city",
  "previous_church_state",
  "previous_church_zip",
  "previous_church_phone",
  "previous_church_email",
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
const ADULT_ONLY_FIELDS = ["marriage_date", "annulment_status"];
const CHILD_PERSON_FIELDS = [
  "first_name",
  "preferred_name",
  "last_name",
  "religion",
  "gender",
  "date_of_birth",
  "baptism",
  "baptism_year",
  "communion",
  "communion_year",
  "confirmation",
  "confirmation_year",
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
    CHILD_PERSON_FIELDS.includes(match[2])
  );
}

function isFaithFormationRegistrationField(key: string): boolean {
  const match = /^child_(\d{1,2})_(.+)$/.exec(key);
  return (
    !!match &&
    Number(match[1]) >= 1 &&
    Number(match[1]) <= 12 &&
    FAITH_FORMATION_CHILD_FIELDS.has(match[2])
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
      !(formType === "membership" && isMembershipField(key)) &&
      !(
        formType === "faith_formation_registration" &&
        isFaithFormationRegistrationField(key)
      )
    )
      return { error: "The submission has an unsupported field." };
    if (key === "quantity" || key === "pledge_amount") {
      if (
        (typeof value !== "string" &&
          (typeof value !== "number" || !Number.isFinite(value))) ||
        (typeof value === "string" && value.length > MAX_FIELD_LENGTH)
      ) {
        return { error: "A submission field is invalid or too long." };
      }
      continue;
    }
    if (typeof value !== "string" || value.length > MAX_FIELD_LENGTH) {
      return { error: "A submission field is invalid or too long." };
    }
  }

  if (getString(body, "website"))
    return { error: "The submission could not be accepted." };

  let required: string[];

  switch (formType) {
    case "interest":
    case "faith_formation": {
      required =
        formType === "faith_formation"
          ? []
          : ["from_name", "from_email", "interest", "context_opportunity"];
      const signupKind = getString(body, "signup_kind");
      const interestId = getString(body, "context_opportunity");
      if (!ALLOWED_INTEREST_IDS.has(interestId)) {
        return { error: "The requested signup is invalid." };
      }
      if (
        formType === "faith_formation" &&
        interestId !== "wednesday-faith-formation"
      ) {
        return { error: "The requested faith formation signup is invalid." };
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
      if (signupKind === "class_registration" && formType !== "faith_formation") {
        required.push("participant_name", "guardian_name");
      }
      break;
    }
    case "membership": {
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
    case "faith_formation_registration": {
      const childCount = Number(getString(body, "number_of_children"));
      if (!Number.isInteger(childCount) || childCount < 1 || childCount > 12) {
        return { error: "The number of children must be between 1 and 12." };
      }
      required = [
        "is_member",
        "parent_1_first_name",
        "parent_1_last_name",
        "parent_1_relationship",
        "parent_1_cell",
        "parent_1_religion",
        "parent_1_email",
        "street_address",
        "city",
        "zip_code",
        "has_second_parent",
        "parent_2_different_address",
        "same_emergency_contact",
      ];
      for (let child = 1; child <= childCount; child++) {
        required.push(
          `child_${child}_first_name`,
          `child_${child}_last_name`,
          `child_${child}_grade`,
          `child_${child}_date_of_birth`,
          `child_${child}_school`,
          `child_${child}_emergency_contact_guardian_first_name`,
        );
      }
      const relationshipFields = ["parent_1", "parent_2"];
      for (const parent of relationshipFields) {
        const isRequired = parent === "parent_1" || getString(body, "has_second_parent") === "true";
        const relationship = getString(body, `${parent}_relationship`);
        if (
          isRequired &&
          !["Father", "Mother", "Other"].includes(relationship)
        ) {
          return { error: `Please select a relationship for ${parent.replace("_", " ")}.` };
        }
        if (
          isRequired &&
          relationship === "Other" &&
          !getString(body, `${parent}_other_relationship`)
        ) {
          return { error: "Please specify the guardian's relationship to the child." };
        }
      }
      if (getString(body, "has_second_parent") === "true") {
        required.push(
          "parent_2_first_name",
          "parent_2_last_name",
          "parent_2_relationship",
          "parent_2_cell",
          "parent_2_religion",
          "parent_2_email",
        );
      }
      if (getString(body, "parent_2_different_address") === "true") {
        required.push(
          "parent_2_street_address",
          "parent_2_city",
          "parent_2_zip_code",
        );
      }
      if (!["Yes", "No"].includes(getString(body, "is_member"))) {
        return { error: "Please select whether you are a parish member." };
      }
      if (
        !["true", "false"].includes(getString(body, "has_second_parent")) ||
        !["true", "false"].includes(
          getString(body, "parent_2_different_address"),
        ) ||
        !["true", "false"].includes(
          getString(body, "same_emergency_contact"),
        )
      ) {
        return { error: "A registration option is invalid." };
      }
      if (
        childCount === 1 &&
        getString(body, "same_emergency_contact") === "true"
      ) {
        return {
          error: "Apply to all children is only available for multiple children.",
        };
      }
      if (
        getString(body, "parent_2_different_address") === "true" &&
        getString(body, "has_second_parent") !== "true"
      ) {
        return {
          error: "A separate address requires a second parent or guardian.",
        };
      }
      break;
    }
    case "pledge":
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
      required =
        engagementType === "pledge"
          ? ["from_name", "from_email", "item_id"]
          : engagementType === "referral"
            ? ["their_name", "their_phone"]
            : engagementType === "suggestion"
              ? ["from_email", "suggestion"]
              : engagementType === "request_help"
                ? ["from_name", "from_email", "request_details"]
                : ["from_name", "from_email"];
      break;
    }
    case "supper-volunteer":
      required = ["full_name", "email", "signup_mode"];
      if (!["specific", "willing"].includes(getString(body, "signup_mode"))) {
        return { error: "The signup mode is invalid." };
      }
      break;
    case "lector":
      required = ["from_name", "from_email", "sunday_mass"];
      break;
    default:
      return { error: "The requested form is invalid." };
  }

  if (required.some(key => !getString(body, key))) {
    return { error: "Please complete all required fields." };
  }

  for (const emailField of [
    "from_email",
    "email",
    "previous_church_email",
    "father_email",
    "mother_email",
    "parent_1_email",
    "parent_2_email",
  ]) {
    const email = getString(body, emailField);
    if (email && !EMAIL_PATTERN.test(email)) {
      return { error: "Please enter a valid email address." };
    }
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

  let tab: string | undefined;
  switch (formType) {
    case "membership":
      tab = "Parish Registrations";
      break;
    case "faith_formation_registration":
      tab = "Faith Formation";
      break;
    case "interest":
    case "faith_formation":
      tab = "Get Involved";
      break;
    case "engagement":
      tab = ENGAGEMENT_TABS[getString(body, "engagement_type")];
      break;
  }
  return { body, tab };
}

async function submitToGoogleSheet(
  body: JsonObject,
  sheetTitle: string | undefined
): Promise<void> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!email || !key || !sheetId) {
    throw new Error("Google Sheets is missing required environment variables.");
  }

  const auth = new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const spreadsheet = new GoogleSpreadsheet(sheetId, auth);
  await spreadsheet.loadInfo();
  await spreadsheet.updateProperties({ timeZone: "America/Denver" });

  const targetTab = sheetTitle ?? spreadsheet.sheetsByIndex[0]?.title;
  console.log("Google Sheets submission target.", {
    formType: getString(body, "form_type"),
    targetTab: targetTab ?? "No worksheet found",
  });
  let sheet = targetTab ? spreadsheet.sheetsByTitle[targetTab] : undefined;
  if (!sheet && targetTab) {
    sheet = await spreadsheet.addSheet({ title: targetTab });
  }
  if (!sheet) {
    throw new Error(
      targetTab
        ? `The Google spreadsheet does not contain a "${targetTab}" worksheet.`
        : "The Google spreadsheet does not contain a worksheet."
    );
  }

  const type = getString(body, "form_type");
  const engagementName =
    ENGAGEMENT_FORM_NAMES[getString(body, "engagement_id")];
  const formName =
    getString(body, "interest") ||
    getString(body, "project_title") ||
    engagementName ||
    ({
      faith_formation_registration: "Faith Formation Registration",
      membership: "Parish Membership Registration",
      pledge: "Parish Pledge",
      "supper-volunteer": "Wednesday Supper Volunteer",
      lector: "Lector Signup",
    }[type] ??
      type);
  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/Denver",
    hour12: true,
  });
  const submission: Record<string, string | number | boolean> = {
    "Time Submitted": submittedAt,
    form_name: formName,
  };
  for (const [key, value] of Object.entries(body)) {
    if (key === "website") continue;
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(
        "A validated form field cannot be written to Google Sheets."
      );
    }
    submission[key] = value;
  }
  if (POWERCHURCH_TRACKING_TABS.has(sheet.title)) {
    submission[POWERCHURCH_TRACKING_HEADER] = false;
  }
  if (type === "faith_formation_registration") {
    submission["Paid?"] = false;
    const childCount = Number(getString(body, "number_of_children"));
    const maximumTuition =
      getString(body, "is_member") === "Yes" ? 50 : 75;
    submission["Tuition Owed"] = Math.min(childCount * 25, maximumTuition);
  }

  let headers: string[];
  try {
    await sheet.loadHeaderRow();
    headers = [...sheet.headerValues];
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.startsWith("No values in the header row") ||
        error.message.startsWith("All your header cells are blank"))
    ) {
      headers = [];
    } else {
      throw error;
    }
  }

  const submittedAtIndex = headers.indexOf("submitted_at");
  const timeSubmittedIndex = headers.indexOf("Time Submitted");
  if (submittedAtIndex >= 0 && timeSubmittedIndex >= 0) {
    await sheet.deleteDimension("COLUMNS", {
      startIndex: submittedAtIndex,
      endIndex: submittedAtIndex + 1,
    });
    headers.splice(submittedAtIndex, 1);
  } else if (submittedAtIndex >= 0) {
    headers[submittedAtIndex] = "Time Submitted";
  }

  const oldPowerChurchHeaderIndex = headers.indexOf("Uploaded to PowerChurch");
  const powerChurchHeaderIndex = headers.indexOf(POWERCHURCH_TRACKING_HEADER);
  if (oldPowerChurchHeaderIndex >= 0 && powerChurchHeaderIndex >= 0) {
    await sheet.deleteDimension("COLUMNS", {
      startIndex: oldPowerChurchHeaderIndex,
      endIndex: oldPowerChurchHeaderIndex + 1,
    });
    headers.splice(oldPowerChurchHeaderIndex, 1);
  } else if (oldPowerChurchHeaderIndex >= 0) {
    headers[oldPowerChurchHeaderIndex] = POWERCHURCH_TRACKING_HEADER;
  }

  while (headers.length && !headers.at(-1)) headers.pop();
  const knownHeaders = new Set(headers.filter(Boolean));
  for (const key of Object.keys(submission)) {
    if (!knownHeaders.has(key)) {
      headers.push(key);
      knownHeaders.add(key);
    }
  }

  if (headers.length > sheet.columnCount) {
    await sheet.resize({
      rowCount: sheet.rowCount,
      columnCount: headers.length,
    });
  }

  if (type === "faith_formation_registration") {
    const firstHeaders = [POWERCHURCH_TRACKING_HEADER, "Paid?"];
    for (let destinationIndex = 0; destinationIndex < firstHeaders.length; destinationIndex++) {
      const header = firstHeaders[destinationIndex];
      const sourceIndex = headers.indexOf(header);
      if (sourceIndex !== destinationIndex) {
        await sheet.moveDimension(
          "COLUMNS",
          { startIndex: sourceIndex, endIndex: sourceIndex + 1 },
          destinationIndex,
        );
        const [movedHeader] = headers.splice(sourceIndex, 1);
        headers.splice(destinationIndex, 0, movedHeader);
      }
    }
  }

  await sheet.setHeaderRow(headers);
  await sheet.addRow(submission);

  for (const trackingHeader of [
    POWERCHURCH_TRACKING_HEADER,
    ...(type === "faith_formation_registration" ? ["Paid?"] : []),
  ]) {
    const columnIndex = headers.indexOf(trackingHeader);
    if (columnIndex >= 0) {
      await sheet.setDataValidation(
        {
          startRowIndex: 1,
          endRowIndex: Math.max(sheet.rowCount, 2),
          startColumnIndex: columnIndex,
          endColumnIndex: columnIndex + 1,
        },
        {
          condition: { type: "BOOLEAN", values: [] },
          strict: true,
          showCustomUi: true,
        },
      );
    }
  }
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
  if (validation.error || !validation.body) {
    respond(response, 400, {
      error: validation.error || "Invalid submission.",
    });
    return;
  }

  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY ||
    !process.env.GOOGLE_SHEET_ID
  ) {
    console.error("Form submission is not configured.", {
      reason: "missing_google_sheets_configuration",
    });
    respond(response, 503, {
      error: "Form submissions are temporarily unavailable.",
    });
    return;
  }

  try {
    await submitToGoogleSheet(validation.body, validation.tab);
    respond(response, 200, { success: true });
  } catch (error) {
    console.error("Form submission failed.", {
      stage: "google_sheets",
      reason: error instanceof Error ? error.message : "unexpected_error",
    });
    respond(response, 502, {
      error: "The submission could not be saved. Please try again later.",
    });
  }
}
