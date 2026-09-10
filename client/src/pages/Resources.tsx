import { useEffect, useState } from 'react';
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
    href?: string;
    external: boolean;
    icon: React.ReactNode;
    image?: string;
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

const additionalCategories: ResourceCategory[] = [
    {
        id: 'daily-walk',
        title: 'The Daily Walk',
        description: 'Prayer and digital wellness resources for building a faithful daily rhythm.',
        links: [
            { id: 'daily-readings', title: 'USCCB Daily Readings', description: "Stay in sync with the Church's liturgical cycle. Find today's readings and prepare your heart for Mass.", href: 'https://bible.usccb.org/readings/calendar', external: true, icon: <BookOpen size={20} /> },
            { id: 'kindle-ebooks', title: 'Kindle Ebooks', description: 'Download digital versions of Mass times, Lauds, and Vespers for portable, traditional prayer.', external: false, icon: <BookOpen size={20} /> },
            { id: 'formed', title: 'FORMED', description: 'The Catholic Netflix: a large library of high-quality videos, movies, and books for the whole family.', href: 'https://formed.org', external: true, icon: <BookOpen size={20} /> },
            { id: 'hallow', title: 'Hallow', description: 'A Catholic app for meditation, prayer, and sleep.', href: 'https://hallow.com', external: true, icon: <Heart size={20} /> },
            { id: 'ibreviary', title: 'iBreviary', description: 'The Liturgy of the Hours, Mass readings, and prayers in your pocket.', href: 'https://ibreviary.com', external: true, icon: <BookOpen size={20} /> },
            { id: 'mybible', title: 'MyBible App', description: 'A powerful Bible tool available in almost any language.', href: 'https://mybible.zone', external: true, icon: <BookOpen size={20} /> },
            { id: 'shift', title: 'Shift', description: 'Take back your time and return to the physical world by removing digital distractions. Includes a free phone pornography blocker with one-time, lifetime access.', href: 'https://shiftyourphone.com', external: true, icon: <Shield size={20} /> },
        ],
    },
    {
        id: 'search-for-truth',
        title: 'The Search for Truth',
        description: 'Apologetics, Catholic answers, and tools for finding trustworthy sources.',
        links: [
            { id: 'catholic-com', title: 'Catholic Answers Resource Hub', description: 'Find quick guides, visual learning, magazines, and practical answers about the Catholic faith.', href: 'https://catholic.com', external: true, icon: <HelpCircle size={20} /> },
            { id: 'bible-navigator', title: 'Bible Navigator', description: 'Find the scriptural roots of Catholic teaching.', href: 'https://catholic.com/bible-navigator', external: true, icon: <BookOpen size={20} /> },
            { id: 'catholic-qa', title: 'Catholic Answers Q&A', description: 'Explore a large archive of common questions about the faith.', href: 'https://catholic.com/qa', external: true, icon: <HelpCircle size={20} /> },
            { id: 'justin-ai', title: 'Justin AI', description: 'A 24/7 Catholic assistant for theological answers.', href: 'https://justin.ai', external: true, icon: <HelpCircle size={20} /> },
            { id: 'magisterium-ai', title: 'Magisterium AI', description: 'Query official Church documents for exact sources.', href: 'https://www.magisterium.com', external: true, icon: <FileText size={20} /> },
            { id: 'truthly', title: 'Truthly', description: 'Accessible, bite-sized Catholic truths for the modern age.', href: 'https://truthly.app', external: true, icon: <BookOpen size={20} /> },
            { id: 'school-apologetics', title: 'School of Apologetics', description: 'Structured courses to help you explain and defend the faith with confidence and charity.', href: 'https://schoolofapologetics.com', external: true, icon: <GraduationCap size={20} /> },
            { id: 'new-advent', title: 'NewAdvent.org', description: 'A heritage library featuring the Catholic Encyclopedia and writings of the Early Church Fathers.', href: 'https://www.newadvent.org', external: true, icon: <BookOpen size={20} /> },
        ],
    },
    {
        id: 'growth-discipleship',
        title: 'Growth & Discipleship',
        description: 'Bible study, missionary discipleship, and podcasts for continuing formation.',
        links: [
            { id: 'focus', title: 'FOCUS Bible Study Path', description: 'Explore The Crux, Story of Salvation, and Life in Christ, plus studies in Theology of the Body, Catholic Social Teaching, and Feminine Genius.', href: 'https://focus.org', external: true, icon: <GraduationCap size={20} /> },
            { id: 'focus-foundations', title: 'FOCUS Foundations for Discipleship', description: 'WIN: encounter the Gospel. BUILD: grow in prayer, Eucharistic devotion, friendship, and Confession. SEND: accompany others and lead them to conversion.', href: 'https://focus.org', external: true, icon: <Users size={20} /> },
            { id: 'ascension-presents', title: 'Ascension Presents', description: 'Join Fr. Mike Schmitz for Bible in a Year, Catechism in a Year, or Rosary in a Year.', href: 'https://media.ascensionpress.com/category/ascension-presents', external: true, icon: <BookOpen size={20} /> },
            { id: 'pints-aquinas', title: 'Pints with Aquinas', description: 'Deep conversations on faith, culture, and politics with Matt Fradd.', href: 'https://www.dailywire.com/hosts/matt-fradd', external: true, icon: <BookOpen size={20} /> },
            { id: 'how-christian', title: 'How to Be Christian', description: 'A witty, engaging, step-by-step guide for those seeking the Truth.', href: 'https://www.youtube.com/@HowToBeChristian', external: true, icon: <BookOpen size={20} /> },
            { id: 'counsel-trent', title: 'The Counsel of Trent', description: 'Logic and wit used to break down tough apologetic arguments.', href: 'https://www.catholic.com/audio/cot', external: true, icon: <HelpCircle size={20} /> },
            { id: 'catholic-answers-suite', title: 'The Catholic Answers Suite', description: 'CA Live, Shameless Popery, The Jimmy Akin Podcast, Jimmy Akin’s Mysterious World, Dr. Karlo, Daily Defense, and more.', href: 'https://catholic.com/audio', external: true, icon: <BookOpen size={20} /> },
            { id: 'other-podcasts', title: 'Other Great Podcasts', description: 'Explore Word on Fire, Godsplaining, and Abiding Together.', href: 'https://www.wordonfire.org', external: true, icon: <BookOpen size={20} /> },
        ],
    },
    {
        id: 'domestic-church',
        title: 'The Domestic Church',
        description: 'Homeschooling, family catechesis, and supplemental resources for the home.',
        links: [
            { id: 'bear-good-fruits', title: 'Bear Good Fruits', description: 'A Charlotte Mason-inspired, family-style liturgical curriculum integrating Scripture, saint stories, nature study, art, and hands-on projects from PreK through high school.', href: 'https://www.beargoodfruits.com', external: true, icon: <GraduationCap size={20} /> },
            { id: 'into-the-deep', title: 'Into the Deep', description: 'A thorough catechesis program centered on a personal relationship with God, sound doctrine, art, hymns, and poetry.', external: false, icon: <BookOpen size={20} /> },
            { id: 'spirit-of-truth', title: 'Spirit of Truth', description: 'Sophia Institute materials designed to help children encounter Christ through beauty and goodness, with grades K–8 and sacramental preparation.', href: 'https://sophiainstituteforteachers.org', external: true, icon: <GraduationCap size={20} /> },
            { id: 'our-holy-faith', title: 'Our Holy Faith', description: 'Tan Books religion textbooks balancing intellectual knowledge with spiritual growth and practical activities.', href: 'https://tanbooks.com', external: true, icon: <BookOpen size={20} /> },
            { id: 'sophia-teachers', title: 'SophiaTeachers eLessons', description: 'Ready-to-use lessons on the liturgical year, current events, identity, beauty, nature, and family Bible study.', href: 'https://sophiainstituteforteachers.org', external: true, icon: <GraduationCap size={20} /> },
            { id: 'family-bible-study', title: 'Family Bible Study', description: 'USCCB guides for using the Old Testament in daily family prayer.', href: 'https://www.usccb.org/bible', external: true, icon: <BookOpen size={20} /> },
        ],
    },
    {
        id: 'local-community',
        title: 'Local Community',
        description: 'Rapid City, diocesan, and local Catholic resources for spiritual life and connection.',
        links: [
            { id: 'mustard-seed', title: 'Mustard Seed Catholic Bookstore', description: 'A Rapid City destination for books, sacramentals, and religious gifts.', href: 'https://www.mustardseedcatholicstore.com', external: true, icon: <BookOpen size={20} /> },
            { id: 'adoration', title: 'Perpetual Adoration', description: 'Find peace and silence in the 24/7 presence of the Blessed Sacrament.', external: false, icon: <Church size={20} /> },
            { id: 'family-rosary', title: 'Family Rosary at St. Thérèse', description: 'A community prayer event and a welcoming way to introduce children to the Rosary.', href: '/events', external: false, icon: <Heart size={20} /> },
            { id: 'terra-sancta', title: 'Terra Sancta', description: 'Local events and education exploring the Holy Land.', href: 'https://terrasancta.org', external: true, icon: <Church size={20} /> },
            { id: 'diocesan-retreats', title: 'Diocesan Retreats', description: 'Scheduled opportunities to unplug and renew your spirit.', href: 'https://www.rapidcitydiocese.org', external: true, icon: <Heart size={20} /> },
            { id: 'relevant-radio', title: 'Relevant Radio', description: 'Daily inspiration and Catholic content, with an app for on-demand shows.', href: 'https://relevantradio.com', external: true, icon: <Phone size={20} /> },
            { id: 'ewtn', title: 'EWTN', description: 'Global Catholic news, Mass, and teaching. Download the app for access worldwide.', href: 'https://www.ewtn.com', external: true, icon: <Church size={20} /> },
            { id: 'bishops-podcast', title: 'Bishop’s Podcast', description: 'Catholic conversation and formation from the Diocese of Rapid City.', href: 'https://www.rapidcitydiocese.org', external: true, icon: <BookOpen size={20} /> },
            { id: 'bishops-bookclub', title: 'Bishop’s Bookclub', description: 'Books and conversations for growing in faith and understanding.', href: 'https://www.rapidcitydiocese.org', external: true, icon: <BookOpen size={20} /> },
            { id: 'bishops-movie-nights', title: 'Bishop’s Movie Nights', description: 'Film and conversation from the Diocese of Rapid City.', href: 'https://www.rapidcitydiocese.org', external: true, icon: <Church size={20} /> },
        ],
    },
];

