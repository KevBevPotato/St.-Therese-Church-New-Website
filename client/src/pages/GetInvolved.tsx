// --- File: client/src/components/GetInvolved.tsx ---
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Building2,
    ChevronDown,
    ChevronUp,
    Info,
    MessageSquare,
    Phone,
    User,
    UserPlus,
    Heart,
    HandHeart,
    Shield,
    Flower,
} from 'lucide-react';
import { Link } from 'wouter';
import SponsorshipCard from '@/components/SponsorshipCard';
import { organizations } from '@/data/organizations';

type Category = 'all' | 'sponsor' | 'help' | 'join' | 'request';
type Tag =
    | 'Liturgy'
    | 'Diocesan'
    | 'Parish Events'
    | 'Parish Organizations';

type AudienceTag = 'Family' | 'Youth' | "Women's" | "Men's";

interface Role {
    name: string;
    needed: number;
    filled: number;
}

interface Opportunity {
    id: string;
    title: string;
    categories: Category[];
    tags: Tag[];
    audienceTags?: AudienceTag[];
    description: string;
    organization?: string;
    date?: string;
    contactName: string;
    contactPhone: string;
    goalAmount?: number;
    currentAmount?: number;
    roles?: Role[];
    constructionItems?: Array<{
        category: string;
        items: { name: string; cost: string }[];
        subtotal: string;
    }>;
    constructionTotal?: string;
    customPage?: 'supper-week' | 'altar-society' | 'knights-of-columbus';
    orgIcon?: 'shield' | 'flower';
}

