// --- File: client/src/components/AltarSociety.tsx ---
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Phone,
    Mail,
    Flower,
    Users,
    Calendar,
    Heart,
    Cross,
    Flower2,
} from 'lucide-react';
import { getOrganizationById } from '@/data/organizations';
// ✅ Fixed: use relative path since events.ts is in the same directory
import { staticEvents, generateRecurringEventsForMonth, type CalendarEvent } from './events';
import UpcomingOrgEvents from './UpcomingOrgEvents';

const FORM_URLS = {
    signUpToHelp: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UQkFRRTFRUDIzWkcwT0JOODc2MzdaNlVERy4u',
    referral: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UNFFTRkFRVkNXWU1VMkc4S1JXVU0yUFFRQy4u',
};

function getAltarSocietyEvents(): CalendarEvent[] {
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
            // ✅ Pulls only events tagged with the 'altar-society' invisible org tag.
            const tagged = event.organizationTags?.includes('altar-society') ?? false;
            return tagged && event.date >= now && event.date <= cutoff;
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 6);
}

export default function AltarSociety() {
    const org = getOrganizationById('altar-society');
    const upcomingEvents = getAltarSocietyEvents();

    if (!org) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="pt-[69px]" />
                <main className="flex-grow py-20 text-center">
                    <p className="text-muted-foreground">Organization not found.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="pt-[69px]" />

            {/* Hero */}
            <section className="relative py-20 bg-[#fbfaf6] border-b border-primary/10 overflow-hidden">
                <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
                <div className="container mx-auto px-4 relative">
                    {/* Back button row */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 text-primary/60 hover:text-accent transition-colors font-bold uppercase tracking-widest text-xs"
                            aria-label="Go back to previous page"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>

                        <span className="text-primary/20">|</span>

                        <Link href="/get-involved">
                            <a className="inline-flex items-center gap-2 text-primary/60 hover:text-accent transition-colors font-bold uppercase tracking-widest text-xs">
                                All Opportunities
                            </a>
                        </Link>
                    </div>

                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3 flex items-center gap-2">
                            <Flower size={14} /> {org.audience}
                        </p>
                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4 leading-tight">
                            {org.name}
                        </h1>
                        <p className="font-serif text-2xl italic text-accent mb-6">
                            {org.tagline}
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {org.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
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
                                    <p className="text-sm text-muted-foreground mt-1">All women of the parish are welcome.</p>
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
                        <Button
                            onClick={() => window.open(FORM_URLS.signUpToHelp, '_blank', 'noopener,noreferrer')}
                            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg"
                        >
                            <Users size={16} className="mr-2" /> Become a Member
                        </Button>
                        <Button
                            onClick={() => window.open(FORM_URLS.referral, '_blank', 'noopener,noreferrer')}
                            variant="outline"
                            className="px-8 py-6 font-bold uppercase tracking-widest border-2"
                        >
                            <Heart size={16} className="mr-2" /> Refer a Member
                        </Button>
                    </div>
                </div>
            </section>

            {/* Officers Section */}
            <section className="py-16 md:py-20 bg-background">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3 flex items-center justify-center gap-2">
                            <Cross size={14} /> Leadership
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                            Society Officers
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            The women who lead the Altar Society this year.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
                                            <Flower className="size-10 text-primary/10 mb-3" />
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

            {/* Members Gallery */}
            <section className="py-16 md:py-20 bg-secondary/20 border-t border-primary/10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3 flex items-center justify-center gap-2">
                            <Users size={14} /> Our Sisterhood
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                            Members
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            The women who lovingly care for our altar and our parish home.
                        </p>
                    </div>

                    {org.members.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-primary/15">
                            <Flower2 className="size-12 text-primary/20 mx-auto mb-4" />
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
                                            <Flower className="size-10 text-primary/15" />
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

            {/* Upcoming Events Section */}
            <section className="py-16 md:py-20 bg-background border-t border-primary/10">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3 flex items-center justify-center gap-2">
                            <Calendar size={14} /> On the Calendar
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                            Upcoming Events
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Society meetings and parish gatherings for the next 90 days.
                        </p>
                    </div>

                    <UpcomingOrgEvents
                        events={upcomingEvents}
                        orgName="Altar Society"
                        emptyMessage="No upcoming Altar Society events in the next 90 days."
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
