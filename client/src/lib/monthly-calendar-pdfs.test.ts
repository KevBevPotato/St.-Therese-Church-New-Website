import { describe, expect, it } from "vitest";
import {
  getAllMonthlyCalendarPdfs,
  getUpcomingMonthlyCalendarPdfs,
} from "./monthly-calendar-pdfs";

describe("getUpcomingMonthlyCalendarPdfs", () => {
  it("shows the first two non-expired PDFs, including the upcoming month", () => {
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
      getUpcomingMonthlyCalendarPdfs(pdfs, new Date(2026, 10, 19)).map(
        ({ label }) => label
      )
    ).toEqual(["November", "December"]);
  });

  it("moves the next non-expired PDF into the first position after a range expires", () => {
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
      getUpcomingMonthlyCalendarPdfs(pdfs, new Date(2026, 11, 1)).map(
        ({ label }) => label
      )
    ).toEqual(["December"]);
    expect(getUpcomingMonthlyCalendarPdfs(pdfs, new Date(2027, 0, 1))).toEqual(
      []
    );
  });

  it("includes a PDF on its last date", () => {
    const pdf = {
      label: "November",
      pdfUrl: "/nov.pdf",
      startDate: "2026-11-01",
      endDate: "2026-11-30",
    };

    expect(
      getUpcomingMonthlyCalendarPdfs([pdf], new Date(2026, 10, 30))
    ).toEqual([pdf]);
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

    expect(getUpcomingMonthlyCalendarPdfs(pdfs, new Date(2026, 0, 15))).toEqual(
      []
    );
  });
});

describe("getAllMonthlyCalendarPdfs", () => {
  it("includes past, current, and future PDFs in newest-first order", () => {
    const pdfs = [
      {
        label: "November",
        pdfUrl: "/nov.pdf",
        startDate: "2026-11-01",
        endDate: "2026-11-30",
      },
      {
        label: "October",
        pdfUrl: "/oct.pdf",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
      },
      {
        label: "December",
        pdfUrl: "/dec.pdf",
        startDate: "2026-12-01",
        endDate: "2026-12-31",
      },
    ];

    expect(getAllMonthlyCalendarPdfs(pdfs).map(({ label }) => label)).toEqual([
      "December",
      "November",
      "October",
    ]);
  });
});