const allCategories = [...categories, ...additionalCategories];

export default function Resources() {
    const [activeCategory, setActiveCategory] = useState(allCategories[0]?.id ?? '');

    useEffect(() => {
        const sections = allCategories
            .map((category) => document.getElementById(`resource-section-${category.id}`))
            .filter((section): section is HTMLElement => Boolean(section));

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visibleSections[0]) {
                    setActiveCategory(visibleSections[0].target.id.replace('resource-section-', ''));
                }
            },
            { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

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
            <main className="flex-grow bg-secondary/20 py-16 md:py-20">
                <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
                    <aside className="hidden lg:block">
                        <nav className="sticky top-[calc(var(--header-height)+2rem)] max-h-[calc(100vh-var(--header-height)-4rem)] overflow-y-auto pr-2" aria-label="Resources outline">
                            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-primary/50">On this page</p>
                            <div className="space-y-1 border-l border-primary/10">
                                {allCategories.map((category) => {
                                    const isActive = activeCategory === category.id;
                                    return (
                                        <a
                                            key={category.id}
                                            href={`#resource-section-${category.id}`}
                                            className={`block border-l-2 py-2 pl-4 text-sm font-semibold transition-all ${isActive ? 'border-accent text-primary' : 'border-transparent text-primary/40 hover:border-primary/30 hover:text-primary/75'}`}
                                        >
                                            {category.title}
                                        </a>
                                    );
                                })}
                            </div>
                        </nav>
                    </aside>

                    <div className="space-y-16">
                    {allCategories.map((category) => (
                        <section key={category.id} id={`resource-section-${category.id}`} className="scroll-mt-[calc(var(--header-height)+2rem)]">
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
                                        `group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-primary/10 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg ${link.image ? 'bg-primary text-white' : 'bg-white'}`;

                                    const content = (
                                        <>
                                            {link.image && (
                                                <>
                                                    <img src={link.image} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover opacity-25 transition-opacity group-hover:opacity-35" />
                                                    <div className="absolute inset-0 bg-primary/70" aria-hidden="true" />
                                                </>
                                            )}
                                            <div className="relative z-10 flex h-full flex-col">
                                                <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl transition-colors ${link.image ? 'bg-white/15 text-white group-hover:bg-white group-hover:text-primary' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                                                    {link.icon}
                                                </div>
                                                <h3 className={`mb-2 font-serif text-xl font-bold transition-colors ${link.image ? 'text-white group-hover:text-accent' : 'text-primary group-hover:text-accent'}`}>
                                                    {link.title}
                                                    {link.external && (
                                                        <ExternalLink
                                                            size={12}
                                                            className={`ml-1.5 inline-block -mt-0.5 ${link.image ? 'text-white/70 group-hover:text-accent' : 'text-muted-foreground group-hover:text-accent'}`}
                                                        />
                                                    )}
                                                </h3>
                                                <p className={`flex-grow text-sm leading-relaxed ${link.image ? 'text-white/85' : 'text-muted-foreground'}`}>
                                                    {link.description}
                                                </p>
                                            </div>
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

                                    if (link.href) {
                                        return (
                                            <Link key={link.id} href={link.href}>
                                                <a className={className}>{content}</a>
                                            </Link>
                                        );
                                    }

                                    return <div key={link.id} className={className}>{content}</div>;
                                })}
                            </div>
                        </section>
                    ))}
                    </div>
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
