// KnightsOfColumbus.tsx
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Phone,
    Mail,
    Shield,
    Users,
    Calendar,
    Heart,
    Cross,
} from 'lucide-react';
import { getOrganizationById } from '@/data/organizations';
import { staticEvents, generateRecurringEventsForMonth, type CalendarEvent } from '@/components/eventfolders/events';
import UpcomingOrgEvents from './UpcomingOrgEvents';

const FORM_URLS = {
    referral: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UNFFTRkFRVkNXWU1VMkc4S1JXVU0yUFFRQy4u',
};

const KOC_SIGNUP_URL = 'https://www.kofc.org/get-involved/join-kofc/';

/**
 * Pulls only events tagged with the 'knights-of-columbus' invisible org tag
 * (see /components/events.ts → organizationTags). Falls back to no events
 * if the tag is missing on a given entry.
 */
function getKoCRelevantEvents(): CalendarEvent[] {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 90);

    const allEvents: CalendarEvent[] = [...staticEvents];

    for (let i = 0; i < 3; i++) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
        allEvents.push(...generateRecurringEventsForMonth(targetDate.getMonth(), targetDate.getFullYear()));
    }

    return allEvents
        .filter(event => {
            const tagged = event.organizationTags?.includes('knights-of-columbus') ?? false;
            return tagged && event.date >= now && event.date <= cutoff;
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 6);
}

