// Sacred Minimalism: welcoming parish imagery, dignified typography, warm space, and practical pathways to worship.
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventsCarousel from '@/components/EventsCarousel';
import ChurchMap from '@/components/ChurchMap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Clock, Flower2, Heart, Mail, MapPin, Phone, Users } from 'lucide-react';

/**
 * Home Page - Sacred Minimalism Design
 * Features: Hero video background, mass schedule, sacraments info, community sections
 * Color Scheme: Deep Stone Blue primary, Warm Cream secondary, Gold accents
 * Typography: Playfair Display for headings, Inter for body
 */

export default function Home() {
  const massSchedule = [
    { day: 'Monday - Friday', time: '7:30 AM', label: 'Daily Mass' },
    { day: 'Saturday', time: '4:30 PM', label: 'Vigil Mass' },
    { day: 'Sunday', times: ['9:00 AM', '5:30 PM'], label: 'Sunday Mass' },
  ];

  const sacraments = [
    {
      icon: Heart,
      title: 'Reconciliation',
      description: 'Saturday 3-4 PM, Sunday 8 AM & 4:30 PM',
    },
    {
      icon: BookOpen,
      title: 'Eucharistic Adoration',
      description: 'Friday 8-9 AM, followed by Benediction',
    },
    {
      icon: Users,
      title: 'Sacrament Preparation',
      description: 'Baptism, First Eucharist, Confirmation, Marriage',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative min-h-[760px] w-full overflow-hidden pt-[69px] text-white lg:h-[94vh]">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/ChurchwithPeopleoutside_V2_5702e1f6.png"
            alt="Parishioners gathered outside Saint Therese Church in Rapid City"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102a45]/92 via-[#102a45]/58 to-[#102a45]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102a45]/65 via-transparent to-[#102a45]/20" />
        </div>

        <div className="container relative z-10 grid min-h-[690px] items-end gap-10 pb-36 pt-24 lg:grid-cols-[1.12fr_0.58fr] lg:pb-40">
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
              <a href="#mass-schedule" className="inline-flex">
                <Button size="lg" className="w-full bg-white text-primary shadow-lg hover:bg-[#f4ead5] sm:w-auto">View Mass Times</Button>
              </a>
              <Link href="/about" className="inline-flex">
                <Button size="lg" variant="outline" className="w-full border-white/65 bg-[#102a45]/15 text-white backdrop-blur-sm hover:bg-white/12 sm:w-auto">Meet Our Parish Team</Button>
              </Link>
            </div>
          </div>

          <aside className="hidden self-end border-t border-white/30 pt-5 lg:block">
            <p className="font-serif text-2xl italic leading-snug text-white/95">“My vocation, at last I have found it; my vocation is love.”</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#f1d99d]">Saint Thérèse of Lisieux</p>
          </aside>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/20 bg-[#fbfaf6]/96 text-primary backdrop-blur-md">
          <div className="container grid divide-y divide-primary/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="py-4 sm:pr-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b762f]">Sunday Mass</p><p className="mt-1 font-serif text-lg font-bold">9:00 AM · 5:30 PM</p></div>
            <div className="py-4 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b762f]">Saturday Vigil</p><p className="mt-1 font-serif text-lg font-bold">4:30 PM</p></div>
            <div className="py-4 sm:pl-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b762f]">Find Your Place</p><p className="mt-1 font-serif text-lg font-bold">532 Adams Street</p></div>
          </div>
        </div>
      </section>

      {/* Events Carousel Section */}
      <div id="upcoming-events" className="scroll-mt-24">
        <EventsCarousel />
      </div>

      {/* Mass Schedule Section */}
      <section id="mass-schedule" className="scroll-mt-20 bg-white py-20 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9b762f]"><Flower2 className="size-4" aria-hidden="true" /> Gather at the altar</p>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-primary md:text-5xl">Mass at Saint Therese</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">The Eucharist is the heart of our parish week. Come as you are and worship with our Rapid City parish family.</p>
          </div>

          <div className="border-t-2 border-primary">
            {massSchedule.map((schedule, idx) => (
              <div key={idx} className="grid gap-3 border-b border-primary/12 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary"><Clock className="size-4" aria-hidden="true" /></span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-primary">{schedule.label}</h3>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">{schedule.day}</p>
                  </div>
                </div>
                <div className="pl-13 text-left font-serif text-2xl font-bold text-primary sm:pl-0 sm:text-right">
                  {schedule.times ? schedule.times.join(' · ') : schedule.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacraments Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 text-center">
              Sacraments & Services
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Experience the grace of the sacraments with our parish community
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sacraments.map((sacrament, idx) => {
                const Icon = sacrament.icon;
                return (
                  <div key={idx} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Icon className="text-primary" size={32} />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-primary mb-2">
                      {sacrament.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {sacrament.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 text-center">
              Join Our Community
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Whether you're new to our parish or a longtime member, we welcome you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 border-2 border-border hover:shadow-lg transition-shadow">
                <h3 className="font-serif font-bold text-2xl text-primary mb-4">
                  New to Our Parish?
                </h3>
                <p className="text-muted-foreground mb-6">
                  We'd love to meet you! Stop by the office to pick up a new member form or download it below.
                </p>
                <a href="https://www.sainttheresechurch.org/s/registration.pdf" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary/90">
                    Download Registration Form
                  </Button>
                </a>
              </Card>

              <Card className="p-8 border-2 border-border hover:shadow-lg transition-shadow">
                <h3 className="font-serif font-bold text-2xl text-primary mb-4">
                  Serve the Parish
                </h3>
                <p className="text-muted-foreground mb-6">
                  Consider sharing your gifts of time, talent, and treasure with our community.
                </p>
                <a href="https://www.sainttheresechurch.org/s/ministry_interest_form.pdf" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary/90">
                    Ministry Interest Form
                  </Button>
                </a>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20 bg-secondary/30 py-20">
        <div className="container">
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
