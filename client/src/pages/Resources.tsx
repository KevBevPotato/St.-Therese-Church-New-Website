import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    Calendar,
    Church,
    ExternalLink,
    FileText,
    GraduationCap,
    Heart,
    HelpCircle,
    Mail,
    Phone,
    Shield,
    Users,
} from 'lucide-react';

interface ResourceLink {
    id: string;
    title: string;
    description: string;
    href: string;
    external: boolean;
    icon: React.ReactNode;
}

interface ResourceCategory {
    id: string;
    title: string;
    description: string;
    links: ResourceLink[];
}

const categories: ResourceCategory[] = [
    {
        id: 'parish',
        title: 'Parish Life',
        description: 'Stay connected with what is happening at St. Thérèse.',
        links: [
            {
                id: 'bulletin',
                title: 'Weekly Bulletin',
                description: 'Read the latest parish bulletin with announcements, Mass intentions, and the liturgical schedule.',
                href: '/bulletin',
                external: false,
                icon: <FileText size={20} />,
            },
            {
                id: 'events',
                title: 'Parish Calendar',
                description: 'See upcoming Masses, meetings, and parish events for the next 90+ days.',
                href: '/events',
                external: false,
                icon: <Calendar size={20} />,
            },
            {
                id: 'staff',
                title: 'Meet Our Staff',
                description: 'Get to know the clergy and staff serving our parish family.',
                href: '/about',
                external: false,
                icon: <Users size={20} />,
            },
        ],
    },
    {
        id: 'faith',
        title: 'Faith Resources',
        description: 'Grow deeper in your relationship with Christ.',
        links: [
            {
                id: 'formation',
                title: 'Faith Formation Programs',
                description: 'Religious education for preschool through adult — register for the new school year.',
                href: '/faith-formation',
                external: false,
                icon: <GraduationCap size={20} />,
            },
            {
                id: 'sacraments',
                title: 'The Seven Sacraments',
                description: 'Learn about each of the seven sacraments and how to begin preparation.',
                href: '/sacraments',
                external: false,
                icon: <BookOpen size={20} />,
            },
            {
                id: 'readings',
                title: 'Daily Readings',
                description: 'The USCCB provides the daily Mass readings online.',
                href: 'https://bible.usccb.org/daily-bible-reading',
                external: true,
                icon: <BookOpen size={20} />,
            },
            {
                id: 'catechism',
                title: 'Catechism of the Catholic Church',
                description: 'Read the Catechism online to deepen your understanding of Catholic teaching.',
                href: 'https://www.vatican.va/archive/ccc/index.htm',
                external: true,
                icon: <BookOpen size={20} />,
            },
        ],
    },
    {
        id: 'giving',
        title: 'Giving & Stewardship',
        description: 'Support the mission and ministry of our parish.',
        links: [
            {
                id: 'donate',
                title: 'Online Giving',
                description: 'Make a one-time or recurring gift through our secure online giving system.',
                href: 'https://secure.myvanco.com/L-ZAYT/home',
                external: true,
                icon: <Heart size={20} />,
            },
        ],
    },
    {
        id: 'diocesan',
        title: 'Diocesan & Catholic Links',
        description: 'Connect with the wider Catholic Church and our diocese.',
        links: [
            {
                id: 'diocese',
                title: 'Diocese of Rapid City',
                description: 'Visit the official website of our diocese for news, schools, and resources.',
                href: 'https://www.rapidcitydiocese.org',
                external: true,
                icon: <Church size={20} />,
            },
            {
                id: 'vocations',
                title: 'Vocations',
                description: 'Discern a vocation to the priesthood, diaconate, or religious life.',
                href: 'https://gods-call.com',
                external: true,
                icon: <GraduationCap size={20} />,
            },
            {
                id: 'usccb',
                title: 'USCCB',
                description: 'United States Conference of Catholic Bishops — official national resource.',
                href: 'https://www.usccb.org',
                external: true,
                icon: <Church size={20} />,
            },
            {
                id: 'vatican',
                title: 'The Vatican',
                description: "Visit the Holy See's official website for universal Church news and teaching.",
                href: 'https://www.vatican.va',
                external: true,
                icon: <Church size={20} />,
            },
        ],
    },
    {
        id: 'safe',
        title: 'Safe Environment',
        description: 'Our commitment to the safety and dignity of every person.',
        links: [
            {
                id: 'safe',
                title: 'Safe Environment Training',
                description: 'All volunteers and staff complete Safe Environment training through the diocese.',
                href: 'https://www.rapidcitydiocese.org/safe-environment',
                external: true,
                icon: <Shield size={20} />,
            },
        ],
    },
];

