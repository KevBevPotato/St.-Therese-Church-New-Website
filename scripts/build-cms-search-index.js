import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const outputPath = path.join(
  projectRoot,
  "dist",
  "admin",
  "content-search-index.json"
);

const contentSources = [
  {
    file: "client/src/data/hero_data.json",
    collection: "homepage",
    entry: "hero_video",
    label: "Home Page · Hero Video & Text Options",
  },
  {
    file: "client/src/data/home_contact_data.json",
    collection: "homepage",
    entry: "home_contact",
    label: "Home Page · Contact Info",
  },
  {
    file: "client/src/data/staff_data.json",
    collection: "staff",
    entry: "staff_file",
    label: "About & Staff · Staff Directory",
    listKey: "staff",
  },
  {
    file: "client/src/data/about_page_data.json",
    collection: "staff",
    entry: "about_page_text",
    label: "About & Staff · About Page Text",
  },
  {
    file: "client/src/components/eventfolders/oneTimeEvents.json",
    collection: "events",
    entry: "one_time",
    label: "Parish Events · One-Time Events",
    listKey: "events",
  },
  {
    file: "client/src/components/eventfolders/recurringRules.json",
    collection: "events",
    entry: "rules_file",
    label: "Parish Events · Recurring Events",
    listKey: "rules",
    recurring: true,
  },
  {
    file: "client/src/data/bulletins_data.json",
    collection: "bulletins",
    entry: "bulletins_file",
    label: "Parish Bulletins",
    listKey: "bulletins",
  },
  {
    file: "client/src/data/resources_data.json",
    collection: "resources",
    entry: "resources_file",
    label: "Resource Page",
  },
  {
    file: "client/src/data/faith-formation.json",
    collection: "faith_formation",
    entry: "faith_formation_file",
    label: "Faith Formation",
    listKey: "categories",
  },
  {
    file: "client/src/data/get-involved_data.json",
    collection: "get_involved",
    entry: "get_involved_file",
    label: "Get Involved",
    listKey: "opportunities",
  },
];

function stringsIn(value) {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return [String(value)];
  }
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(stringsIn);
  return [];
}

function displayName(item, fallback) {
  return (
    item.title ||
    item.name ||
    item.label ||
    item.question ||
    item.id ||
    fallback
  );
}

function parseLocalDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  )
    return null;
  return date;
}

function getRecurringDates(rule) {
  const schedule = rule.schedule || rule;
  const start = parseLocalDate(schedule.startDate);
  if (!start) return [];
  const configuredEnd = parseLocalDate(schedule.endDate);
  const end =
    configuredEnd ||
    new Date(start.getFullYear() + 2, start.getMonth(), start.getDate());
  const excluded = new Set(
    (schedule.exclusions || []).map(item =>
      typeof item === "string" ? item : item.date
    )
  );
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dates = [];

  for (
    const date = new Date(start);
    date <= end && dates.length < 500;
    date.setDate(date.getDate() + 1)
  ) {
    const weekdayMatches =
      date.getDay() === weekdays.indexOf(schedule.dayOfWeek);
    const ordinal = Math.ceil(date.getDate() / 7);
    let occurs = false;
    if (schedule.recurrenceType === "daily") occurs = true;
    if (schedule.recurrenceType === "weekly") occurs = weekdayMatches;
    if (schedule.recurrenceType === "monthly")
      occurs = weekdayMatches && ordinal === Number(schedule.ordinalWeek);
    if (schedule.recurrenceType === "last_of_month") {
      occurs =
        weekdayMatches &&
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 7
        ).getMonth() !== date.getMonth();
    }
    if (occurs) {
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      dates.push(`${dateString}${excluded.has(dateString) ? " excluded" : ""}`);
    }
  }
  return dates;
}

function routeFor(collection, entry) {
  return `#/collections/${encodeURIComponent(collection)}/entries/${encodeURIComponent(entry)}`;
}

function createDocument(item, fallback, source, extraText = []) {
  const title = displayName(item, fallback);
  return {
    title,
    section: source.label,
    text: [...stringsIn(item), ...extraText].join(" "),
    route: routeFor(source.collection, source.entry),
  };
}

function collectDocuments(data, source) {
  const docs = [];
  const indexedItems = new WeakSet();
  if (source.listKey && Array.isArray(data[source.listKey])) {
    for (const item of data[source.listKey]) {
      const extras = source.recurring ? getRecurringDates(item) : [];
      docs.push(createDocument(item, source.label, source, extras));
      indexedItems.add(item);
    }
  } else {
    docs.push(createDocument(data, source.label, source));
    indexedItems.add(data);
  }

  function indexNested(value, fallback) {
    if (Array.isArray(value)) {
      for (const item of value) indexNested(item, fallback);
    } else if (value && typeof value === "object") {
      if (!indexedItems.has(value)) {
        const title = displayName(value, "");
        if (title) {
          docs.push(createDocument(value, title, source));
          indexedItems.add(value);
        }
      }
      for (const [key, child] of Object.entries(value)) indexNested(child, key);
    }
  }
  indexNested(data, source.label);

  return docs;
}

const documents = [];
for (const source of contentSources) {
  const data = JSON.parse(
    fs.readFileSync(path.join(projectRoot, source.file), "utf8")
  );
  documents.push(...collectDocuments(data, source));
}

const organizationDirectory = path.join(
  projectRoot,
  "client/src/data/organization-pages"
);
for (const filename of fs
  .readdirSync(organizationDirectory)
  .filter(name => name.endsWith(".json"))) {
  const entry = path.basename(filename, ".json");
  const data = JSON.parse(
    fs.readFileSync(path.join(organizationDirectory, filename), "utf8")
  );
  const source = {
    collection: "organizations",
    entry,
    label: `Organization Landing Pages · ${data.name}`,
  };
  documents.push(createDocument(data, data.name, source));
  for (const listKey of ["stats", "officers", "members"]) {
    for (const item of data[listKey] || []) {
      documents.push(createDocument(item, data.name, source));
    }
  }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify({ documents }, null, 2)}\n`);
console.log(
  `Generated CMS search index with ${documents.length} searchable entries.`
);
