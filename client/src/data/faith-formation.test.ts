import { describe, expect, it } from "vitest";
import { getActiveFaithPotlucks, type FaithPotluck } from "./faith-formation";

const potlucks: FaithPotluck[] = [
  {
    label: "Earlier",
    url: "https://example.com/earlier",
    expiresOn: "2026-11-23",
  },
  {
    label: "Today",
    url: "https://example.com/today",
    expiresOn: "2026-11-24",
  },
  {
    label: "Upcoming",
    url: "https://example.com/upcoming",
    expiresOn: "2026-11-25",
  },
];

describe("getActiveFaithPotlucks", () => {
  it("hides links on their expiration date and keeps later ones", () => {
    expect(
      getActiveFaithPotlucks(potlucks, new Date(2026, 10, 24)).map(
        potluck => potluck.label
      )
    ).toEqual(["Upcoming"]);
  });
});
