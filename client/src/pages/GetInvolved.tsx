import { useState, type FormEvent } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Building2,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Info,
    MessageSquare,
    Phone,
    User,
    UserPlus,
} from 'lucide-react';
import { Link } from 'wouter';
import SponsorshipCard from '@/components/SponsorshipCard';
import EngagementModal from '@/components/EngagementModal';
import {
    sponsorshipProjects,
    type SponsorshipProject,
} from '@/data/sponsorship-projects';
import {
    getEngagementById,
    type EngagementConfig,
} from '@/data/engagements';

type Category = 'all' | 'sponsor' | 'help' | 'join' | 'request';
type Tag =
    | 'Liturgy'
    | 'Liturgy/Music'
    | 'Family'
    | 'Youth'
    | "Women's"
    | "Men's"
    | 'Diocesan'
    | 'Parish'
    | 'Rapid City Local Events';

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
}

const mealRoleRequirements = [
    { name: 'Grocery Pick-up', needed: 1 },
    { name: 'Food Prep', needed: 3 },
    { name: 'Food Server', needed: 3 },
    { name: 'Clean-up Crew', needed: 3 },
];

function createInitialOpportunities(): Opportunity[] {
    return [
        {
            id: 'nursery',
            title: 'Nursery',
            categories: ['sponsor', 'help', 'join'],
            tags: ['Liturgy', 'Parish', 'Family'],
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
            tags: ['Liturgy/Music'],
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
            tags: ['Parish', 'Family'],
            organization: 'Parish Hospitality',
            date: 'Sept. 2, 2026 – May 19, 2027',
            contactName: 'Parish Office',
            contactPhone: '(605) 867-5309',
            description:
                'Sponsor a Wednesday supper for $200 per week, or sign up to help with grocery pick-up, food prep, serving, or cleanup. Every Wednesday during the school year.',
        },
        {
            id: 'youth-ministry-mentors',
            title: 'Youth Ministry Mentors',
            categories: ['help'],
            tags: ['Youth', 'Parish'],
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
            tags: ['Family', 'Parish'],
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
            tags: ['Parish', 'Rapid City Local Events'],
            organization: 'St. Vincent de Paul',
            date: 'Every 1st Sunday',
            contactName: 'Jane Doe',
            contactPhone: '(605) 867-5309',
            description: 'Help sort and distribute food donations to local families in need.',
        },
        {
            id: 'catholic-daughters',
            title: 'Catholic Daughters of the Americas',
            categories: ['join'],
            tags: ["Women's", 'Diocesan'],
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
    'Liturgy/Music',
    'Family',
    'Youth',
    "Women's",
    "Men's",
    'Diocesan',
    'Parish',
    'Rapid City Local Events',
];

function opportunityToSponsorshipProject(op: Opportunity): SponsorshipProject {
    return {
        id: op.id,
        title: op.title,
        description: op.description,
        organization: op.organization,
        contactName: op.contactName,
        contactPhone: op.contactPhone,
        items: [],   // Empty for fallbacks; real items come from engagements.ts
        constructionItems: op.constructionItems,
        constructionTotal: op.constructionTotal,
    };
}

interface ModalContext {
    projectId?: string;
    projectTitle?: string;
}

export default function GetInvolved() {
    const [activeCategory, setActiveCategory] = useState<Category>('all');
    const [activeTag, setActiveTag] = useState<Tag | 'all'>('all');
    const [opportunities] = useState<Opportunity[]>(createInitialOpportunities);

    // Engagement modal state
    const [selectedEngagement, setSelectedEngagement] = useState<EngagementConfig | null>(null);
    const [modalContext, setModalContext] = useState<ModalContext | null>(null);

    // Standalone Suggestion modal trigger (from header / "request" category)
    const [isGenericSuggestionOpen, setIsGenericSuggestionOpen] = useState(false);

    // Legacy "interested" form state — for opportunities without a signup config
    const [isLegacyFormOpen, setIsLegacyFormOpen] = useState(false);
    const [selectedOp, setSelectedOp] = useState<Opportunity | null>(null);

    const filteredOps = opportunities.filter((opportunity) => {
        const categoryMatch =
            activeCategory === 'all' ||
            (activeCategory !== 'request' && opportunity.categories.includes(activeCategory));
        const tagMatch = activeTag === 'all' || opportunity.tags.includes(activeTag);
        return categoryMatch && tagMatch;
    });

    const getSponsorshipProject = (op: Opportunity): SponsorshipProject => {
        const fromData = sponsorshipProjects.find((p) => p.id === op.id);
        return fromData ?? opportunityToSponsorshipProject(op);
    };

    /**
     * Sign Up button → opens the appropriate Signup engagement modal.
     * Looks up `signup-{opportunity.id}` engagement from config.
     * Falls back to legacy OpportunityCard-modal behavior if no config exists.
     */
    const openSignupEngagement = (opportunityId: string) => {
        const op = opportunities.find(o => o.id === opportunityId);
        if (!op) return;

        const engagement = getEngagementById(`signup-${opportunityId}`);
        if (engagement) {
            setModalContext({ projectId: op.id, projectTitle: op.title });
            setSelectedEngagement(engagement);
            return;
        }

        // Fallback for opportunities without a signup config (e.g., join category)
        setSelectedOp(op);
        setIsLegacyFormOpen(true);
    };

    /**
     * Suggestion button → opens the global Suggestion modal,
     * prefilled with the opportunity context if triggered from a card.
     */
    const openSuggestionModal = (opportunityId?: string) => {
        const suggestion = getEngagementById('suggestion');
        if (!suggestion) return;

        const op = opportunityId ? opportunities.find(o => o.id === opportunityId) : undefined;
        setModalContext({
            projectId: op?.id,
            projectTitle: op?.title,
        });
        setSelectedEngagement(suggestion);
        setIsGenericSuggestionOpen(true);
    };

    /**
     * Refer-a-Friend button → opens the Refer engagement modal,
     * prefilled with the opportunity name.
     */
    const openReferModal = (opportunityId: string) => {
        const engagement = getEngagementById('referral');
        const op = opportunities.find(o => o.id === opportunityId);
        if (engagement) {
            setModalContext({
                projectId: op?.id,
                projectTitle: op?.title,
            });
            setSelectedEngagement(engagement);
        }
    };

    const closeEngagementModal = () => {
        setSelectedEngagement(null);
        setModalContext(null);
        setIsGenericSuggestionOpen(false);
    };

    const handleLegacySubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.setTimeout(() => {
            alert('Thank you! Your submission has been received. It will be emailed to kbaltzer@diorc.org for review.');
            setIsLegacyFormOpen(false);
            setSelectedOp(null);
        }, 500);
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
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
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

                    <div className="mb-16 border-b border-primary/12 max-w-6xl mx-auto overflow-x-auto no-scrollbar">
                        <div className="flex justify-center min-w-max px-4 gap-x-6">
                            <button
                                onClick={() => setActiveTag('all')}
                                className={`border-b-2 px-2 py-3 text-[9px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                                    activeTag === 'all'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:border-primary/35 hover:text-primary'
                                }`}
                            >
                                All Interests
                            </button>
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(tag)}
                                    className={`border-b-2 px-2 py-3 text-[9px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                                        activeTag === tag
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:border-primary/35 hover:text-primary'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeCategory !== 'request' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredOps.map((opportunity) => {
                                if (opportunity.categories.includes('sponsor')) {
                                    return (
                                        <SponsorshipCard
                                            key={opportunity.id}
                                            project={getSponsorshipProject(opportunity)}
                                            onSignUpVolunteer={(id) => openSignupEngagement(id)}
                                            onRefer={(id) => openReferModal(id)}
                                            onSuggestion={(id) => openSuggestionModal(id)}
                                        />
                                    );
                                }

                                return (
                                    <OpportunityCard
                                        key={opportunity.id}
                                        op={opportunity}
                                        onSignUpVolunteer={(id) => openSignupEngagement(id)}
                                        onRefer={(id) => openReferModal(id)}
                                        onSuggestion={(id) => openSuggestionModal(id)}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {filteredOps.length === 0 && activeCategory !== 'request' && (
                        <div className="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <Info className="size-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-serif font-bold text-primary mb-2">No matching opportunities</h3>
                            <p className="text-muted-foreground">Try adjusting your filters or suggest a new event below.</p>
                            <Button
                                variant="link"
                                onClick={() => setActiveCategory('request')}
                                className="mt-4 text-accent font-bold"
                            >
                                Make a Request
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
                                    onClick={() => openSuggestionModal()}
                                    className="bg-accent hover:bg-accent/90 py-6 px-12 font-bold uppercase tracking-widest"
                                >
                                    Submit a Suggestion
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Single EngagementModal used for ALL flows */}
            {selectedEngagement && (
                <EngagementModal
                    isOpen={!!selectedEngagement}
                    onClose={closeEngagementModal}
                    engagement={selectedEngagement}
                    contextProjectId={modalContext?.projectId}
                    contextProjectTitle={modalContext?.projectTitle}
                />
            )}

            {/* Legacy fallback form for opportunities without a signup config */}
            {isLegacyFormOpen && selectedOp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-primary p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="font-serif text-2xl font-bold">I'm Interested</h3>
                                <p className="text-xs text-white/70 uppercase tracking-widest mt-1">{selectedOp.title}</p>
                            </div>
                            <button
                                onClick={() => setIsLegacyFormOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full text-sm"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleLegacySubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" required className="px-4 py-3 rounded-xl border-2 border-gray-100" placeholder="First Name" />
                                <input type="text" required className="px-4 py-3 rounded-xl border-2 border-gray-100" placeholder="Last Name" />
                            </div>
                            <input type="email" required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100" placeholder="Email Address" />
                            <input type="tel" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100" placeholder="Phone Number" />
                            <textarea
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 h-32"
                                placeholder="Tell us what interests you..."
                            />
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-6 font-bold uppercase tracking-widest">
                                Submit
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

function OpportunityCard({
    op,
    onSignUpVolunteer,
    onRefer,
    onSuggestion,
}: {
    op: Opportunity;
    onSignUpVolunteer: (opId: string) => void;
    onRefer: (opId: string) => void;
    onSuggestion: (opId: string) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isSponsor = op.categories.includes('sponsor');
    const isHelp = op.categories.includes('help');

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

                {isHelp && op.roles && (
                    <div className="space-y-4 mb-2">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-primary/60">
                            <span>Volunteers</span>
                            <span>
                                {op.roles.reduce((sum, r) => sum + r.filled, 0)} of{' '}
                                {op.roles.reduce((sum, r) => sum + r.needed, 0)} filled
                            </span>
                        </div>
                    </div>
                )}

                {isSponsor && op.constructionItems && op.constructionItems.length > 0 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                    >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {isExpanded ? 'Hide Details' : 'View Construction Materials'}
                    </button>
                )}

                {isExpanded && isSponsor && op.constructionItems && (
                    <div className="pt-4 space-y-2 animate-in slide-in-from-top-2 duration-300 border-t border-gray-100">
                        {op.constructionItems.map((category) => (
                            <div key={category.category} className="flex items-center justify-between text-[10px] py-1">
                                <span className="font-semibold text-primary">{category.category}</span>
                                <span className="font-bold text-primary/60">{category.subtotal}</span>
                            </div>
                        ))}
                        {op.constructionTotal && (
                            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                                <span className="font-bold text-primary">Estimated Total</span>
                                <span className="font-bold text-accent">{op.constructionTotal}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-8 pt-2 space-y-3">
                <Button
                    onClick={() => onSignUpVolunteer(op.id)}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.2em] text-[10px] py-6 shadow-lg shadow-primary/10"
                >
                    Sign Up
                </Button>
                <Button
                    onClick={() => onSignUpVolunteer(op.id)}
                    variant="outline"
                    className="w-full text-primary font-bold uppercase tracking-[0.1em] text-[9px] py-4 border-primary/20 hover:border-primary/40 bg-white hover:bg-white"
                >
                    I&apos;m Interested
                </Button>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onSuggestion(op.id)}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest py-4 border-primary/10 hover:border-primary/30"
                    >
                        <MessageSquare size={12} /> Suggestion
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onRefer(op.id)}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest py-4 border-primary/10 hover:border-primary/30"
                    >
                        <UserPlus size={12} /> Refer
                    </Button>
                </div>
            </div>
        </Card>
    );
}