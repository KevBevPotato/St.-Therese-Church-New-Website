import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Church, Clock, MapPin, Users } from "lucide-react";
import { Link } from "wouter";

export default function NewToStTherese() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="flex-grow">
        <section className="border-b border-primary/10 bg-white py-16 md:py-24">
          <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                Welcome to St. Thérèse
              </p>
              <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-tight text-primary md:text-7xl">
                New to St. Thérèse?
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                We are glad you are here. Whether you are visiting for the first
                time, returning to the Church, or looking for a parish home, you
                are welcome at St. Thérèse.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/events">
                  <Button className="bg-primary px-6 py-5 font-bold uppercase tracking-widest text-white hover:bg-primary/90">
                    See the parish calendar{" "}
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    className="px-6 py-5 font-bold uppercase tracking-widest"
                  >
                    Meet our parish team
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="border-2 border-primary/10 bg-[#fbfaf6] p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <Church className="size-6 text-accent" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-bold text-primary">
                  Your first visit
                </h2>
              </div>
              <div className="mt-6 space-y-5 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <p>
                    <strong className="text-primary">Mass times:</strong> Sunday
                    at 9:00 AM and 5:30 PM; Saturday Vigil at 4:30 PM.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <p>
                    <strong className="text-primary">Location:</strong> St.
                    Thérèse Parish in Rapid City.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Users
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <p>
                    Come as you are. Our parish family is happy to help you find
                    your way.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto grid gap-5 px-4 md:grid-cols-3">
            <Card className="border-2 border-primary/10 bg-white p-7">
              <h2 className="font-serif text-2xl font-bold text-primary">
                Find your place
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Explore parish life, faith formation, Connect Groups, and
                opportunities to serve.
              </p>
              <Link
                href="/contribute"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent"
              >
                Ways to contribute <ArrowRight className="size-4" />
              </Link>
            </Card>
            <Card className="border-2 border-primary/10 bg-white p-7">
              <h2 className="font-serif text-2xl font-bold text-primary">
                Learn about us
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Meet our parish staff and learn more about the ministries and
                sacraments we offer.
              </p>
              <Link
                href="/about"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent"
              >
                About the parish <ArrowRight className="size-4" />
              </Link>
            </Card>
            <Card className="border-2 border-primary/10 bg-white p-7">
              <h2 className="font-serif text-2xl font-bold text-primary">
                Have a question?
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Our parish team is here to help you take your next step.
              </p>
              <Link
                href="/about"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent"
              >
                Contact the parish <ArrowRight className="size-4" />
              </Link>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
