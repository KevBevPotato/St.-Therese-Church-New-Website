import { describe, expect, it } from "vitest";
import {
  getArchivedKnightsNewsletters,
  getCurrentKnightsNewsletters,
  type KnightsNewsletter,
} from "./knights-newsletters";

const newsletters: KnightsNewsletter[] = [
  {
    title: "October",
    pdfUrl: "/october.pdf",
    expiresOn: "2026-10-31",
  },
  {
    title: "November",
    pdfUrl: "/november.pdf",
    expiresOn: "2026-11-30",
  },
  {
    title: "December",
    pdfUrl: "/december.pdf",
    expiresOn: "2026-12-31",
  },
];

describe("Knights newsletters", () => {
  it("keeps newsletters current through their expiration date", () => {
    expect(
      getCurrentKnightsNewsletters(newsletters, new Date(2026, 10, 30)).map(
        ({ title }) => title
      )
    ).toEqual(["November", "December"]);
  });

  it("moves expired newsletters into the archive, newest first", () => {
    expect(
      getArchivedKnightsNewsletters(newsletters, new Date(2026, 10, 1)).map(
        ({ title }) => title
      )
    ).toEqual(["October"]);
  });

  it("omits entries with invalid dates or missing content", () => {
    expect(
      getCurrentKnightsNewsletters(
        [
          ...newsletters,
          {
            title: "Invalid date",
            pdfUrl: "/invalid.pdf",
            expiresOn: "2026-02-30",
          },
          { title: "Missing PDF", pdfUrl: "", expiresOn: "2026-12-31" },
        ],
        new Date(2026, 10, 1)
      ).map(({ title }) => title)
    ).toEqual(["November", "December"]);
  });
});
