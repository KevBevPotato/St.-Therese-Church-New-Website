import { describe, expect, it } from "vitest";
import { canonicalizeEventId, getCustomLandingPage } from "./eventLandingPages";
import { getEventDetailPath } from "./eventIds";

describe("getCustomLandingPage", () => {
  it("uses one shared Mass page for daily, Saturday, and Sunday Mass events", () => {
    const dailyMassPage = getCustomLandingPage("daily-mass-2026-11-26");

    expect(dailyMassPage).not.toBeNull();
    expect(getCustomLandingPage("saturday-vigil-mass-2026-11-21")).toBe(
      dailyMassPage
    );
    expect(getCustomLandingPage("sunday-mass-9am-2026-11-22")).toBe(
      dailyMassPage
    );
    expect(getCustomLandingPage("sunday-mass-530pm-2026-11-22")).toBe(
      dailyMassPage
    );
  });

  it("uses the Daily Rosary page for Daily and Family Rosary events", () => {
    const dailyRosaryPage = getCustomLandingPage("daily-rosary-2026-11-20");

    expect(dailyRosaryPage).not.toBeNull();
    expect(getCustomLandingPage("family-rosary-2026-11-22")).toBe(
      dailyRosaryPage
    );
  });

  it("uses the Adoration and Confession page for Holy Hour events", () => {
    const adorationPage = getCustomLandingPage(
      "adoration-confession-2026-11-22"
    );

    expect(adorationPage).not.toBeNull();
    expect(getCustomLandingPage("holy-hour-2026-11-20")).toBe(adorationPage);
  });

  it("uses one shared page for Wednesday Faith Formation events", () => {
    const faithFormationPage = getCustomLandingPage(
      "wednesday-faith-formation-xlt-2026-11-04"
    );

    expect(faithFormationPage).not.toBeNull();
    expect(getCustomLandingPage("wednesday-faith-formation-2026-11-18")).toBe(
      faithFormationPage
    );
    expect(
      getCustomLandingPage("teacher-night-2026-11-18", ["faith-formation"])
    ).toBe(faithFormationPage);
  });

  it("uses the Connect Groups landing page for Connect Groups events", () => {
    expect(getCustomLandingPage("connect-groups-2026-11-24")).not.toBeNull();
  });

  it("corrects the misspelled Wednesday Faith Formation event URL", () => {
    expect(canonicalizeEventId("wednesday-faith-formatioin-2026-11-18")).toBe(
      "wednesday-faith-formation-2026-11-18"
    );
    expect(
      getEventDetailPath(
        "wednesday-faith-formatioin-20261013211824-2026-11-25"
      )
    ).toBe(
      "/events/wednesday-faith-formation-20261013211824-2026-11-25"
    );
  });

  it("falls back to the generic page for events without a custom landing page", () => {
    expect(getCustomLandingPage("parish-dinner-2026-11-21")).toBeNull();
  });
});
