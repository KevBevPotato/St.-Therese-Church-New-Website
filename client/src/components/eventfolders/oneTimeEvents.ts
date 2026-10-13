import { CalendarEvent } from "./types";
import { visibleContent } from "../../data/visible-content";

function getEventDate(dateValue: string, timeValue: string): Date {
  const dateString =
    dateValue.length === 10 ? `${dateValue}T00:00:00` : dateValue;
  const date = new Date(dateString);
  if (dateValue.length !== 10 || Number.isNaN(date.getTime())) return date;

  const times = Array.from(
    timeValue.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi)
  );
  const firstTime = times[0];
  if (!firstTime) return date;

  const meridiem = firstTime[3] || times.find(match => match[3])?.[3];
  let hours = Number(firstTime[1]);
  const minutes = Number(firstTime[2] || 0);
  if (meridiem?.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (meridiem?.toLowerCase() === "am" && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59) return date;

  date.setHours(hours, minutes, 0, 0);
  return date;
}

const eventEntries = Object.entries(
  import.meta.glob<{ default: Record<string, any> }>(
    "./one-time-events/*.json",
    {
      eager: true,
    }
  )
).filter(([, module]) => !module.default.isHidden).map(([path, module]) => {
  const event = module.default;
  return {
    ...visibleContent(event),
    id:
      event.id ||
      path.split("/").at(-1)?.replace(/\.json$/, "") ||
      "event",
  };
});

export const oneTimeEvents: CalendarEvent[] = eventEntries.map((event: any) => {
  return {
    ...event,
    date: getEventDate(event.date, event.time || ""),
    categories: (event.categories || []).map((c: any) => {
      if (typeof c === "object" && c.category) return c.category;
      if (typeof c === "string") return c.trim();
      return "parishEvents";
    }),
  };
});