function createInitialOpportunities(): Opportunity[] {
    return [
        {
            id: 'nursery',
            title: 'Nursery',
            categories: ['sponsor', 'help', 'join'],
            tags: ['Liturgy', 'Parish Events'],
            audienceTags: ['Family'],
            organization: 'Parish Council',
            date: 'Ongoing Project',
            contactName: 'Kelly Whartman',
            contactPhone: '(605) 867-5309',
            description:
                'We are looking to update the old side chapel into a nursery while retaining a space for mothers during Mass. Donations and volunteers are welcome.',
            goalAmount: 2500,
            currentAmount: 1200,
            constructionItems: [
                {
                    category: '2x4 Lumber & Construction Screws',
                    items: [{ name: '2x4 Lumber & Construction Screws', cost: '$79.30' }],
                    subtotal: '$79.30',
                },
                {
                    category: 'Sheetrock & Drywall Screws',
                    items: [{ name: 'Sheetrock & Drywall Screws', cost: '$131.50' }],
                    subtotal: '$131.50',
                },
                {
                    category: 'Mudding, Tape & Sanding Supplies',
                    items: [{ name: 'Mudding, Tape & Sanding Supplies', cost: '$31.50' }],
                    subtotal: '$31.50',
                },
            ],
            constructionTotal: '~$242.30',
        },
        {
            id: 'lector',
            title: 'Lector Sign-up',
            categories: ['help'],
            tags: ['Liturgy'],
            organization: 'Liturgy Ministry',
            date: 'Ongoing Ministry',
            contactName: 'Parish Office',
            contactPhone: '(605) 867-5309',
            description:
                'Proclaim the Scriptures and lead the Prayers of the Faithful during Mass. Training and scheduling support are provided for new lectors.',
        },
        {
            id: 'usher',
            title: 'Usher Sign-up',
            categories: ['help'],
            tags: ['Liturgy'],
            organization: 'Liturgy Ministry',
            date: 'Ongoing Ministry',
            contactName: 'Parish Office',
            contactPhone: '(605) 867-5309',
            description:
                'Ushers welcome parishioners, help people find seats in the pews—especially when the church is full—and assist with passing the offertory basket during Mass.',
        },
        {
            id: 'music',
            title: 'Music Ministry Sign-up',
            categories: ['help'],
            tags: ['Liturgy'],
            organization: 'Liturgy & Music Ministry',
            date: 'Ongoing Ministry',
            contactName: 'Parish Office',
            contactPhone: '(605) 867-5309',
            description:
                'Help lead the parish in sung prayer. We welcome people interested in joining the choir, serving as an instrumentalist, or becoming a cantor.',
        },
        {
            id: 'supper-week',
            title: 'Wednesday Night Supper',
            categories: ['sponsor', 'help'],
            tags: ['Parish Events'],
            audienceTags: ['Family'],
            organization: 'Parish Hospitality',
            date: 'Sept. 2, 2026 – May 19, 2027',
            contactName: 'Parish Office',
            contactPhone: '(605) 867-5309',
            description:
                'Sponsor a Wednesday supper for $200 per week, or sign up to help with grocery pick-up, food prep, serving, or cleanup. Every Wednesday during the school year.',
            customPage: 'supper-week',
        },
        {
            id: 'youth-ministry-mentors',
            title: 'Youth Ministry Mentors',
            categories: ['help'],
            tags: ['Parish Organizations'],
            audienceTags: ['Youth'],
            organization: 'Faith Formation',
            date: 'Starts Sept. 2026',
            contactName: 'Jane Doe',
            contactPhone: '(605) 867-5309',
            description: 'Guide high school students in their faith journey as a small-group leader.',
        },
        {
            id: 'annual-parish-picnic',
            title: 'Annual Parish Picnic',
            categories: ['help'],
            tags: ['Parish Events'],
            audienceTags: ['Family'],
            organization: 'Knights of Columbus',
            date: 'August 23, 2026',
            contactName: 'John Doe',
            contactPhone: '(605) 867-5309',
            description: 'Help host our largest community event of the year.',
        },
        {
            id: 'st-vincent-de-paul-food-drive',
            title: 'St. Vincent de Paul Food Drive',
            categories: ['join'],
            tags: ['Parish Organizations'],
            audienceTags: ['Family'],
            organization: 'St. Vincent de Paul',
            date: 'Every 1st Sunday',
            contactName: 'Jane Doe',
            contactPhone: '(605) 867-5309',
            description: 'Help sort and distribute food donations to local families in need.',
        },
        {
            id: 'altar-society',
            title: 'Altar Society',
            categories: ['join'],
            tags: ['Parish Organizations'],
            audienceTags: ["Women's"],
            organization: 'Altar Society',
            date: 'Quarterly',
            contactName: 'President',
            contactPhone: '(605) 867-5309',
            description:
                'The women of the parish care for the sacred linens, altar vessels, flowers, and decorations of our church. A beautiful way to serve the Lord through care of His house.',
            customPage: 'altar-society',
            orgIcon: 'flower',
        },
        {
            id: 'knights-of-columbus',
            title: 'Knights of Columbus',
            categories: ['join'],
            tags: ['Parish Organizations', 'Diocesan'],
            audienceTags: ["Men's"],
            organization: 'Knights of Columbus',
            date: '1st Thursday of each month',
            contactName: 'Grand Knight',
            contactPhone: '(605) 867-5309',
            description:
                "The Knights of Columbus is the world's largest Catholic fraternal service organization. Our local council serves Saint Therese parish through charitable works, faith formation support, and community fellowship.",
            customPage: 'knights-of-columbus',
            orgIcon: 'shield',
        },
        {
            id: 'catholic-daughters',
            title: 'Catholic Daughters of the Americas',
            categories: ['join'],
            tags: ['Diocesan'],
            audienceTags: ["Women's"],
            organization: 'Catholic Daughters',
            date: 'Monthly – 2nd Tuesday',
            contactName: 'Jane Doe',
            contactPhone: '(605) 867-5309',
            description: 'Join us for prayer, fellowship, and planning charitable works.',
        },
    ];
}

const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All Ways' },
    { id: 'sponsor', label: 'Sponsor' },
    { id: 'help', label: 'Help' },
    { id: 'join', label: 'Join' },
    { id: 'request', label: 'Request' },
];

const tags: Tag[] = [
    'Liturgy',
    'Parish Events',
    'Parish Organizations',
    'Diocesan',
];

