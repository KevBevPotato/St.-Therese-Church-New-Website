export function canonicalizeEventId(eventId: string): string {
  return eventId.replace(
    /^wednesday-faith-formatioin(?=-|$)/,
    "wednesday-faith-formation"
  );
}

export function getEventDetailPath(eventId: string): string {
  return `/events/${canonicalizeEventId(eventId)}`;
}
