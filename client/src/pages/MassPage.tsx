import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  Cross,
  Download,
  MapPin,
} from "lucide-react";
import { Link } from "wouter";
import type { EventLandingPageProps } from "@/components/eventfolders/types";
import { EventMedia } from "@/components/EventMedia";
import CmsMarkdown from "@/components/CmsMarkdown";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import getInvolvedData from "@/data/get-involved";

type MassPageProps = Partial<EventLandingPageProps>;

export default function MassPage({ event }: MassPageProps) {
  const page = getInvolvedData.settings.parishLifePages?.massPage;
  const resources = (page?.resources ?? []).filter(
    resource =>
      typeof resource?.title === "string" &&
      resource.title.trim().length > 0 &&
      typeof resource?.document === "string" &&
      resource.document.trim().length > 0
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="flex-grow">
        <div className="container mx-auto px-4 pt-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f] transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All Events
          </Link>
        </div>

        <section className="container mx-auto px-4 pb-14 pt-6 md:pb-20">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#19332e] text-white shadow-2xl shadow-[#19332e]/15">
            <div className="absolute -right-20 -top-24 -z-10 size-80 rounded-full border border-[#d6b66f]/15 md:size-[30rem]" />
            <div className="absolute -right-8 -top-12 -z-10 size-56 rounded-full border border-[#d6b66f]/15 md:right-8 md:top-8 md:size-96" />
            <div className="grid min-h-[420px] lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col justify-center px-7 py-12 md:px-12 md:py-16 lg:px-16">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e2c77f]">
                  {page?.eyebrow || "Sacramental Life"}
                </p>
                <h1 className="mt-4 max-w-2xl font-serif text-5xl font-bold leading-[1.05] md:text-7xl">
                  {page?.title || "The Holy Mass"}
                </h1>
                <div className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
                  <CmsMarkdown>
                    {page?.introduction ||
                      "At every Mass, we gather as a parish family to worship God and receive Jesus Christ in the Eucharist. Whether you are a longtime parishioner or visiting for the first time, you are welcome."}
                  </CmsMarkdown>
                </div>
                <Link
                  href="/events"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#e2c77f] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#19332e] transition-colors hover:bg-white"
                >
                  Find a Mass{" "}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="relative min-h-64 overflow-hidden bg-gradient-to-br from-[#314e46] via-[#18312c] to-[#12231f] lg:min-h-full">
                {page?.heroImage ? (
                  <>
                    <img
                      src={page.heroImage}
                      alt="The Mystical Lamb"
                      className="absolute inset-0 size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12231f]/45 via-transparent to-[#12231f]/10 lg:bg-gradient-to-r lg:from-[#19332e]/35 lg:to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-64 items-center justify-center rounded-full border border-[#e2c77f]/25 bg-[#e2c77f]/5 md:size-80">
                      <div className="flex size-48 items-center justify-center rounded-full border border-[#e2c77f]/30 bg-[#e2c77f]/5 md:size-60">
                        <Cross
                          className="size-20 text-[#e2c77f]/80 md:size-24"
                          strokeWidth={1}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto grid gap-8 px-4 pb-16 md:grid-cols-[1fr_0.8fr] md:items-center md:pb-24">
          <div className="max-w-2xl">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#efe6cf] text-[#9b762f]">
              <BookOpen className="size-5" aria-hidden="true" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">
              {page?.aboutTitle || "A sacred encounter"}
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
              <CmsMarkdown>
                {page?.about ||
                  "The Mass is the source and summit of Christian life. In the Liturgy of the Word, we listen to Scripture and pray together. In the Liturgy of the Eucharist, we give thanks and receive Christ in Holy Communion."}
              </CmsMarkdown>
            </div>
          </div>

          {event ? (
            <Card className="rounded-3xl border border-primary/10 bg-white p-7 shadow-lg shadow-primary/5 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b762f]">
                Join us
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-primary">
                {event.title}
              </h2>
              <dl className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    className="mt-0.5 size-5 shrink-0 text-[#9b762f]"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Date
                    </dt>
                    <dd className="mt-1 font-semibold text-primary">
                      {event.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-0.5 size-5 shrink-0 text-[#9b762f]"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Time
                    </dt>
                    <dd className="mt-1 font-semibold text-primary">
                      {event.time}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-[#9b762f]"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Location
                    </dt>
                    <dd className="mt-1 font-semibold text-primary">
                      {event.location}
                    </dd>
                  </div>
                </div>
              </dl>
            </Card>
          ) : (
            <Card className="rounded-3xl border border-primary/10 bg-white p-7 shadow-lg shadow-primary/5 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b762f]">
                Celebrate with us
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-primary">
                All are welcome
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Find upcoming daily and Sunday Masses on the parish calendar.
              </p>
              <Link href="/events">
                <Button className="mt-6 w-full bg-primary font-bold uppercase tracking-widest text-white hover:bg-primary/90">
                  View Mass Times{" "}
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Button>
              </Link>
            </Card>
          )}
        </section>

        {event && (
          <section className="container mx-auto px-4 pb-16">
            <EventMedia event={event} includeCarouselPhotosInGallery />
          </section>
        )}

        {resources.length > 0 && (
          <section className="border-y border-primary/10 bg-[#f3efe5] py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                  Pray and learn
                </p>
                <h2 className="mt-3 font-serif text-3xl font-bold text-primary md:text-4xl">
                  {page?.resourcesTitle || "Explore the Mass"}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Download these guides and prayers to prepare for Mass and grow
                  in appreciation of the Eucharist.
                </p>
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
