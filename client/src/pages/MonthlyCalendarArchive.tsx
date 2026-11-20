import { Link } from "wouter";
import { ArrowLeft, CalendarDays, ExternalLink, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroData from "@/data/hero_data.json";
import { getAllMonthlyCalendarPdfs } from "@/lib/monthly-calendar-pdfs";

const monthlyCalendarPdfs = getAllMonthlyCalendarPdfs(
  heroData.monthlyCalendarPdfs
);

function formatMonthRange(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const monthYear = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return monthYear.format(start);
  }

  return `${monthYear.format(start)} – ${monthYear.format(end)}`;
}

export default function MonthlyCalendarArchive() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to Parish Calendar
          </Link>
          <div className="mb-4 flex items-center gap-3">
            <CalendarDays
              className="text-accent"
              size={28}
              aria-hidden="true"
            />
            <h1 className="font-serif text-5xl font-bold text-primary md:text-6xl">
              Monthly Calendar Archive
            </h1>
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Browse and download monthly parish calendars, including the current
            calendar.
          </p>
        </div>

        {monthlyCalendarPdfs.length === 0 ? (
          <Card className="rounded-3xl border border-primary/12 bg-white p-12 text-center">
            <FileText
              className="mx-auto mb-4 text-primary/40"
              size={48}
              aria-hidden="true"
            />
            <h2 className="mb-2 font-serif text-2xl font-bold text-primary">
              No monthly calendars available yet
            </h2>
            <p className="text-sm text-muted-foreground">
              Monthly calendars will appear here once they are added.
            </p>
          </Card>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground/80">
              {monthlyCalendarPdfs.length}{" "}
              {monthlyCalendarPdfs.length === 1 ? "calendar" : "calendars"}{" "}
              available
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {monthlyCalendarPdfs.map((pdf) => (
                <Card
                  key={`${pdf.pdfUrl}-${pdf.startDate}`}
                  className="rounded-2xl border border-primary/12 bg-white p-6 transition-all hover:border-accent/40 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <CalendarDays
                        className="mt-1 shrink-0 text-accent"
                        size={22}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-accent">
                          {formatMonthRange(pdf.startDate, pdf.endDate)}
                        </p>
                        <h2 className="mt-1 font-serif text-xl font-bold text-primary">
                          {pdf.label}
                        </h2>
                      </div>
                    </div>
                    <a
                      href={pdf.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${pdf.label} PDF`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-accent/90 hover:shadow-lg"
                    >
                      <ExternalLink size={14} aria-hidden="true" />
                      View PDF
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
