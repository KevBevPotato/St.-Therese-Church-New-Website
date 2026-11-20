import { describe, expect, it } from "vitest";
import { getCustomLandingPage } from "./eventLandingPages";

describe("getCustomLandingPage", () => {
  it("uses one shared Mass page for daily and Sunday Mass events", () => {
    const dailyMassPage = getCustomLandingPage("daily-mass-2026-11-26");

    expect(dailyMassPage).not.toBeNull();
    expect(getCustomLandingPage("sunday-mass-9am-2026-11-22")).toBe(
      dailyMassPage
    );
    expect(getCustomLandingPage("sunday-mass-530pm-2026-11-22")).toBe(
      dailyMassPage
    );
  });

  it("keeps the custom landing page for recurring Rosary events", () => {
    expect(getCustomLandingPage("daily-rosary-2026-11-20")).not.toBeNull();
    expect(getCustomLandingPage("daily-rosary-2026-11-20")).not.toBeNull();
  });

  it("uses a custom landing page for Adoration and Confession events", () => {
    expect(
      getCustomLandingPage("adoration-confession-2026-11-22")
    ).not.toBeNull();
  });

  it("falls back to the generic page for events without a custom landing page", () => {
    expect(getCustomLandingPage("parish-dinner-2026-11-21")).toBeNull();
  });
});
