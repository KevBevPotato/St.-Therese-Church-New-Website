// Home.tsx
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChurchMap from "@/components/ChurchMap";
import MembershipRegistrationModal from "@/components/MembershipRegistrationModal";
import { Button } from "@/components/ui/button";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import UpcomingEventsCalendar from "@/components/UpcomingEventsCalendar";
import CmsMarkdown from "@/components/CmsMarkdown";
import heroData from "@/data/hero_data.json";
import homeContactData from "@/data/home_contact_data.json";
import { announcementSettings, getActiveAnnouncements } from "@/data/announcements";

function getMediaFit(value: string): "cover" | "contain" {
  return value === "contain" ? "contain" : "cover";
}

function colorWithOpacity(color: string, opacity: number): string {
  const match = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(color);
  if (!match) return `rgba(16, 42, 69, ${opacity})`;

  const [, red, green, blue] = match;
  return `rgba(${parseInt(red, 16)}, ${parseInt(green, 16)}, ${parseInt(blue, 16)}, ${opacity})`;
}

/**
 * Home Page
 *
 * The header is 113px tall. The hero video is contained in an aspect-ratio box
 * (16:9) with a max height of 85vh so the Mass Times bar is always visible.
 * Hero text uses clamp() to scale fluidly with viewport size.
 */

