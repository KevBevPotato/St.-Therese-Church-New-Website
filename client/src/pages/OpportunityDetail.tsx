import { useRoute } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Calendar,
    Phone,
    Mail,
    CheckCircle2,
    HelpCircle,
    Users,
    Heart
} from 'lucide-react';
import { Link } from 'wouter';
import getInvolvedData from '@/data/get-involved_data.json';
import { staticEvents, generateRecurringEventsForMonth, type EventOrganizationTag } from '@/components/eventfolders/events';
import UpcomingOrgEvents from '@/components/UpcomingOrgEvents';

interface OpportunityDetailData {
    id: string;
    title: string;
    organization?: string;
    landingPageTitle?: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    description: string;
    landingPageDescription?: string;
    faqs?: Array<{ question: string; answer: string }>;
    requirements?: string[];
    images?: string[];
    signUpLinks?: Array<{ label: string; url: string }>;
}

/**
 * Opportunity Detail Page
 * A dynamic template to explain specific parish projects and groups in depth.
 */

export default function OpportunityDetail() {
    const [match, params] = useRoute('/get-involved/:id');

    const id = params?.id;
    const opportunities = getInvolvedData.opportunities as OpportunityDetailData[];
    const opportunity = opportunities.find((item) => item.id === id);

    if (!match) return null;
    if (!opportunity) {
        return (
            <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
                <Header />
                <div className="pt-[var(--header-height)]" />
                <main className="container mx-auto flex-grow px-4 py-16 text-center">
                    <h1 className="font-serif text-4xl font-bold text-primary">Opportunity Not Found</h1>
                    <Link href="/get-involved">
                        <Button className="mt-6">Back to Opportunities</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const details = {
        title: opportunity.landingPageTitle ?? opportunity.title,
        organization: opportunity.organization ?? 'St. Thérèse Parish',
        contact: {
            name: opportunity.contactName,
            phone: opportunity.contactPhone,
            email: opportunity.contactEmail ?? getInvolvedData.settings.contactEmail,
        },
        description: opportunity.landingPageDescription ?? opportunity.description,
        faqs: opportunity.faqs ?? [],
        requirements: opportunity.requirements ?? [],
        images: opportunity.images ?? [],
        signUpLinks: opportunity.signUpLinks ?? [],
    };
    const calendarTagByOpportunityId: Record<string, EventOrganizationTag> = {
        'catholic-daughters': 'catholic-daughters',
        'st-vincent-de-paul-food-drive': 'st-vincent-de-paul',
    };
    const organizationTag = calendarTagByOpportunityId[id ?? ''];
    const now = new Date();
    const calendarCutoff = new Date();
    calendarCutoff.setDate(calendarCutoff.getDate() + 90);
    const calendarEvents = organizationTag
        ? [
            ...staticEvents,
            ...[0, 1, 2].flatMap((monthOffset) => {
                const date = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
                return generateRecurringEventsForMonth(date.getMonth(), date.getFullYear());
            }),
        ]
            .filter((event) =>
                event.organizationTags?.includes(organizationTag) &&
                event.date >= now &&
                event.date <= calendarCutoff
            )
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 6)
        : [];


    return (
        <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
            <Header />
            <div className="pt-[var(--header-height)]" />

            <main className="flex-grow container mx-auto px-4 py-12">
                <Link href="/get-involved">
                    <button className="flex items-center gap-2 text-primary/60 hover:text-accent transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft size={16} /> Back to Opportunities
                    </button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">
                                    {details.organization}
                                </span>
                            </div>
                            <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                                {details.title}
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {details.description}
                            </p>
                        </div>

                        {details.images.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {details.images.map((image, index) => (
                                    <div key={`${image}-${index}`} className="aspect-video bg-gray-200 rounded-3xl overflow-hidden relative group">
                                        <img src={image} alt={`${details.title} ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-primary/10" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {details.faqs.length > 0 && <div className="space-y-8 pt-8">
                            <h2 className="font-serif text-3xl font-bold text-primary flex items-center gap-3">
                                <HelpCircle className="text-accent" /> Frequently Asked Questions
                            </h2>
                            <div className="space-y-6">
                                {details.faqs.map((faq, i) => (
                                    <div key={i} className="bg-white p-8 rounded-3xl border border-primary/5 shadow-sm">
                                        <h4 className="font-bold text-primary mb-3">{faq.question}</h4>
                                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>}
                    </div>

                    <div className="space-y-8">
                        <Card className="p-8 border-none shadow-xl bg-white rounded-[2rem]">
                            <h3 className="font-serif text-2xl font-bold text-primary mb-6">Ready to Serve?</h3>
                            <div className="space-y-4 mb-8">
                                {details.requirements.map((req, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
                                        <span>{req}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/get-involved">
                                <Button className="w-full bg-primary hover:bg-primary/90 py-8 text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                                    Fill Interest Form
                                </Button>
                            </Link>
                            {details.signUpLinks.map((link) => (
                                <a
                                    key={`${link.label}-${link.url}`}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block rounded-full border border-primary/20 bg-white px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:border-accent hover:text-accent"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </Card>

                        <Card className="p-8 border-none shadow-lg bg-primary text-white rounded-[2rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Users size={80} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-6 relative z-10">Who to Contact</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <Heart size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold">{details.contact.name}</p>
                                        <p className="text-xs text-white/60 uppercase tracking-widest">Coordinator</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/10 space-y-3">
                                    <a href={`tel:${details.contact.phone.replace(/\D/g, '')}`} className="flex items-center gap-3 text-sm hover:text-accent transition-colors">
                                        <Phone size={16} /> {details.contact.phone}
                                    </a>
                                    {details.contact.email && (
                                        <a href={`mailto:${details.contact.email}`} className="flex items-center gap-3 text-sm hover:text-accent transition-colors">
                                            <Mail size={16} /> {details.contact.email}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {organizationTag && (
                    <section className="mt-16 border-t border-primary/10 pt-16">
                        <div className="mb-10 text-center">
                            <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                                <Calendar size={14} /> On the Calendar
                            </p>
                            <h2 className="mb-4 font-serif text-4xl font-bold text-primary">Upcoming Events</h2>
                        </div>
                        <UpcomingOrgEvents
                            events={calendarEvents}
                            orgName={details.organization}
                        />
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
