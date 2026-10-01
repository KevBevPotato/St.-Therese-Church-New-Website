// client/src/pages/EventDetail.tsx
import { Suspense, useState } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import {
  ChevronLeft, MapPin, Clock, Calendar as CalendarIcon,
  ExternalLink, User, Mail, Phone, Home, ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 1. IMPORT THE CAROUSEL HERE
import { EventCarousel } from '@/components/EventCarousel';

import { staticEvents, generateRecurringEventsForMonth, EVENT_COLORS } from '@/components/eventfolders/events';
import { getCustomLandingPage } from '@/data/eventLandingPages';

export default function EventDetail() {
  const [match, params] = useRoute('/events/:id');
  const [, navigate] = useLocation();

  if (!match || !params) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
        <Header />
        <div className="flex-grow flex items-center justify-center p-8 pt-[100px] text-center">
          <div>
            <p className="text-xl font-bold text-primary mb-4">Page not found.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" onClick={() => window.history.length > 1 ? window.history.back() : navigate('/')}>
                <ArrowLeft className="mr-2 size-4" /> Go Back
              </Button>
              <Link href="/">
                <Button variant="outline">
                  <Home className="mr-2 size-4" /> Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const eventId = params.id;
  const allEvents = [...staticEvents];
  const currentDate = new Date();
  const startMonth = currentDate.getMonth();
  const startYear = currentDate.getFullYear();

  for (let i = -1; i <= 12; i++) {
    const d = new Date(startYear, startMonth + i, 1);
    allEvents.push(...generateRecurringEventsForMonth(d.getMonth(), d.getFullYear()));
  }

  const event = allEvents.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
        <Header />
        <div className="flex-grow flex items-center justify-center p-8 pt-[100px] text-center">
          <div>
            <p className="text-xl font-bold text-primary mb-4">Event not found.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" onClick={() => window.history.length > 1 ? window.history.back() : navigate('/')}>
                <ArrowLeft className="mr-2 size-4" /> Go Back
              </Button>
              <Link href="/">
                <Button variant="outline">
                  <Home className="mr-2 size-4" /> Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBack = () => {
    if (window.history.length > 1) window.history.back();
    else navigate('/');
  };

  const CustomPage = getCustomLandingPage(event.id);
  if (CustomPage) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fbfaf6]">
          <div className="text-primary/40 text-sm font-bold uppercase tracking-widest">
            Loading…
          </div>
        </div>
      }>
        <CustomPage />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-primary hover:text-accent font-bold uppercase tracking-widest text-xs"
          >
            <ChevronLeft className="mr-2" /> Back
          </Button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-accent transition-colors flex items-center gap-1">
              <Home className="size-3.5" /> Home
            </Link>
            <span className="text-primary/30">/</span>
            <Link href="/events" className="hover:text-accent transition-colors">
              Events
            </Link>
            <span className="text-primary/30">/</span>
            <span className="text-primary truncate max-w-[200px]">{event.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {event.categories.map((cat) => {
                  const colors = EVENT_COLORS[cat] || EVENT_COLORS['parishEvents'];
                  return (
                    <span
                      key={cat}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${colors.bg} ${colors.labelColor} border border-black/5`}
                    >
                      {colors.label}
                    </span>
                  );
                })}
              </div>
              <h1 className="font-serif text-5xl font-bold text-primary leading-tight">{event.title}</h1>
            </div>

            {/* --- UPDATED HERO IMAGE / CAROUSEL SECTION --- */}
            <div className="w-full">
              {event.gallery && event.gallery.length > 0 ? (
                <EventCarousel gallery={event.gallery} eventTitle={event.title} />
              ) : event.image ? (
                  <div className="relative w-full overflow-hidden rounded-3xl shadow-xl bg-gray-100">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-auto max-h-[600px] object-contain mx-auto block"
                    />
                  </div>
              ) : null}
            </div>

            <Card className="p-8 border-none shadow-xl bg-white rounded-3xl">
              <h2 className="font-serif text-2xl font-bold text-primary mb-4">About this Event</h2>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                {event.description || event.about || 'No additional information available for this event.'}
              </p>

              {event.signupLink && (
                <Button className="mt-8 bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest w-full sm:w-auto" asChild>
                  <a href={event.signupLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 size-5" /> Register / More Info
                  </a>
                </Button>
              )}
            </Card>

            {/* --- UPDATED PHOTO GALLERY SECTION --- */}
            {event.gallery && event.gallery.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <ImageIcon className="text-primary size-5" />
                  <h3 className="font-serif text-3xl font-bold text-primary">Event Gallery</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.map((item: any, idx) => (
                    <div key={idx} className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:opacity-90 transition-opacity cursor-pointer">
                      <img src={item.photo} alt={`${event.title} gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      {item.caption && (
                        <div className="absolute inset-0 bg-black/60 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs italic">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.faqItems && event.faqItems.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-serif text-3xl font-bold text-primary">Frequently Asked Questions</h3>
                <div className="grid gap-4">
                  {event.faqItems.map((faq, i) => (
                    <Card key={i} className="p-6 border-2 border-primary/5 bg-white rounded-2xl">
                      <h4 className="font-bold text-primary mb-2">{faq.question}</h4>
                      <p className="text-muted-foreground text-sm">{faq.answer}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-8 border-none shadow-lg bg-primary text-white rounded-[2rem]">
              <h3 className="font-serif text-2xl font-bold mb-6">Event Details</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CalendarIcon className="size-6 text-accent shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Date</p>
                    <p className="font-bold">
                      {event.date.toLocaleDateString('default', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="size-6 text-accent shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Time</p>
                    <p className="font-bold">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="size-6 text-accent shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Location</p>
                    <p className="font-bold">{event.location}</p>
                  </div>
                </div>
              </div>
            </Card>

            {(event.contactPerson || event.contactEmail || event.contactPhone) && (
              <Card className="p-8 border-2 border-primary/10 bg-white rounded-[2rem]">
                <h3 className="font-serif text-xl font-bold text-primary mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {event.contactPerson && (
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-accent" />
                      <span className="text-sm font-bold text-primary">{event.contactPerson}</span>
                    </div>
                  )}
                  {event.contactEmail && (
                    <a href={`mailto:${event.contactEmail}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors">
                      <Mail size={18} /> {event.contactEmail}
                    </a>
                  )}
                  {event.contactPhone && (
                    <a href={`tel:${event.contactPhone.replace(/\D/g, '')}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors">
                      <Phone size={18} /> {event.contactPhone}
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
