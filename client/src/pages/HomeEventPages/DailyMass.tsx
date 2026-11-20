import { Link } from "wouter";
import { ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { EventLandingPageProps } from "@/components/eventfolders/types";

export default function DailyMass({ event }: EventLandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="container mx-auto flex-grow px-4 py-12">
        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f] transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All Events
        </Link>

        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
              Sacramental Life
            </p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-primary md:text-7xl">
              {event.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {event.description ||
                "Join our parish community in celebrating the Eucharist. All are welcome."}
            </p>
          </section>

          <Card className="rounded-3xl border border-primary/10 bg-white p-8 shadow-xl">
            <h2 className="mb-6 font-serif text-2xl font-bold text-primary">
              Mass Details
            </h2>
            <dl className="space-y-6">
              <div className="flex items-start gap-4">
                <CalendarDays
                  className="size-5 shrink-0 text-accent"
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
              <div className="flex items-start gap-4">
                <Clock
                  className="size-5 shrink-0 text-accent"
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
              <div className="flex items-start gap-4">
                <MapPin
                  className="size-5 shrink-0 text-accent"
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
