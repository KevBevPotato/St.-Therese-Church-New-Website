import { describe, expect, it } from "vitest";
import { getActiveMonthlyCalendarPdfs } from "./monthly-calendar-pdfs";

describe("getActiveMonthlyCalendarPdfs", () => {
  it("shows at most the first two PDFs active on the current date", () => {
    const pdfs = [
      {
        label: "November",
        pdfUrl: "/nov.pdf",
        startDate: "2026-11-01",
        endDate: "2026-11-30",
      },
      {
        label: "December",
        pdfUrl: "/dec.pdf",
        startDate: "2026-12-01",
        endDate: "2026-12-31",
      },
      {
        label: "Extra",
        pdfUrl: "/extra.pdf",
        startDate: "2026-01-01",
        endDate: "2026-12-31",
      },
    ];

    expect(
      getActiveMonthlyCalendarPdfs(pdfs, new Date(2026, 10, 19)).map(
        ({ label }) => label
      )
    ).toEqual(["November", "Extra"]);
  });

  it("moves the next active PDF into the first position after a date range expires", () => {
    const pdfs = [
      {
        label: "November",
        pdfUrl: "/nov.pdf",
        startDate: "2026-11-01",
        endDate: "2026-11-30",
      },
      {
        label: "December",
        pdfUrl: "/dec.pdf",
        startDate: "2026-12-01",
        endDate: "2026-12-31",
      },
    ];

    expect(
      getActiveMonthlyCalendarPdfs(pdfs, new Date(2026, 11, 1)).map(
        ({ label }) => label
      )
    ).toEqual(["December"]);
    expect(getActiveMonthlyCalendarPdfs(pdfs, new Date(2027, 0, 1))).toEqual(
      []
    );
  });

  it("includes both the first and last dates in a PDF's date range", () => {
    const pdf = {
      label: "November",
      pdfUrl: "/nov.pdf",
      startDate: "2026-11-01",
      endDate: "2026-11-30",
    };

    expect(getActiveMonthlyCalendarPdfs([pdf], new Date(2026, 10, 1))).toEqual([
      pdf,
    ]);
    expect(getActiveMonthlyCalendarPdfs([pdf], new Date(2026, 10, 30))).toEqual(
      [pdf]
    );
  });

  it("omits PDFs with invalid dates or missing required content", () => {
    const pdfs = [
      {
        label: "Invalid range",
        pdfUrl: "/invalid.pdf",
        startDate: "2026-02-30",
        endDate: "2026-03-01",
      },
      {
        label: "Missing PDF",
        pdfUrl: "",
        startDate: "2026-01-01",
        endDate: "2026-01-31",
      },
      { label: "Missing dates", pdfUrl: "/unscheduled.pdf" },
    ];

    expect(getActiveMonthlyCalendarPdfs(pdfs, new Date(2026, 0, 15))).toEqual(
      []
    );
  });
});
