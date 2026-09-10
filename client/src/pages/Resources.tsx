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
    image: string;
    iconImage?: string;
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
        description: 'Stay connected with the community and programs at St. Thérèse.',
        links: [
            {
                id: 'bulletin',
                title: 'Weekly Bulletin',
                description: 'Read the latest parish bulletin with announcements, Mass intentions, and the liturgical schedule.',
                href: '/bulletin',
                external: false,
                icon: <FileText size={20} />,
                image: '/resources/bulletin.jpg',
            },
            {
                id: 'events',
                title: 'Parish Calendar',
                description: 'See upcoming Masses, meetings, and parish events for the next 90+ days.',
                href: '/events',
                external: false,
                icon: <Calendar size={20} />,
                image: '/resources/calendar.jpg',
            },
            {
                id: 'formation',
                title: 'Faith Formation Programs',
                description: 'Religious education for preschool through adult — register for the new school year.',
                href: '/faith-formation',
                external: false,
                icon: <GraduationCap size={20} />,
                image: '/resources/formation.jpg',
            },
            {
                id: 'staff',
                title: 'Meet Our Staff',
                description: 'Get to know the clergy and staff serving our parish family.',
                href: '/about',
                external: false,
                icon: <Users size={20} />,
                image: '/resources/staff.jpg',
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
                image: '/resources/giving.jpg',
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
                image: '/resources/safe-env.jpg',
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
            { id: 'daily-readings', title: 'USCCB Daily Readings', description: "Stay in sync with the Church's liturgical cycle.", href: 'https://bible.usccb.org/readings/calendar', external: true, icon: <BookOpen size={20} />, image: '/resources/USCCB.png', iconImage: '/resources/USCCB.png' },
            { id: 'catechism', title: 'Catechism of the Catholic Church', description: 'The official guide to Catholic teaching and faith.', href: 'https://www.vatican.va/archive/ccc/index.htm', external: true, icon: <BookOpen size={20} />, image: '/resources/ccc.jpg' },
            { id: 'kindle-ebooks', title: 'Kindle Ebooks', description: 'Digital versions of Mass times, Lauds, and Vespers.', external: false, icon: <BookOpen size={20} />, image: '/resources/kindle.jpg' },
            { id: 'formed', title: 'FORMED', description: 'The "Catholic Netflix" for the whole family.', href: 'https://formed.org', external: true, icon: <BookOpen size={20} />, image: '/resources/formed.jpg' },
            { id: 'hallow', title: 'Hallow', description: 'The #1 Catholic app for meditation and prayer.', href: 'https://hallow.com', external: true, icon: <Heart size={20} />, image: '/resources/Hallow.png', iconImage: '/resources/Hallow.png' },
            { id: 'ibreviary', title: 'iBreviary', description: 'Liturgy of the Hours and Mass readings in your pocket.', href: 'https://ibreviary.com', external: true, icon: <BookOpen size={20} />, image: '/resources/ibreviary.webp', iconImage: '/resources/iBreviaryApp.png' },
            { id: 'mybible', title: 'MyBible App', description: 'A powerful Bible tool available in almost any language.', href: 'https://mybible.zone', external: true, icon: <BookOpen size={20} />, image: '/resources/MyBible.png', iconImage: '/resources/MyBible.png' },
            { id: 'shift', title: 'Shift', description: 'Take back your time by removing digital distractions.', href: 'https://shiftyourphone.com', external: true, icon: <Shield size={20} />, image: '/resources/Shift.png', iconImage: '/resources/Shift.png' },
        ],
    },
    {
        id: 'search-for-truth',
        title: 'The Search for Truth',
        description: 'Apologetics and tools for finding trustworthy sources of Catholic teaching.',
        links: [
            { id: 'sacraments', title: 'The Seven Sacraments', description: 'Learn about each of the seven sacraments and preparation.', href: '/sacraments', external: false, icon: <BookOpen size={20} />, image: '/resources/sacraments.jpg' },
            { id: 'catholic-com', title: 'Catholic Answers Hub', description: 'Quick guides, visual learning, and deep dives into the faith.', href: 'https://catholic.com', external: true, icon: <HelpCircle size={20} />, image: '/resources/CatholicAnswers.png', iconImage: '/resources/CatholicAnswers.png' },
            { id: 'bible-navigator', title: 'Bible Navigator', description: 'Find the scriptural roots of Catholic teaching.', href: 'https://catholic.com/bible-navigator', external: true, icon: <BookOpen size={20} />, image: '/resources/bible-nav.jpg' },
            { id: 'catholic-qa', title: 'Catholic Answers Q&A', description: 'A massive library of common questions about the faith.', href: 'https://catholic.com/qa', external: true, icon: <HelpCircle size={20} />, image: '/resources/CatholicAnswers.png', iconImage: '/resources/CatholicAnswers.png' },
            { id: 'justin-ai', title: 'Justin AI', description: '24/7 Catholic assistant for theological answers.', href: 'https://justin.ai', external: true, icon: <HelpCircle size={20} />, image: '/resources/justin-ai.jpg' },
            { id: 'magisterium-ai', title: 'Magisterium AI', description: 'Query official Church documents for exact sources.', href: 'https://www.magisterium.com', external: true, icon: <FileText size={20} />, image: '/resources/Magisterium AI.png', iconImage: '/resources/Magisterium AI.png' },
            { id: 'truthly', title: 'Truthly', description: 'Bite-sized Catholic truths for the modern age.', href: 'https://truthly.app', external: true, icon: <BookOpen size={20} />, image: '/resources/Truthly.png', iconImage: '/resources/Truthly.png' },
            { id: 'school-apologetics', title: 'School of Apologetics', description: 'Structured courses to explain and defend the faith.', href: 'https://schoolofapologetics.com', external: true, icon: <GraduationCap size={20} />, image: '/resources/school-apologetics.jpg' },
            { id: 'new-advent', title: 'NewAdvent.org', description: 'The Catholic Encyclopedia and Early Church Fathers.', href: 'https://www.newadvent.org', external: true, icon: <BookOpen size={20} />, image: '/resources/new-advent.jpg' },
        ],
    },
    {
        id: 'growth-discipleship',
        title: 'Growth & Discipleship',
        description: 'Bible study, missionary discipleship, and podcasts for continuing formation.',
        links: [
            { id: 'focus', title: 'FOCUS Bible Study Path', description: 'The Crux, Story of Salvation, and Life in Christ.', href: 'https://focus.org', external: true, icon: <GraduationCap size={20} />, image: '/resources/FOCUS.png', iconImage: '/resources/FOCUS.png' },
            { id: 'focus-foundations', title: 'Foundations for Discipleship', description: 'A roadmap: WIN (Encounter), BUILD (Prayer), and SEND (Mission).', href: 'https://focus.org', external: true, icon: <Users size={20} />, image: '/resources/FOCUS.png', iconImage: '/resources/FOCUS.png' },
            { id: 'bible-year', title: 'Bible in a Year', description: 'Join Fr. Mike Schmitz for a guided journey through the Bible.', href: 'https://bibleinayear.com', external: true, icon: <BookOpen size={20} />, image: '/resources/Ascension.png', iconImage: '/resources/Ascension.png' },
            { id: 'catechism-year', title: 'Catechism in a Year', description: 'Deepen your understanding of the faith with Fr. Mike Schmitz.', href: 'https://catechismInayear.com', external: true, icon: <BookOpen size={20} />, image: '/resources/Ascension.png', iconImage: '/resources/Ascension.png' },
            { id: 'rosary-year', title: 'Rosary in a Year', description: 'Daily meditation on the mysteries of the Holy Rosary.', href: 'https://rosaryinayear.com', external: true, icon: <Heart size={20} />, image: '/resources/Ascension.png', iconImage: '/resources/Ascension.png' },
            { id: 'pints-aquinas', title: 'Pints with Aquinas', description: 'Faith, culture, and politics with Matt Fradd.', href: 'https://www.dailywire.com/hosts/matt-fradd', external: true, icon: <BookOpen size={20} />, image: '/resources/PintsWithAquinas.png', iconImage: '/resources/PintsWithAquinas.png' },
            { id: 'how-christian', title: 'How to Be Christian', description: 'A witty, engaging guide for those seeking the Truth.', href: 'https://www.youtube.com/@HowToBeChristian', external: true, icon: <BookOpen size={20} />, image: '/resources/HowToBeChristian.png', iconImage: '/resources/HowToBeChristian.png' },
            { id: 'counsel-trent', title: 'The Counsel of Trent', description: 'Logic and wit used to break down tough arguments.', href: 'https://www.catholic.com/audio/cot', external: true, icon: <HelpCircle size={20} />, image: '/resources/CouncilofTrent.png', iconImage: '/resources/CouncilofTrent.png' },
            { id: 'catholic-answers-suite', title: 'The Catholic Answers Suite', description: 'CA Live, Shameless Popery, and The Jimmy Akin Podcast.', href: 'https://catholic.com/audio', external: true, icon: <BookOpen size={20} />, image: '/resources/ShamelessPopery.png', iconImage: '/resources/ShamelessPopery.png' },
            { id: 'godsplaining', title: 'Godsplaining', description: 'Exploring the faith through a fresh, engaging perspective.', href: 'https://godsplaining.com', external: true, icon: <BookOpen size={20} />, image: '/resources/Godsplaining.png', iconImage: '/resources/Godsplaining.png' },
            { id: 'abiding-together', title: 'Abiding Together', description: 'Deepening your spiritual life through community and prayer.', href: 'https://abidingtogether.com', external: true, icon: <BookOpen size={20} />, image: '/resources/AbidingTogether.png', iconImage: '/resources/AbidingTogether.png' },
            { id: 'other-podcasts', title: 'Other Great Podcasts', description: 'Explore Word on Fire, Godsplaining, and Abiding Together.', href: 'https://www.wordonfire.org', external: true, icon: <BookOpen size={20} />, image: '/resources/WordOnFire.png', iconImage: '/resources/WordOnFire.png' },
        ],
    },
    {
        id: 'domestic-church',
        title: 'The Domestic Church',
        description: 'Homeschooling, family catechesis, and supplemental resources for the home.',
        links: [
            { id: 'bear-good-fruits', title: 'Bear Good Fruits', description: 'Family-style liturgical curriculum. (PreK–Highschool).', href: 'https://www.beargoodfruits.com', external: true, icon: <GraduationCap size={20} />, image: '/resources/bear-good-fruits.jpg' },
            { id: 'into-the-deep', title: 'Into the Deep', description: 'Personal relationship and sound doctrine. (Grades 1–8).', external: false, icon: <BookOpen size={20} />, image: '/resources/into-the-deep.jpg' },
            { id: 'spirit-of-truth', title: 'Spirit of Truth', description: 'Encounter Christ through beauty and goodness. (Grades K–8).', href: 'https://sophiainstituteforteachers.org', external: true, icon: <GraduationCap size={20} />, image: '/resources/spirit-of-truth.jpg' },
            { id: 'our-holy-faith', title: 'Our Holy Faith', description: 'Orthodox textbooks for spiritual growth. (Grades K–8).', href: 'https://tanbooks.com', external: true, icon: <BookOpen size={20} />, image: '/resources/our-holy-faith.jpg' },
            { id: 'sophia-teachers', title: 'SophiaTeachers eLessons', description: 'Ready-to-use lessons on the Liturgical Year and Beauty.', href: 'https://sophiainstituteforteachers.org', external: true, icon: <GraduationCap size={20} />, image: '/resources/sophia-teachers.jpg' },
            { id: 'family-bible-study', title: 'Family Bible Study', description: 'USCCB curated guides for using the Old Testament in daily prayer.', href: 'https://www.usccb.org/bible', external: true, icon: <BookOpen size={20} />, image: '/resources/family-bible.jpg' },
        ],
    },
    {
        id: 'local-community',
        title: 'Local Community',
        description: 'Rapid City and diocesan resources for spiritual life and connection.',
        links: [
            { id: 'mustard-seed', title: 'Mustard Seed Bookstore', description: 'Rapid City destination for books and sacramentals.', href: 'https://www.mustardseedcatholicstore.com', external: true, icon: <BookOpen size={20} />, image: '/resources/mustard-seed.jpg' },
            { id: 'adoration', title: 'Perpetual Adoration', description: 'Find peace and silence in the 24/7 presence of the Blessed Sacrament.', external: false, icon: <Church size={20} />, image: '/resources/adoration.jpg' },
            { id: 'family-rosary', title: 'Family Rosary at St. Thérèse', description: 'A community prayer event for the whole family.', href: '/events', external: false, icon: <Heart size={20} />, image: '/resources/family-rosary.jpg' },
            { id: 'terra-sancta', title: 'Terra Sancta', description: 'Local events and education exploring the Holy Land.', href: 'https://terrasancta.org', external: true, icon: <Church size={20} />, image: '/resources/terra-sancta.jpg' },
            { id: 'diocesan-retreats', title: 'Diocesan Retreats', description: 'Scheduled opportunities to unplug and renew your spirit.', href: 'https://www.rapidcitydiocese.org', external: true, icon: <Heart size={20} />, image: '/resources/retreats.jpg' },
            { id: 'relevant-radio', title: 'Relevant Radio', description: 'Daily inspiration and Catholic content (89.9 / 94.7 FM).', href: 'https://relevantradio.com', external: true, icon: <Phone size={20} />, image: '/resources/relevant-radio.jpg' },
            { id: 'ewtn', title: 'EWTN', description: 'The global network for Catholic news, Mass, and teaching.', href: 'https://www.ewtn.com', external: true, icon: <Church size={20} />, image: '/resources/ewtn.jpg' },
            { id: 'bishops-podcast', title: 'Bishop’s Podcast', description: 'Conversation and formation from the Diocese of Rapid City.', href: 'https://www.rapidcitydiocese.org', external: true, icon: <BookOpen size={20} />, image: '/resources/bishops-podcast.jpg' },
            { id: 'bishops-bookclub', title: 'Bishop’s Bookclub', description: 'Books and conversations for growing in faith.', href: 'https://www.rapidcitydiocese.org', external: true, icon: <BookOpen size={20} />, image: '/resources/bishops-bookclub.jpg' },
            { id: 'bishops-movie-nights', title: 'Bishop’s Movie Nights', description: 'Film and conversation from the Diocese of Rapid City.', href: 'https://www.rapidcitydiocese.org', external: true, icon: <Church size={20} />, image: '/resources/bishops-movies.jpg' },
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
                                        const cardClassName = `group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-primary/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg`;

                                        const content = (
                                            <>
                                                {/* Ghost Background Image - Opacity bumped to 40% */}
                                                <img
                                                    src={link.image}
                                                    alt=""
                                                    aria-hidden="true"
                                                    className="absolute inset-0 size-full object-cover opacity-40 transition-opacity group-hover:opacity-60"
                                                />
                                                {/* Contrast Layer */}
                                                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" aria-hidden="true" />

                                                <div className="relative z-10 flex h-full flex-col">
                                                    <div className="flex justify-between items-start">
                                                        <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl transition-colors ${link.iconImage ? 'bg-transparent' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                                                            {link.iconImage ? (
                                                                <div className="relative size-12">
                                                                    <img
                                                                        src={link.iconImage}
                                                                        alt=""
                                                                        className="absolute inset-0 size-full rounded-xl object-cover shadow-sm border border-primary/10"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                link.icon
                                                            )}
                                                        </div>
                                                    </div>

                                                    <h3 className="mb-2 font-serif text-xl font-bold text-primary transition-colors group-hover:text-accent">
                                                        {link.title}
                                                        {link.external && (
                                                            <ExternalLink
                                                                size={12}
                                                                className="ml-1.5 inline-block -mt-0.5 text-primary/50 group-hover:text-accent"
                                                            />
                                                        )}
                                                    </h3>
                                                    <p className="flex-grow text-sm leading-relaxed text-muted-foreground">
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
                                                    className={cardClassName}
                                                >
                                                    {content}
                                                </a>
                                            );
                                        }

                                        if (link.href) {
                                            return (
                                                <Link key={link.id} href={link.href}>
                                                    <a className={cardClassName}>{content}</a>
                                                </Link>
                                            );
                                        }

                                        return <div key={link.id} className={cardClassName}>{content}</div>;
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