const audienceTags: AudienceTag[] = [
    'Family',
    'Youth',
    "Women's",
    "Men's",
];

// Microsoft Forms URLs
const FORM_URLS = {
    contributeNursery: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UMU5XQlRRNEE4TVFXOFdQM0JBODFXWUhURy4u',
    signUpToHelp: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UQkFRRTFRUDIzWkcwT0JOODc2MzdaNlVERy4u',
    suggestion: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UMjBVRk5PNFk0S0lQS041NjdCNVo2QlkxNS4u',
    referral: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UNFFTRkFRVkNXWU1VMkc4S1JXVU0yUFFRQy4u',
};

export default function GetInvolved() {
    const [activeCategory, setActiveCategory] = useState<Category>('all');
    const [activeInterest, setActiveInterest] = useState<Tag | 'all'>('all');
    const [activeAudience, setActiveAudience] = useState<AudienceTag | 'all'>('all');
    const [opportunities] = useState<Opportunity[]>(createInitialOpportunities);

    const filteredOps = opportunities.filter((opportunity) => {
        const categoryMatch =
            activeCategory === 'all' ||
            (activeCategory !== 'request' && opportunity.categories.includes(activeCategory));
        const interestMatch =
            activeInterest === 'all' || opportunity.tags.includes(activeInterest);
        const audienceMatch =
            activeAudience === 'all' ||
            (opportunity.audienceTags?.includes(activeAudience) ?? false);
        return categoryMatch && interestMatch && audienceMatch;
    });

    const handleContribute = (opportunityId: string) => {
        if (opportunityId === 'nursery') {
            window.open(FORM_URLS.contributeNursery, '_blank', 'noopener,noreferrer');
        }
    };

    const handleSignUpToHelp = () => {
        window.open(FORM_URLS.signUpToHelp, '_blank', 'noopener,noreferrer');
    };

    const handleSuggestion = () => {
        window.open(FORM_URLS.suggestion, '_blank', 'noopener,noreferrer');
    };

    const handleRefer = () => {
        window.open(FORM_URLS.referral, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="pt-[69px]" />

            <section className="relative py-24 bg-[#fbfaf6] border-b border-primary/10 overflow-hidden min-h-[450px] flex items-center">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url("/HeroPagePhoto.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 70%',
                        WebkitMaskImage:
                            'linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0.75) 65%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 1) 100%)',
                        maskImage:
                            'linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0.75) 65%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 1) 100%)',
                    }}
                />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6 drop-shadow-sm">
                            Get <span className="text-accent italic">Involved.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
                            Find your place in our parish family. Filter by how you want to serve or the areas that interest you most.
                        </p>
                    </div>
                </div>
            </section>

            <main className="flex-grow py-16 md:py-24">
                <div className="container mx-auto px-4">
                    {/* ===== TIER 1: How You'll Serve ===== */}
                    <div className="mb-10">
                        <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-4">
                            How Would You Like to Serve
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all border-2 ${
                                        activeCategory === category.id
                                            ? 'bg-primary border-primary text-white shadow-lg'
                                            : 'bg-white border-primary/10 text-primary hover:border-primary/30'
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ===== TIER 2: By Interest ===== */}
                    <div className="mb-8">
                        <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-4">
                            By Interest
                        </p>
                        <div className="border-b border-primary/12 max-w-6xl mx-auto overflow-x-auto no-scrollbar">
                            <div className="flex justify-center min-w-max px-4 gap-x-6">
                                <button
                                    onClick={() => setActiveInterest('all')}
                                    className={`border-b-2 px-2 py-3 text-[9px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                                        activeInterest === 'all'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:border-primary/35 hover:text-primary'
                                    }`}
                                >
                                    All Interests
                                </button>
                                {tags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setActiveInterest(tag)}
                                        className={`border-b-2 px-2 py-3 text-[9px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                                            activeInterest === tag
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:border-primary/35 hover:text-primary'
                                    }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ===== TIER 3: By Audience (Age & Gender) ===== */}
                    <div className="mb-16">
                        <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-4">
                            By Audience
                        </p>
                        <div className="border-b border-primary/12 max-w-6xl mx-auto overflow-x-auto no-scrollbar">
                            <div className="flex justify-center min-w-max px-4 gap-x-6">
                                <button
                                    onClick={() => setActiveAudience('all')}
                                    className={`border-b-2 px-2 py-3 text-[9px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                                        activeAudience === 'all'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:border-primary/35 hover:text-primary'
                                    }`}
                                >
                                    All Audiences
                                </button>
                                {audienceTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setActiveAudience(tag)}
                                        className={`border-b-2 px-2 py-3 text-[9px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                                            activeAudience === tag
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:border-primary/35 hover:text-primary'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {activeCategory !== 'request' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredOps.map((opportunity) => {
                                // Custom landing pages (full-page components)
                                if (opportunity.customPage === 'supper-week') {
                                    return (
                                        <SupperWeekCard
                                            key={opportunity.id}
                                            op={opportunity}
                                            onSignUpToHelp={handleSignUpToHelp}
                                            onSuggestion={handleSuggestion}
                                            onRefer={handleRefer}
                                        />
                                    );
                                }

                                if (opportunity.customPage === 'altar-society' || opportunity.customPage === 'knights-of-columbus') {
                                    return (
                                        <OrgCard
                                            key={opportunity.id}
                                            op={opportunity}
                                            onSuggestion={handleSuggestion}
                                            onRefer={handleRefer}
                                        />
                                    );
                                }


                                if (opportunity.categories.includes('sponsor')) {
                                    return (
                                        <SponsorshipCard
                                            key={opportunity.id}
                                            project={{
                                                id: opportunity.id,
                                                title: opportunity.title,
                                                description: opportunity.description,
                                                organization: opportunity.organization,
                                                contactName: opportunity.contactName,
                                                contactPhone: opportunity.contactPhone,
                                                items: [],
                                                constructionItems: opportunity.constructionItems,
                                                constructionTotal: opportunity.constructionTotal,
                                            }}
                                            onContribute={() => handleContribute(opportunity.id)}
                                            onSignUpToHelp={handleSignUpToHelp}
                                            onRefer={handleRefer}
                                            onSuggestion={handleSuggestion}
                                        />
                                    );
                                }

                                return (
                                    <OpportunityCard
                                        key={opportunity.id}
                                        op={opportunity}
                                        onSignUpToHelp={handleSignUpToHelp}
                                        onSuggestion={handleSuggestion}
                                        onRefer={handleRefer}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {filteredOps.length === 0 && activeCategory !== 'request' && (
                        <div className="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <Info className="size-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-serif font-bold text-primary mb-2">No matching opportunities</h3>
                            <p className="text-muted-foreground">Try adjusting your filters or share a new idea below.</p>
                            <Button
                                variant="link"
                                onClick={() => setActiveCategory('request')}
                                className="mt-4 text-accent font-bold"
                            >
                                Submit a Suggestion
                            </Button>
                        </div>
                    )}

                    {activeCategory === 'request' && (
                        <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] border-2 border-primary/5 shadow-xl">
                            <h2 className="font-serif text-3xl font-bold text-primary mb-4 text-center">
                                Suggest an Event or Request Help
                            </h2>
                            <p className="text-muted-foreground text-center mb-10">
                                Have an idea for the parish or need assistance with a project? Share it with us, and our team will follow up.
                            </p>
                            <div className="text-center">
                                <Button
                                    onClick={handleSuggestion}
                                    className="bg-accent hover:bg-accent/90 py-6 px-12 font-bold uppercase tracking-widest"
                                >
                                    Submit a Suggestion
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

function OpportunityCard({
    op,
    onSignUpToHelp,
    onSuggestion,
    onRefer,
}: {
    op: Opportunity;
    onSignUpToHelp: () => void;
    onSuggestion: () => void;
    onRefer: () => void;
}) {
    return (
        <Card className="group flex flex-col border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-xl">
            <div className="p-8 pb-4 flex-grow">
                <div className="flex justify-between items-start mb-4 gap-3">
                    <div className="flex flex-wrap gap-1">
                        {op.tags.map((tag) => (
                            <span key={tag} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/10">
                                {tag}
                            </span>
                        ))}
                    </div>
                    {op.organization && (
                        <span className="shrink-0 flex items-center gap-1 text-[9px] font-bold text-primary/40 uppercase tracking-widest">
                            <Building2 size={10} /> {op.organization}
                        </span>
                    )}
                </div>

                <Link href={`/get-involved/${op.id}`}>
                    <a className="block mb-3 group/title">
                        <h3 className="font-serif text-2xl font-bold text-primary leading-tight group-hover/title:text-accent transition-colors cursor-pointer">
                            {op.title}
                        </h3>
                    </a>
                </Link>

                {op.date && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary/60 uppercase tracking-tight mb-4">
                        <Calendar size={12} className="text-accent" /> {op.date}
                    </div>
                )}
                <p className="text-muted-foreground leading-relaxed text-sm mb-6">{op.description}</p>

                <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-primary">{op.contactName}</p>
                                <p className="text-[10px] text-muted-foreground">{op.contactPhone}</p>
                            </div>
                        </div>
                        <a href={`tel:${op.contactPhone.replace(/\D/g, '')}`} className="p-2 text-primary/40 hover:text-accent transition-colors" aria-label={`Call ${op.contactName}`}>
                            <Phone size={14} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="p-8 pt-2 space-y-3">
                <Button
                    onClick={onSignUpToHelp}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.2em] text-[10px] py-6 shadow-lg shadow-primary/10"
                >
                    Sign Up to Help
                </Button>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        onClick={onSuggestion}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest py-4 border-primary/10 hover:border-primary/30"
                    >
                        <MessageSquare size={12} /> Suggestion
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onRefer}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest py-4 border-primary/10 hover:border-primary/30"
                    >
                        <UserPlus size={12} /> Refer
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function SupperWeekCard({
    op,
    onSignUpToHelp,
    onSuggestion,
    onRefer,
}: {
    op: Opportunity;
    onSignUpToHelp: () => void;
    onSuggestion: () => void;
    onRefer: () => void;
}) {
    return (
        <Card className="group flex flex-col border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-xl">
            <div className="p-8 pb-4 flex-grow">
                <div className="flex justify-between items-start mb-4 gap-3">
                    <div className="flex flex-wrap gap-1">
                        {op.tags.map((tag) => (
                            <span key={tag} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/10">
                                {tag}
                            </span>
                        ))}
                    </div>
                    {op.organization && (
                        <span className="shrink-0 flex items-center gap-1 text-[9px] font-bold text-primary/40 uppercase tracking-widest">
                            <Building2 size={10} /> {op.organization}
                        </span>
                    )}
                </div>

                <Link href="/get-involved/supper-week">
                    <a className="block mb-3 group/title">
                        <h3 className="font-serif text-2xl font-bold text-primary leading-tight group-hover/title:text-accent transition-colors cursor-pointer">
                            {op.title}
                        </h3>
                    </a>
                </Link>

                {op.date && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary/60 uppercase tracking-tight mb-4">
                        <Calendar size={12} className="text-accent" /> {op.date}
                    </div>
                )}
                <p className="text-muted-foreground leading-relaxed text-sm mb-6">{op.description}</p>

                <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-primary">{op.contactName}</p>
                                <p className="text-[10px] text-muted-foreground">{op.contactPhone}</p>
                            </div>
                        </div>
                        <a href={`tel:${op.contactPhone.replace(/\D/g, '')}`} className="p-2 text-primary/40 hover:text-accent transition-colors" aria-label={`Call ${op.contactName}`}>
                            <Phone size={14} />
                        </a>
                    </div>
                </div>

                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-primary leading-relaxed">
                    <span className="font-bold">View the full schedule →</span> See all 32 weeks with monthly breakdowns, sponsor a specific date, or sign up for volunteer roles.
                </div>
            </div>

            <div className="p-8 pt-2 space-y-3">
                <Link href="/get-involved/supper-week">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-[0.2em] text-[10px] py-6 shadow-lg shadow-accent/20">
                        <Heart size={14} className="mr-2" /> View Supper Schedule
                    </Button>
                </Link>
                <Button
                    onClick={onSignUpToHelp}
                    variant="outline"
                    className="w-full text-primary font-bold uppercase tracking-[0.1em] text-[9px] py-4 border-primary/20 hover:border-primary/40 bg-white hover:bg-white"
                >
                    Sign Up to Volunteer
                </Button>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        onClick={onSuggestion}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest py-4 border-primary/10 hover:border-primary/30"
                    >
                        <MessageSquare size={12} /> Suggestion
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onRefer}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest py-4 border-primary/10 hover:border-primary/30"
                    >
                        <UserPlus size={12} /> Refer
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function OrgCard({
    op,
    onSuggestion,
    onRefer,
}: {
    op: Opportunity;
    onSuggestion: () => void;
    onRefer: () => void;
}) {
    const org = organizations.find(o => o.id === op.customPage);

    // External signup URLs per organization
    const EXTERNAL_SIGNUP_URLS: Record<string, string> = {
        'knights-of-columbus': 'https://www.kofc.org/get-involved/join-kofc/',
        'altar-society': FORM_URLS.signUpToHelp, // fallback until they have their own
    };

    const signupUrl = EXTERNAL_SIGNUP_URLS[op.id] || FORM_URLS.signUpToHelp;

    return (
        <Card className="group flex flex-col border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-xl">
            <div className="p-8 pb-4 flex-grow">
                <div className="flex justify-between items-start mb-4 gap-3">
                    <div className="flex flex-wrap gap-1">
                        {op.tags.map((tag) => (
                            <span key={tag} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/10">
                                {tag}
                            </span>
                        ))}
                    </div>
                    {op.organization && (
                        <span className="shrink-0 flex items-center gap-1 text-[9px] font-bold text-primary/40 uppercase tracking-widest">
                            {op.orgIcon === 'shield' ? <Shield size={10} /> : op.orgIcon === 'flower' ? <Flower size={10} /> : <Building2 size={10} />} {op.organization}
                        </span>
                    )}
                </div>

                <Link href={`/get-involved/${op.id}`}>
                    <a className="block mb-3 group/title">
                        <h3 className="font-serif text-2xl font-bold text-primary leading-tight group-hover/title:text-accent transition-colors cursor-pointer">
                            {op.title}
                        </h3>
                    </a>
                </Link>

                {op.date && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary/60 uppercase tracking-tight mb-4">
                        <Calendar size={12} className="text-accent" /> {op.date}
                    </div>
                )}
                <p className="text-muted-foreground leading-relaxed text-sm mb-6">{op.description}</p>

                <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-primary">{op.contactName}</p>
                                <p className="text-[10px] text-muted-foreground">{op.contactPhone}</p>
                            </div>
                        </div>
                        <a href={`tel:${op.contactPhone.replace(/\D/g, '')}`} className="p-2 text-primary/40 hover:text-accent transition-colors" aria-label={`Call ${op.contactName}`}>
                            <Phone size={14} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="p-8 pt-2 space-y-3">
                <Button
                    onClick={() => window.open(signupUrl, '_blank', 'noopener,noreferrer')}
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-[0.2em] text-[10px] py-6 shadow-lg shadow-accent/20"
                >
                    {op.orgIcon === 'shield' ? <Shield size={14} className="mr-2" /> : <Flower size={14} className="mr-2" />}
                    Join / Sign Up
                </Button>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        onClick={onSuggestion}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest py-4 border-primary/10 hover:border-primary/30"
                    >
                        <MessageSquare size={12} /> Suggestion
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onRefer}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest py-4 border-primary/10 hover:border-primary/30"
                    >
                        <UserPlus size={12} /> Refer
                    </Button>
                </div>
            </div>
        </Card>
    );
}


