import { describe, expect, it } from "vitest";
import {
  generateRecurringEventsForMonth,
  recurringEventForDate,
  recurringEventsForDate,
} from "./events";

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

describe("recurringEventsForDate", () => {
  it("generates separate weekday and Saturday schedules for one event", () => {
    const rule = {
      ...recurringRule,
      schedule: {
        startDate: "2026-11-01",
        recurrenceType: "weekly",
        daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      additionalSchedules: [
        {
          time: "8:00 AM",
          schedule: {
            startDate: "2026-11-01",
            recurrenceType: "weekly",
            daysOfWeek: ["Saturday"],
          },
        },
      ],
    };

    expect(
      recurringEventsForDate(rule, "2026-11-14").map(event => ({
        title: event.title,
        time: event.time,
        id: event.id,
      }))
    ).toEqual([
      {
        title: "Daily Mass",
        time: "8:00 AM",
        id: "weekday-mass-schedule-1-2026-11-14",
      },
    ]);

    expect(
      recurringEventsForDate(rule, "2026-11-13").map(event => event.time)
    ).toEqual(["7:30 AM"]);
  });

  it("adds a one-time occurrence on a date outside the recurring pattern", () => {
    const rule = {
      ...recurringRule,
      schedule: {
        startDate: "2026-11-01",
        recurrenceType: "weekly",
        daysOfWeek: ["Friday"],
        occurrenceOverrides: [
          {
            date: "2026-11-18",
            action: "override",
            time: "10:00 AM",
          },
        ],
      },
    };

    expect(
      recurringEventsForDate(rule, "2026-11-18").map(event => ({
        title: event.title,
        time: event.time,
      }))
    ).toEqual([{ title: "Daily Mass", time: "10:00 AM" }]);
  });

  it("defaults a monthly recurrence to the selected weekday in the first week", () => {
    const rule = {
      ...recurringRule,
      schedule: {
        startDate: "2026-11-01",
        recurrenceType: "monthly",
        dayOfWeek: "Friday",
      },
    };

    expect(recurringEventsForDate(rule, "2026-11-06")).toHaveLength(1);
    expect(recurringEventsForDate(rule, "2026-11-13")).toHaveLength(0);
  });
});

describe("generateRecurringEventsForMonth", () => {
  it("uses the correctly spelled Wednesday Faith Formation event URL", () => {
    const events = generateRecurringEventsForMonth(9, 2026);

    expect(
      events.some(event => event.id === "wednesday-faith-formation-2026-10-21")
    ).toBe(true);
  });

  it("generates CMS weekday Mass and Rosary once per selected day", () => {
    const events = generateRecurringEventsForMonth(10, 2026);
    const dailyMasses = events.filter(event => event.title === "Daily Mass");
    const dailyRosaries = events.filter(event => event.title === "Daily Rosary");

    expect(dailyMasses).toHaveLength(11);
    expect(events.filter(event => event.title === "No Daily Mass")).toHaveLength(1);
    expect(dailyMasses.every(event => event.time === "7:30 AM")).toBe(true);
    expect(
      dailyMasses.every(event => [1, 2, 3, 4, 5].includes(event.date.getDay()))
    ).toBe(true);
    expect(dailyRosaries).toHaveLength(12);
    expect(dailyRosaries.every(event => event.time === "7:00 AM")).toBe(true);
  });

  it("generates the CMS weekend Masses, Family Rosary, and Holy Hour", () => {
    const events = generateRecurringEventsForMonth(10, 2026);

    expect(
      events.filter(event => event.title === "Saturday Vigil Mass")
    ).toHaveLength(3);
    expect(
      events.filter(event => event.title === "Sunday Mass (9:00 AM)")
    ).toHaveLength(3);
    expect(
      events.filter(event => event.title === "Sunday Mass (5:30 PM)")
    ).toHaveLength(3);
    expect(events.filter(event => event.title === "Family Rosary")).toHaveLength(3);
    expect(events.filter(event => event.title === "Holy Hour")).toHaveLength(3);
  });

  it("continues to honor existing single-weekday CMS rules", () => {
    const events = generateRecurringEventsForMonth(10, 2026);
    const wednesdayFormation = events.filter(
      event => event.title === "Wednesday Faith Formation"
    );

    expect(wednesdayFormation.length).toBeGreaterThan(0);
    expect(wednesdayFormation.every(event => event.date.getDay() === 3)).toBe(true);
  });
});
