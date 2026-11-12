import { describe, expect, it } from "vitest";
import { recurringEventForDate } from "./events";

const recurringRule = {
  id: "weekday-mass",
  title: "Daily Mass",
  time: "7:30 AM",
  location: "Main Sanctuary",
  categories: [{ category: "sacramental" }],
  description: "Weekday Mass.",
};

describe("recurringEventForDate", () => {
  it("applies only the date-specific details and inherits the rest", () => {
    const event = recurringEventForDate(recurringRule, "2026-11-13", {
      date: "2026-11-13",
      action: "override",
      location: "Chapel",
    });

    expect(event).toMatchObject({
      title: "Daily Mass",
      time: "7:30 AM",
      location: "Chapel",
    });
  });

  it("creates a cancellation notice and allows a custom title such as No Mass", () => {
    const event = recurringEventForDate(recurringRule, "2026-11-13", {
      date: "2026-11-13",
      action: "cancelled",
      title: "No Mass",
    });

    expect(event).toMatchObject({
      title: "No Mass",
      time: "7:30 AM",
      location: "Main Sanctuary",
    });
  });

  it("uses a default cancellation title when none is provided", () => {
    const event = recurringEventForDate(recurringRule, "2026-11-13", {
      date: "2026-11-13",
      action: "cancelled",
    });

    expect(event?.title).toBe("Canceled");
  });

  it("removes a date-specific occurrence", () => {
    expect(
      recurringEventForDate(recurringRule, "2026-11-13", {
        date: "2026-11-13",
        action: "skip",
      })
    ).toBeNull();
  });
});
