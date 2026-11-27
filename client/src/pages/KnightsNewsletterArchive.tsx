import { Link } from "wouter";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getOrganizationById } from "@/data/organizations";
import { getArchivedKnightsNewsletters } from "@/lib/knights-newsletters";

export default function KnightsNewsletterArchive() {
  const organization = getOrganizationById("knights-of-columbus");
  const newsletters = getArchivedKnightsNewsletters(organization?.newsletters);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-12">
          <Link
            href="/knights-of-columbus"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to Knights of
            Columbus
          </Link>
          <div className="mb-4 flex items-center gap-3">
            <FileText className="text-accent" size={28} aria-hidden="true" />
            <h1 className="font-serif text-5xl font-bold text-primary md:text-6xl">
              Knights Newsletter Archive
            </h1>
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Browse past newsletters from the Knights of Columbus. Current
            newsletters appear on the Knights page until their expiration date.
          </p>
        </div>

        {newsletters.length === 0 ? (
          <Card className="rounded-3xl border border-primary/12 bg-white p-12 text-center">
            <FileText
              className="mx-auto mb-4 text-primary/40"
              size={48}
              aria-hidden="true"
            />
            <h2 className="mb-2 font-serif text-2xl font-bold text-primary">
              No archived newsletters yet
            </h2>
            <p className="text-sm text-muted-foreground">
              Expired newsletters will appear here automatically.
            </p>
          </Card>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground/80">
              {newsletters.length}{" "}
              {newsletters.length === 1 ? "newsletter" : "newsletters"}{" "}
              available
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {newsletters.map(newsletter => (
                <Card
                  key={`${newsletter.pdfUrl}-${newsletter.title}`}
                  className="rounded-2xl border border-primary/12 bg-white p-6 transition-all hover:border-accent/40 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <FileText
                        className="mt-1 shrink-0 text-accent"
                        size={22}
                        aria-hidden="true"
                      />
                      <h2 className="font-serif text-xl font-bold text-primary">
                        {newsletter.title}
                      </h2>
                    </div>
                    <a
                      href={newsletter.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${newsletter.title} PDF`}
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
