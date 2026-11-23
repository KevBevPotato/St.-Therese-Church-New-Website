import {
  CalendarDays,
  Clock,
  Download,
  MapPin,
} from "lucide-react";
import type { EventLandingPageProps } from "@/components/eventfolders/types";
import { EventMedia } from "@/components/EventMedia";
import CmsMarkdown from "@/components/CmsMarkdown";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import getInvolvedData from "@/data/get-involved";

interface Resource {
  title: string;
  description?: string;
  document: string;
}

interface AdorationConfessionPageContent {
  eyebrow?: string;
  title?: string;
  introduction?: string;
  heroImage?: string;
  heroImageAlt?: string;
  resourcesTitle?: string;
  resourcesIntroduction?: string;
  resources?: Resource[];
}

export default function AdorationConfession({
  event,
}: EventLandingPageProps) {
  const page = getInvolvedData.settings.parishLifePages
    ?.adorationConfessionPage as AdorationConfessionPageContent | undefined;
  const resources = (page?.resources ?? []).filter(
    resource =>
      typeof resource?.title === "string" &&
      resource.title.trim().length > 0 &&
      typeof resource?.document === "string" &&
      resource.document.trim().length > 0
  );
  const hasEventMedia = Boolean(
    event.image?.trim() ||
      event.photos?.some(photo => typeof photo === "string" && photo.trim()) ||
      event.gallery?.some(
        item => typeof item?.photo === "string" && item.photo.trim()
      )
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="flex-grow">
        <section className="border-b border-primary/10 bg-white py-16 md:py-20">
          <div
            className={`container mx-auto max-w-6xl px-4 ${
              page?.heroImage
                ? "grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center"
                : ""
            }`}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                {page?.eyebrow || "Sacramental Life"}
              </p>
              <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-primary md:text-7xl">
                {page?.title || "Adoration & Confession"}
              </h1>
              <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                <CmsMarkdown>
                  {page?.introduction ||
                    "Spend time in prayer before the Blessed Sacrament and encounter God's mercy in the Sacrament of Reconciliation."}
                </CmsMarkdown>
              </div>
            </div>

            {page?.heroImage && (
              <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-primary/10 bg-[#fbfaf6] shadow-lg">
                <img
                    src={page.heroImage}
                    alt={page.heroImageAlt || ""}
                    className="size-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="container mx-auto mt-10 max-w-6xl px-4">
            <Card className="grid gap-5 rounded-3xl border border-primary/10 bg-[#fbfaf6] p-7 shadow-sm md:grid-cols-3 md:items-center">
              <h2 className="font-serif text-2xl font-bold text-primary">
                When & Where
              </h2>
              <div className="flex items-start gap-3">
                <CalendarDays
                  className="mt-0.5 size-5 shrink-0 text-[#9b762f]"
                  aria-hidden="true"
                />
                <p className="font-semibold text-primary">
                  {event.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock
                  className="mt-0.5 size-5 shrink-0 text-[#9b762f]"
                  aria-hidden="true"
                />
                <p className="font-semibold text-primary">{event.time}</p>
              </div>
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-[#9b762f]"
                    aria-hidden="true"
                  />
                  <p className="font-semibold text-primary">{event.location}</p>
                </div>
              )}
            </Card>
          </div>
        </section>

        {hasEventMedia && (
          <section className="border-b border-primary/10 bg-white py-12 md:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <EventMedia
                event={event}
                galleryTitle="Adoration & Confession Gallery"
                includeCarouselPhotosInGallery
              />
            </div>
          </section>
        )}

        {resources.length > 0 && (
          <section className="border-y border-primary/10 bg-[#f3efe5] py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
                  {page?.resourcesTitle || "Resources"}
                </h2>
                {page?.resourcesIntroduction && (
                  <div className="mt-4 leading-relaxed text-muted-foreground">
                    <CmsMarkdown>{page.resourcesIntroduction}</CmsMarkdown>
                  </div>
                )}
              </div>
              <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
                {resources.map((resource, index) => (
                  <Card
                    key={`${resource.title}-${index}`}
                    className="flex flex-col border border-primary/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <div>
                      <h3 className="font-serif text-xl font-bold text-primary">
                        {resource.title}
                      </h3>
                      {resource.description && (
                        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          <CmsMarkdown>{resource.description}</CmsMarkdown>
                        </div>
                      )}
                    </div>
                    <a
                      href={resource.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-primary/15 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white sm:mt-0"
                    >
                      <Download className="size-4" aria-hidden="true" />
                      Download
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
