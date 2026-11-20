import { describe, expect, it } from "vitest";
import { getCustomLandingPage } from "./eventLandingPages";

describe("getCustomLandingPage", () => {
  it("uses the custom landing pages for recurring daily Mass and Rosary events", () => {
    expect(getCustomLandingPage("daily-mass-2026-11-26")).not.toBeNull();
    expect(getCustomLandingPage("daily-rosary-2026-11-20")).not.toBeNull();
  });

  it("falls back to the generic page for events without a custom landing page", () => {
    expect(getCustomLandingPage("parish-dinner-2026-11-21")).toBeNull();
  });
});