export default function Home() {
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const mediaFit = getMediaFit(heroData.mediaFit);
  const featuredAnnouncement = getActiveAnnouncements()[0];
  const overlayStrength = Math.max(0, Math.min(1, heroData.overlayStrength));
  const overlayStyle = {
    background: `linear-gradient(90deg, ${colorWithOpacity(heroData.overlayColor, overlayStrength)} 0%, ${colorWithOpacity(heroData.overlayColor, overlayStrength * 0.64)} 58%, ${colorWithOpacity(heroData.overlayColor, overlayStrength * 0.1)} 100%), linear-gradient(0deg, ${colorWithOpacity(heroData.overlayColor, overlayStrength * 0.7)} 0%, transparent 65%, ${colorWithOpacity(heroData.overlayColor, overlayStrength * 0.2)} 100%)`,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showMassTimes />

      {/* Hero Section */}
      <section
        className="relative w-full overflow-hidden pt-[var(--header-height)]"
        style={{ color: heroData.textColor }}
      >
        {/* 
            CONTAINER CHANGE: 
            1. Removed 'aspectRatio' and 'maxHeight'.
            2. Added 'min-h-[600px]' (or whatever minimum height you like).
            3. This container now grows automatically if the text wraps!
        */}
        <div
          className="relative flex min-h-[600px] w-full items-center py-20"
          style={{ backgroundColor: heroData.backgroundColor }}
        >
          {featuredAnnouncement && (
            <Link
              href="/announcements"
              className={`absolute z-20 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-md transition-opacity hover:opacity-100 ${
                announcementSettings.heroLinkPosition === 'top-left'
                  ? 'left-4 top-4 sm:left-8 sm:top-8'
                  : announcementSettings.heroLinkPosition === 'bottom-right'
                    ? 'bottom-4 right-4 sm:bottom-8 sm:right-8'
                    : announcementSettings.heroLinkPosition === 'bottom-left'
                      ? 'bottom-4 left-4 sm:bottom-8 sm:left-8'
                      : 'right-4 top-4 sm:right-8 sm:top-8'
              }`}
              style={{
                backgroundColor: colorWithOpacity(
                  announcementSettings.heroLinkBackgroundColor,
                  Math.max(0, Math.min(1, announcementSettings.heroLinkOpacity)),
                ),
                color: announcementSettings.heroLinkTextColor,
                maxWidth: 'calc(100% - 2rem)',
              }}
            >
              <span className="block text-[9px] font-bold uppercase tracking-[0.16em] opacity-75">
                Parish announcement
              </span>
              <span className="block truncate">{featuredAnnouncement.title}</span>
            </Link>
          )}
          {/* Video background - Now purely a background layer */}
          <div className="absolute inset-0 z-0">
            {heroData.videoUrl ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={heroData.poster}
                className="absolute inset-0 h-full w-full"
                style={{
                  objectFit: mediaFit,
                  objectPosition: heroData.mediaPosition,
                }}
              >
                <source src={heroData.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={heroData.poster}
                alt="Saint Thérèse Church"
                className="h-full w-full"
                style={{
                  objectFit: mediaFit,
                  objectPosition: heroData.mediaPosition,
                }}
              />
            )}

            <div className="absolute inset-0" style={overlayStyle} />
          </div>

          {/* Hero Content - Now 'relative' so it pushes the height of the parent */}
          <div className="container relative z-10 px-6 mx-auto">
            <div className="max-w-3xl py-12 pr-10">
              <div
                className="border-l-2 pl-4 md:pl-6 lg:pl-9"
                style={{ borderColor: heroData.accentBorderColor }}
              >
                <p
                  className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em]"
                  style={{ color: heroData.accentColor }}
                >
                  {heroData.eyebrow}
                </p>

                <h1
                  className="mt-6 sm:mt-8 lg:mt-10 font-serif font-bold leading-tight"
                  style={{ fontSize: "clamp(1.75rem, 4.5vw, 5.4rem)" }}
                >
                  {heroData.title}
                </h1>

                <CmsMarkdown className="mt-6 max-w-2xl text-white sm:mt-8 lg:mt-10">
                  {heroData.description}
                </CmsMarkdown>

                <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    onClick={() => setIsMembershipModalOpen(true)}
                    aria-haspopup="dialog"
                    size="lg"
                    className="w-full shadow-lg sm:w-auto"
                    style={{
                      backgroundColor: heroData.textColor,
                      color: heroData.backgroundColor,
                      fontSize: "clamp(0.75rem, 1.2vw, 1rem)",
                    }}
                  >
                    {heroData.primaryButtonLabel}
                  </Button>
                  <a href={heroData.secondaryButtonUrl} className="inline-flex">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full backdrop-blur-sm sm:w-auto"
                      style={{
                        borderColor: colorWithOpacity(heroData.textColor, 0.65),
                        backgroundColor: colorWithOpacity(
                          heroData.backgroundColor,
                          0.15
                        ),
                        color: heroData.textColor,
                        fontSize: "clamp(0.75rem, 1.2vw, 1rem)",
                      }}
                    >
                      {heroData.secondaryButtonLabel}
                    </Button>
                  </a>
                </div>

                <div className="mt-12 sm:mt-16 lg:mt-20 border-t border-white/30 pt-4 lg:pt-5 max-w-xl">
                  <CmsMarkdown className="font-serif text-white italic">
                    {heroData.quote}
                  </CmsMarkdown>
                  <p
                    className="mt-2 font-bold uppercase tracking-[0.18em]"
                    style={{
                      fontSize: "clamp(0.65rem, 1vw, 0.75rem)",
                      color: heroData.accentColor,
                    }}
                  >
                    {heroData.quoteAttribution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Upcoming Events Calendar Section */}
      <UpcomingEventsCalendar homeView />

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20 bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b762f]">
                {homeContactData.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-primary md:text-5xl">
                {homeContactData.title}
              </h2>
              <CmsMarkdown className="mt-5 max-w-lg text-lg text-muted-foreground">
                {homeContactData.description}
              </CmsMarkdown>

              <div className="mt-8 space-y-3">
                <div className="flex gap-3 border-b border-primary/10 pb-4">
                  <Clock
                    className="mt-0.5 size-5 shrink-0 text-[#9b762f]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Office Hours
                    </p>
                    <p className="mt-1 font-medium text-foreground">
                      {homeContactData.officeHours}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 border-b border-primary/10 py-4">
                  <Phone
                    className="mt-0.5 size-5 shrink-0 text-[#9b762f]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Phone
                    </p>
                    <a
                      href={`tel:${homeContactData.phoneLink}`}
                      className="mt-1 block font-semibold text-primary transition-colors hover:text-primary/75"
                    >
                      {homeContactData.phone}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3 border-b border-primary/10 py-4">
                  <Mail
                    className="mt-0.5 size-5 shrink-0 text-[#9b762f]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Email
                    </p>
                    <a
                      href={`mailto:${homeContactData.email}`}
                      className="mt-1 block font-semibold text-primary transition-colors hover:text-primary/75"
                    >
                      {homeContactData.email}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-[#9b762f]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Address
                    </p>
                    <p className="mt-1 font-semibold text-primary">
                      {homeContactData.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <ChurchMap />
          </div>
        </div>
      </section>
      <MembershipRegistrationModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
      />
      <Footer />
    </div>
  );
}
