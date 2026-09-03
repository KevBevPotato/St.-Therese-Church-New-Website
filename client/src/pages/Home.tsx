// Home.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChurchMap from '@/components/ChurchMap';
import { Button } from '@/components/ui/button';
import { Clock, Flower2, Mail, MapPin, Phone } from 'lucide-react';
import UpcomingEventsCalendar from "@/components/UpcomingEventsCalendar";

/**
 * Home Page
 *
 * The header is 113px tall. The hero video is contained in an aspect-ratio box
 * (16:9) with a max height of 85vh so the Mass Times bar is always visible.
 * Hero text uses clamp() to scale fluidly with viewport size.
 */

const HEADER_HEIGHT = 113; // measured height of the fixed header

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const massTimesRef = useRef<HTMLDivElement>(null);

  // The mass-times content as a single block so we can render it in two places
  // (bottom of hero + sticky on scroll) without duplicating JSX.
  const massTimesContent = (
    <div className="container grid divide-y divide-primary/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="py-4 sm:pr-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b762f]">Sunday Mass</p>
        <p className="mt-1 font-serif text-base lg:text-lg font-bold">
          9:00 AM · 5:30 PM <span className="block text-[10px] lg:inline lg:text-xs font-sans font-medium opacity-80 lg:ml-2">| Confession starts 8 AM, 4:30 PM</span>
        </p>
      </div>
      <div className="py-4 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b762f]">Saturday Vigil</p>
        <p className="mt-1 font-serif text-base lg:text-lg font-bold">
          4:30 PM <span className="block text-[10px] lg:inline lg:text-xs font-sans font-medium opacity-80 lg:ml-2">| Confession starts 3 PM</span>
        </p>
      </div>
      <div className="py-4 sm:pl-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b762f]">Daily Mass</p>
        <p className="mt-1 font-serif text-base lg:text-lg font-bold">7:30 AM (Mon - Fri)</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden pt-[113px] text-white"
      >
        {/* 
            CONTAINER CHANGE: 
            1. Removed 'aspectRatio' and 'maxHeight'.
            2. Added 'min-h-[600px]' (or whatever minimum height you like).
            3. This container now grows automatically if the text wraps!
        */}
        <div className="relative w-full bg-[#102a45] min-h-[600px] flex items-center py-20">

          {/* Video background - Now purely a background layer */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/StThereseHeroMovie.mp4" type="video/mp4" />
              <img
                src="/manus-storage/ChurchwithPeopleoutside_V2_5702e1f6.png"
                alt="Saint Thérèse Church"
                className="h-full w-full object-cover"
              />
            </video>

            <div className="absolute inset-0 bg-gradient-to-r from-[#102a45]/92 via-[#102a45]/58 to-[#102a45]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102a45]/65 via-transparent to-[#102a45]/20" />
          </div>

          {/* Hero Content - Now 'relative' so it pushes the height of the parent */}
          <div className="container relative z-10 px-6 mx-auto">
            <div className="max-w-3xl py-12 pr-10">

              <div className="border-l-2 border-[#d4b36a] pl-4 md:pl-6 lg:pl-9">

                <p className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#f1d99d]">
                  <Flower2 className="size-4" aria-hidden="true" />
                  Saint Thérèse · The Little Flower
                </p>

                <h1
                  className="mt-6 sm:mt-8 lg:mt-10 font-serif font-bold leading-tight text-white"
                  style={{ fontSize: 'clamp(1.75rem, 4.5vw, 5.4rem)' }}
                >
                  A parish family formed by prayer and little ways of love.
                </h1>

                <p
                  className="mt-6 sm:mt-8 lg:mt-10 max-w-2xl leading-relaxed text-white/86"
                  style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)' }}
                >
                  Rooted in the Eucharist and serving Rapid City with the joyful, faithful spirit of Saint Thérèse of Lisieux.
                </p>

                <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/OldSTCCWebsite/MemberRegistration.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                    aria-label="Become a Member — PDF opens in new tab"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-white text-primary shadow-lg hover:bg-[#f4ead5] sm:w-auto"
                      style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)' }}
                    >
                      Become a Member
                    </Button>
                  </a>
                  <Link href="/about" className="inline-flex">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-white/65 bg-[#102a45]/15 text-white backdrop-blur-sm hover:bg-white/12 sm:w-auto"
                      style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)' }}
                    >
                      Meet Our Parish Team
                    </Button>
                  </Link>
                </div>

                <div className="mt-12 sm:mt-16 lg:mt-20 border-t border-white/30 pt-4 lg:pt-5 max-w-xl">
                  <p
                    className="font-serif italic leading-snug text-white/95"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
                  >
                    "My vocation, at last I have found it; my vocation is love."
                  </p>
                  <p
                    className="mt-2 font-bold uppercase tracking-[0.18em] text-[#f1d99d]"
                    style={{ fontSize: 'clamp(0.65rem, 1vw, 0.75rem)' }}
                  >
                    Saint Thérèse of Lisieux
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mass Times bar at the bottom of the hero (ref'd for scroll target) */}
      </section>
      <div
        ref={massTimesRef}
        /* 
           Removed 'border-b' from here because we are using a physical div instead.
           Added 'pb-0' to ensure no extra space is pushing the line away.
        */
        className="relative z-30 border-t border-white/20 bg-[#fbfaf6]/96 text-primary backdrop-blur-md w-full pb-0"
      >
        {massTimesContent}

        {/* 
              THE PHYSICAL LINE:
              - h-px: Exactly 1 pixel tall
              - w-full: Spans the entire width
              - bg-primary/20: The color (adjust /20 to /30 if you want it slightly darker)
          */}
        <div className="h-px w-full bg-primary/10" />
      </div>

      {/* Upcoming Events Calendar Section */}
      <UpcomingEventsCalendar />

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20 bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b762f]">Visit Saint Thérèse</p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-primary md:text-5xl">Come pray with us.</h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Whether you are joining us for Mass, stopping by the parish office, or visiting for the first time, we look forward to welcoming you.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex gap-3 border-b border-primary/10 pb-4">
                  <Clock className="mt-0.5 size-5 shrink-0 text-[#9b762f]" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Office Hours</p>
                    <p className="mt-1 font-medium text-foreground">Monday–Friday · 8 AM–12 PM & 1–3 PM</p>
                  </div>
                </div>
                <div className="flex gap-3 border-b border-primary/10 py-4">
                  <Phone className="mt-0.5 size-5 shrink-0 text-[#9b762f]" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Phone</p>
                    <a href="tel:+16053421556" className="mt-1 block font-semibold text-primary transition-colors hover:text-primary/75">(605) 342-1556</a>
                  </div>
                </div>
                <div className="flex gap-3 border-b border-primary/10 py-4">
                  <Mail className="mt-0.5 size-5 shrink-0 text-[#9b762f]" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Email</p>
                    <a href="mailto:connie.heeren@strcstaff.org" className="mt-1 block font-semibold text-primary transition-colors hover:text-primary/75">connie.heeren@strcstaff.org</a>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-[#9b762f]" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Address</p>
                    <p className="mt-1 font-semibold text-primary">532 Adams St · Rapid City, SD 57701</p>
                  </div>
                </div>
              </div>
            </div>
            <ChurchMap />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