export default function Resources() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="pt-[var(--header-height)]" />

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
                <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
                <div className="container relative grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-end mx-auto px-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                            <BookOpen className="size-4" aria-hidden="true" /> At Your Fingertips
                        </p>
                        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                            Parish Resources.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            A central place to find bulletins, calendars, diocesan links, formation programs, and other resources that help our parish family stay connected and grow in faith.
                        </p>
                    </div>
                    <aside className="border-l-2 border-[#b8954f] pl-6 md:mb-1">
                        <p className="font-serif text-2xl italic leading-snug text-primary">
                            "All things were made through him, and without him was not any thing made that was made."
                        </p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f]">
                            John 1:3
                        </p>
                    </aside>
                </div>
            </section>

            {/* Quick Action Bar */}
            <section className="py-10 bg-primary text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                        <a
                            href="https://secure.myvanco.com/L-ZAYT/home"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-2xl bg-white/10 hover:bg-white/20 transition-colors p-4 group"
                        >
                            <Heart className="mx-auto mb-2 text-accent" size={24} />
                            <p className="font-bold text-sm">Donate</p>
                            <p className="text-xs text-white/70">Online giving</p>
                        </a>
                        <Link
                            href="/bulletin"
                            className="rounded-2xl bg-white/10 hover:bg-white/20 transition-colors p-4 group"
                        >
                            <FileText className="mx-auto mb-2 text-accent" size={24} />
                            <p className="font-bold text-sm">Bulletin</p>
                            <p className="text-xs text-white/70">This week</p>
                        </Link>
                        <Link
                            href="/events"
                            className="rounded-2xl bg-white/10 hover:bg-white/20 transition-colors p-4 group"
                        >
                            <Calendar className="mx-auto mb-2 text-accent" size={24} />
                            <p className="font-bold text-sm">Calendar</p>
                            <p className="text-xs text-white/70">Upcoming events</p>
                        </Link>
                        <a
                            href="tel:6053421556"
                            className="rounded-2xl bg-white/10 hover:bg-white/20 transition-colors p-4 group"
                        >
                            <Phone className="mx-auto mb-2 text-accent" size={24} />
                            <p className="font-bold text-sm">Call Us</p>
                            <p className="text-xs text-white/70">(605) 342-1556</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* Resources by Category */}
            <main className="flex-grow py-16 md:py-20 bg-secondary/20">
                <div className="container mx-auto px-4 max-w-6xl space-y-16">
                    {categories.map((category) => (
                        <section key={category.id}>
                            <div className="mb-8">
                                <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
                                    {category.title}
                                </h2>
                                <p className="text-muted-foreground text-lg">
                                    {category.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {category.links.map((link) => {
                                    const className =
                                        'group flex flex-col h-full bg-white rounded-2xl border-2 border-primary/10 hover:border-primary/30 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg';

                                    const content = (
                                        <>
                                            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                                {link.icon}
                                            </div>
                                            <h3 className="font-serif text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                                                {link.title}
                                                {link.external && (
                                                    <ExternalLink
                                                        size={12}
                                                        className="inline-block ml-1.5 -mt-0.5 text-muted-foreground group-hover:text-accent"
                                                    />
                                                )}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                                                {link.description}
                                            </p>
                                        </>
                                    );

                                    if (link.external) {
                                        return (
                                            <a
                                                key={link.id}
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={className}
                                            >
                                                {content}
                                            </a>
                                        );
                                    }

                                    return (
                                        <Link key={link.id} href={link.href}>
                                            <a className={className}>{content}</a>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            {/* Help Box */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Card className="p-8 md:p-10 border-2 border-primary/10 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0">
                                <HelpCircle size={28} />
                            </div>
                            <div>
                                <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                                    Looking for something specific?
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    If you can't find what you need here, our parish office is happy to point you in the right direction. We're here to help.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="tel:6053421556"
                                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-md"
                                    >
                                        <Phone size={12} /> (605) 342-1556
                                    </a>
                                    <a
                                        href="mailto:connie.heeren@strcstaff.org"
                                        className="inline-flex items-center gap-2 bg-white border border-primary/20 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        <Mail size={12} /> Email Office
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <Footer />
        </div>
    );
}
