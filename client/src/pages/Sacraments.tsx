import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    Droplet,
    Wine,
    Heart,
    Cross,
    Users,
    Phone,
    Mail,
} from 'lucide-react';

interface Sacrament {
    id: string;
    name: string;
    tagline: string;
    description: string;
    details: string[];
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    preparation: string;
    icon: React.ReactNode;
}

const sacraments: Sacrament[] = [
    {
        id: 'marriage-preparation',
        name: 'Marriage Preparation',
        tagline: 'Preparing for the Sacrament of Matrimony',
        description: 'Arrangements for the celebration of the Sacrament of Matrimony are to begin at least 6 months prior to the desired wedding date.',
        details: [
            'Contact the parish at least 6 months before your desired date',
            'Pre-Cana or Engaged Encounter preparation is required',
            'Couples will meet with the priest for guidance and formation',
        ],
        contactName: 'Fr. Mark McCormick',
        contactPhone: '(605) 342-1556 Ext. 4',
        contactEmail: 'mark.mccormick@strcstaff.org',
        preparation: 'Begin arrangements at least 6 months prior',
        icon: <Cross size={20} />,
    },
    {
        id: 'baptism-class',
        name: 'Baptism Class',
        tagline: 'Welcoming New Members into the Faith',
        description: 'Parents and godparents prepare for the baptism of their child through a one-time preparation class.',
        details: [
            'Call the parish office to register for the next class',
            'Baptisms are celebrated during Sunday Mass or at a private ceremony',
            'At least one godparent must be a confirmed, practicing Catholic',
        ],
        contactName: 'Parish Office',
        contactPhone: '(605) 342-1556',
        contactEmail: '',
        preparation: 'Pre-baptismal class required for first-time parents',
        icon: <Droplet size={20} />,
    },
    {
        id: 'first-eucharist',
        name: 'First Eucharist & First Reconciliation',
        tagline: 'First Steps in the Sacramental Life',
        description: 'First Holy Communion and First Reconciliation are typically received in the 2nd grade, but may be received at any age.',
        details: [
            'Typically received in the 2nd grade',
            'May be received at any age — contact us for adult preparation',
            'Religious education classes begin in late September and go through late April',
        ],
        contactName: 'Fr. Mark McCormick / Parish Office',
        contactPhone: '(605) 342-1556',
        contactEmail: 'mark.mccormick@strcstaff.org',
        preparation: 'Religious education classes (Sept – late April)',
        icon: <Wine size={20} />,
    },
    {
        id: 'confirmation',
        name: 'Confirmation',
        tagline: 'Sealed with the Gift of the Holy Spirit',
        description: 'Confirmation is typically received in the 6th–7th grade, but may be received at any age. Those who have not been confirmed past 7th grade are encouraged to sign up for Confirmation preparation.',
        details: [
            'Typically received in the 6th–7th grade through our Faith Formation program',
            'May be received at any age — adult preparation is available',
            'If out of high school, it is usually through OCIA',
            'Those who have not been confirmed past 7th grade should sign up for Confirmation preparation',
        ],
        contactName: 'Bobby Myers / Parish Office',
        contactPhone: '(605) 342-1556',
        contactEmail: 'bobby.myers@strcstaff.org',
        preparation: 'Two-year preparation process for teens',
        icon: <Heart size={20} />,
    },
    {
        id: 'ocia',
        name: 'OCIA (Becoming Catholic)',
        tagline: 'The Order of Christian Initiation of Adults',
        description: 'OCIA (otherwise known as RCIA) is the process by which adults are welcomed into the Catholic Church. Classes begin in September and continue through the Easter Vigil.',
        details: [
            'Classes begin in September and continue through the Easter Vigil',
            'Open to anyone exploring the Catholic faith',
            'A journey of formation, prayer, and discernment',
        ],
        contactName: 'Fr. Mark McCormick / Parish Office / Anthony Flores',
        contactPhone: '(605) 484-3190',
        contactEmail: 'mark.mccormick@strcstaff.org',
        preparation: 'Year-long formation process (Sept – Easter Vigil)',
        icon: <BookOpen size={20} />,
    },
];

export default function Sacraments() {
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
                            <BookOpen className="size-4" aria-hidden="true" /> Sacramental Preparation
                        </p>
                        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                            Sacraments at St. Thérèse.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            Information on preparation for the sacraments of Marriage, Baptism, First Eucharist, Reconciliation, Confirmation, and OCIA (becoming Catholic). Contact the parish office or the person listed for each sacrament to begin.
                        </p>
                    </div>
                    <aside className="border-l-2 border-[#b8954f] pl-6 md:mb-1">
                        <p className="font-serif text-2xl italic leading-snug text-primary">
                            "The seven sacraments touch all the stages and all the important moments of Christian life."
                        </p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f]">
                            Catechism of the Catholic Church, §1210
                        </p>
                    </aside>
                </div>
            </section>

            {/* Sacraments Grid */}
            <section className="py-16 md:py-20 bg-secondary/20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sacraments.map((sacrament) => (
                            <Card
                                key={sacrament.id}
                                id={sacrament.id}
                                className="group scroll-mt-[calc(var(--header-height)+1rem)] overflow-hidden rounded-3xl border-2 border-primary/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl p-8"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        {sacrament.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent mb-1">
                                            {sacrament.tagline}
                                        </p>
                                        <h2 className="font-serif text-2xl font-bold text-primary leading-tight">
                                            {sacrament.name}
                                        </h2>
                                    </div>
                                </div>

                                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
                                    {sacrament.description}
                                </p>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">
                                        Details
                                    </p>
                                    <ul className="space-y-1.5">
                                        {sacrament.details.map((detail, i) => (
                                            <li key={i} className="text-xs text-muted-foreground flex gap-2">
                                                <span className="text-accent mt-0.5">•</span>
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                        Have questions about a sacrament?
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        Our priests and staff are always happy to discuss any of the sacraments with you. Reach out and we'll walk with you on the journey.
                    </p>
                    <a
                        href="tel:6053421556"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg transition-all hover:scale-[1.02]"
                    >
                        <Phone size={14} /> Call the Parish Office
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
}
