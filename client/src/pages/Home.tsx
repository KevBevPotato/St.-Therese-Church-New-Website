// Sacred Minimalism: welcoming parish imagery, dignified typography, warm space, and practical pathways to worship.
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChurchMap from '@/components/ChurchMap';
import { Button } from '@/components/ui/button';
import { Clock, Flower2, Mail, MapPin, Phone } from 'lucide-react';
import UpcomingEventsCalendar from "@/components/UpcomingEventsCalendar";

/**
 * Home Page - Sacred Minimalism Design
 * Features: Hero section with Video Background, Mass & Confession times, Integrated Calendar, and Contact info.
 */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section with Video Background */}
      {/* 
          MODIFICATION: 
          - Changed to 'flex flex-col' and 'min-h-screen' to extend all the way.
          - The Mass bar is now a relative child at the bottom, so it never overlaps content.
      */}
      <section className="relative min-h-screen w-full overflow-hidden pt-[69px] text-white flex flex-col">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover object-center"
          >
            <source src="/StThereseHeroMovie.mp4" type="video/mp4" />
            <img
              src="/manus-storage/ChurchwithPeopleoutside_V2_5702e1f6.png"
              alt="Saint Therese Church"
              className="h-full w-full object-cover"
            />
          </video>

          <div className="absolute inset-0 bg-gradient-to-r from-[#102a45]/92 via-[#102a45]/58 to-[#102a45]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102a45]/65 via-transparent to-[#102a45]/20" />
        </div>

        {/* Hero Content - flex-grow pushes the bar to the bottom */}
        <div className="container relative z-10 flex-grow grid items-center gap-10 pb-20 pt-24 lg:grid-cols-[1.12fr_0.58fr]">
          <div className="max-w-3xl border-l-2 border-[#d4b36a] pl-6 md:pl-9">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f1d99d]">
              <Flower2 className="size-4" aria-hidden="true" />
              Saint Therese · The Little Flower
            </p>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.96] text-white sm:text-6xl md:text-7xl lg:text-[5.4rem]">
              A parish family formed by prayer and little ways of love.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/86 md:text-xl">
              Rooted in the Eucharist and serving Rapid City with the joyful, faithful spirit of Saint Thérèse of Lisieux.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('contact');

                  if (target) {
                    // 1. Get the element's exact distance from the top of the document
                    const elementPosition = target.getBoundingClientRect().top + window.scrollY;

                    // 2. Set your custom offset (in pixels). 
                    // Tweak this number until it stops exactly where you want it.
                    // Your header is 69px, so starting with 100px is a safe bet to give it breathing room.
                    const offset = 1600;
                    const offsetPosition = elementPosition - offset;

                    // 3. Scroll to that exact calculated pixel
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                    });
                  }
                }}
              >
                <Button size="lg" className="w-full bg-white text-primary shadow-lg hover:bg-[#f4ead5] sm:w-auto">
                  View Mass Times
                </Button>
              </a>
              <Link href="/about" className="inline-flex">
                <Button size="lg" variant="outline" className="w-full border-white/65 bg-[#102a45]/15 text-white backdrop-blur-sm hover:bg-white/12 sm:w-auto">Meet Our Parish Team</Button>
              </Link>
            </div>
          </div>

          <aside className="hidden self-center border-t border-white/30 pt-5 lg:block">
            <p className="font-serif text-2xl italic leading-snug text-white/95">“My vocation, at last I have found it; my vocation is love.”</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#f1d99d]">Saint Thérèse of Lisieux</p>
          </aside>
        </div>

        {/* Hero Bottom Bar - Now Relative and positioned at the bottom of the flex flow */}
        <div className="relative z-20 border-t border-white/20 bg-[#fbfaf6]/96 text-primary backdrop-blur-md w-full">
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
        </div>
      </section>

      {/* Upcoming Events Calendar Section */}
      <UpcomingEventsCalendar />

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20 bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b762f]">Visit Saint Therese</p>
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
                    <a href="mailto:sttherese@diorc.org" className="mt-1 block font-semibold text-primary transition-colors hover:text-primary/75">sttherese@diorc.org</a>
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