export default function KnightsOfColumbus() {
    const org = getOrganizationById('knights-of-columbus');
    const upcomingEvents = getKoCRelevantEvents();

    if (!org) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="pt-[var(--header-height)]" />
                <main className="flex-grow py-20 text-center">
                    <p className="text-muted-foreground">Organization not found.</p>
                </main>
                <Footer />
            </div>
        );
    }

    const scrollToUpcomingEvents = () => {
        const target = document.getElementById('upcoming-events');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="pt-[var(--header-height)]" />

            {/* ✅ NEW HERO: photo background + logo + calendar button */}
            <section
                className="relative py-20 md:py-24 border-b border-primary/10 overflow-hidden min-h-[520px] flex items-center"
                style={{
                    // 👇 Replace /koc-hero.jpg with your actual Knights photo.
                    backgroundImage: 'url("/koc-hero.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#102a45]/95 via-[#102a45]/70 to-[#102a45]/30" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Back button row */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
                            aria-label="Go back to previous page"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>

                        <span className="text-white/30">|</span>

                        <Link href="/get-involved">
                            <a className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
                                All Opportunities
                            </a>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                        {/* ✅ Logo */}
                        <div className="shrink-0">
                            <div className="size-50 md:size-80">
                                <img
                                    // 👇 Replace /koc-logo.png with your actual Knights logo.
                                    src="/KoC.png"
                                    alt="Knights of Columbus logo"
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        // Graceful fallback if the logo file isn't uploaded yet
                                        const target = e.currentTarget;
                                        target.style.display = 'none';
                                        target.parentElement!.innerHTML = '<div class="text-white text-center"><svg class="size-16 mx-auto mb-2 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"/></svg><p class="text-[10px] font-bold uppercase tracking-widest text-white/60">K of C</p></div>';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f1d99d] mb-3 flex items-center gap-2">
                                <Shield size={14} /> {org.audience}
                            </p>
                            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                                {org.name}
                            </h1>
                            <p className="font-serif text-2xl italic text-[#f1d99d] mb-6">
                                {org.tagline}
                            </p>
                            <p className="text-lg text-white/85 leading-relaxed">
                                {org.description}
                            </p>
                        </div>

                        <div className="w-full max-w-[260px] shrink-0">
                            <img
                                src="/KnightsofColumbus/Knights%20of%20Columbus%20Flyer%20(1024%20x%201536%20px)_Compressed.png"
                                alt="Knights of Columbus flyer"
                                className="w-full rounded-2xl border border-white/20 shadow-xl object-cover"
                            />
                        </div>
                    </div>

                    {/* ✅ Calendar button at the bottom of the hero */}
                    <div className="flex justify-center md:justify-start">
                        <button
                            onClick={scrollToUpcomingEvents}
                            className="inline-flex items-center gap-2 bg-white hover:bg-[#f4ead5] text-primary px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <Calendar size={16} /> View Upcoming Calendar
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Bar - Temporarily hidden; keep for future updates.
            <section className="bg-primary text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        {org.stats.map((stat, idx) => (
                            <div key={idx}>
                                <p className="text-4xl font-serif font-bold text-accent">{stat.value}</p>
                                <p className="text-xs uppercase tracking-widest text-white/60 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            */}

            {/* Meeting Info & CTAs */}
            <section className="py-12 bg-secondary/20 border-b border-primary/10">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-8 border-2 border-primary/10 bg-white">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Meetings</p>
                                    <p className="text-lg font-serif font-bold text-primary">{org.meetingSchedule}</p>
                                    {org.room && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Location: <span className="font-semibold text-primary">{org.room}</span>
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground mt-1">All Catholic men are welcome to attend.</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 border-2 border-primary/10 bg-white">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Contact</p>
                                    <p className="text-lg font-serif font-bold text-primary">{org.contactName}</p>
                                    <a href={`tel:${org.contactPhone.replace(/\D/g, '')}`} className="text-sm text-accent hover:underline inline-flex items-center gap-1 mt-1">
                                        <Phone size={12} /> {org.contactPhone}
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8 justify-center">
                        <a
                            href={KOC_SIGNUP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg rounded-md transition-colors"
                        >
                            <Users size={16} /> Join the Knights
                        </a>
                        <Button
                            onClick={() => window.open(FORM_URLS.referral, '_blank', 'noopener,noreferrer')}
                            variant="outline"
                            className="px-8 py-6 font-bold uppercase tracking-widest border-2"
                        >
                            <Heart size={16} className="mr-2" /> Refer a Knight
                        </Button>
                    </div>
                </div>
            </section>

            {/* Officers Section - Temporarily hidden until positions/photos are ready.
            <section className="py-16 md:py-20 bg-background">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3 flex items-center justify-center gap-2">
                            <Cross size={14} /> Leadership
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                            Council Officers
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Meet the men who lead our council this fraternal year.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {org.officers.map(officer => (
                            <Card
                                key={officer.id}
                                className="group overflow-hidden border-2 border-primary/12 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30"
                            >
                                <div className="relative aspect-[3/4] w-full overflow-hidden bg-primary/5 flex items-center justify-center">
                                    {officer.photo ? (
                                        <img
                                            src={officer.photo}
                                            alt={`${officer.name} portrait`}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            style={{ objectPosition: officer.photoPosition ?? 'center 25%' }}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-primary p-4 text-center">
                                            <Shield className="size-10 text-primary/10 mb-3" />
                                            <p className="font-serif text-sm font-bold leading-tight">{officer.name}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">
                                        {officer.title}
                                    </p>
                                    <h3 className="text-base font-serif font-bold text-primary leading-tight">
                                        {officer.name}
                                    </h3>
                                    {officer.email && (
                                        <a
                                            href={`mailto:${officer.email}`}
                                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-3"
                                        >
                                            <Mail size={11} /> <span className="truncate">{officer.email}</span>
                                        </a>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            */}

            {/* Members Gallery - Temporarily hidden until member photos are ready.
            <section className="py-16 md:py-20 bg-secondary/20 border-t border-primary/10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3 flex items-center justify-center gap-2">
                            <Users size={14} /> Our Brotherhood
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                            Members
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            The men who make our council strong through their service and fellowship.
                        </p>
                    </div>

                    {org.members.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-primary/15">
                            <p className="text-muted-foreground font-bold">Member gallery coming soon.</p>
                            <p className="text-sm text-muted-foreground mt-2">Photos will be added as they become available.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {org.members.map(member => (
                                <div key={member.id} className="group">
                                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-primary/5 mb-3 flex items-center justify-center shadow-sm border border-primary/10 group-hover:shadow-md transition-all">
                                        {member.photo ? (
                                            <img
                                                src={member.photo}
                                                alt={`${member.name} portrait`}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                style={{ objectPosition: member.photoPosition ?? 'center 25%' }}
                                            />
                                        ) : (
                                            <Shield className="size-10 text-primary/15" />
                                        )}
                                    </div>
                                    <p className="text-sm font-serif font-bold text-primary text-center leading-tight">
                                        {member.name}
                                    </p>
                                    {member.yearsAsMember && (
                                        <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold mt-1">
                                            {member.yearsAsMember} years
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            */}

            {/* ✅ Upcoming Events — id="upcoming-events" is the scroll target for the hero button */}
            <section id="upcoming-events" className="py-16 md:py-20 bg-background border-t border-primary/10 scroll-mt-[100px]">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3 flex items-center justify-center gap-2">
                            <Calendar size={14} /> On the Calendar
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                            Upcoming Events
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Council meetings, parish gatherings, and Knights-sponsored events for the next 90 days.
                        </p>
                    </div>

                    <UpcomingOrgEvents
                        events={upcomingEvents}
                        orgName="Knights of Columbus"
                        emptyMessage="No upcoming Knights events in the next 90 days."
                    />

                    <div className="mt-8 text-center">
                        <Link href="/events">
                            <a className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-bold uppercase tracking-widest text-xs">
                                View Full Parish Calendar <ArrowLeft size={14} className="rotate-180" />
                            </a>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
