import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    Droplet,
    Flame,
    Wine,
    Heart,
    HandHeart,
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
        id: 'baptism',
        name: 'Baptism',
        tagline: 'Entry into the Family of God',
        description: 'Through Baptism, we are freed from sin, reborn as children of God, and welcomed into the Catholic Church. It is the first of the three Sacraments of Initiation.',
        details: [
            'Celebrated during any Sunday Mass or at a private ceremony',
            'Parents and godparents attend a one-time preparation class',
            'At least one godparent must be a confirmed, practicing Catholic',
        ],
        contactName: 'Parish Office',
        contactPhone: '(605) 342-1556',
        contactEmail: 'sttherese@diorc.org',
        preparation: 'Pre-baptismal class required for first-time parents',
        icon: <Droplet size={20} />,
    },
    {
        id: 'confirmation',
        name: 'Confirmation',
        tagline: 'Sealed with the Gift of the Holy Spirit',
        description: 'Confirmation perfects Baptismal grace and strengthens the bond between the confirmed and the Church. It is one of the three Sacraments of Initiation.',
        details: [
            'Typically received in the teen years through our Faith Formation program',
            'Adult preparation is available through the OCIA process',
            'The Bishop is the ordinary minister of this sacrament',
        ],
        contactName: 'Bobby Myers',
        contactPhone: '(605) 342-1556',
        contactEmail: 'bmyers@diorc.org',
        preparation: 'Two-year preparation process for teens',
        icon: <Flame size={20} />,
    },
    {
        id: 'eucharist',
        name: 'Eucharist',
        tagline: 'The Source and Summit of Our Faith',
        description: 'The Eucharist is the Body and Blood of Jesus Christ, the greatest gift we receive this side of Heaven. First Holy Communion is a milestone moment in the life of every Catholic.',
        details: [
            'First Communion is typically received in the 2nd grade',
            'Children must complete two years of Faith Formation prior',
            'The Most Holy Eucharist is received at every Mass',
        ],
        contactName: 'Bobby Myers',
        contactPhone: '(605) 342-1556',
        contactEmail: 'bmyers@diorc.org',
        preparation: 'Two-year Faith Formation prerequisite',
        icon: <Wine size={20} />,
    },
    {
        id: 'reconciliation',
        name: 'Reconciliation',
        tagline: 'The Healing Sacrament of Confession',
        description: 'Through Confession, we receive God\'s infinite mercy and are restored to grace after sin. This sacrament is offered regularly and is also available by appointment.',
        details: [
            'Saturday 3:00 – 4:00 PM',
            'Sunday 8:00 AM & 4:30 PM',
            'Or by appointment any time',
            'First Reconciliation typically received in the 2nd grade',
        ],
        contactName: 'Parish Office',
        contactPhone: '(605) 342-1556',
        contactEmail: 'sttherese@diorc.org',
        preparation: 'First Reconciliation preparation included in 2nd grade year',
        icon: <Heart size={20} />,
    },
    {
        id: 'anointing',
        name: 'Anointing of the Sick',
        tagline: 'Strength and Peace in Times of Illness',
        description: 'This sacrament brings the healing power of Christ to those who are sick, elderly, or preparing for surgery. It can be received more than once.',
        details: [
            'Available after any Mass by request',
            'Please notify the parish office before hospitalization',
            'Communal celebration typically held each fall',
        ],
        contactName: 'Fr. Mark McCormick',
        contactPhone: '(605) 342-1556',
        contactEmail: 'mmccormick@diorc.org',
        preparation: 'No formal preparation required',
        icon: <HandHeart size={20} />,
    },
    {
        id: 'holy-orders',
        name: 'Holy Orders',
        tagline: 'A Vocation of Service to the Church',
        description: 'Holy Orders is the sacrament by which bishops, priests, and deacons are ordained to serve the People of God. If you feel called to priesthood or diaconate, we would love to walk with you in discernment.',
        details: [
            'Diocesan Vocations Office: gods-call.com',
            'Speak with a priest or deacon at any time about a possible call',
            'St. Therese has hosted several discernment events',
        ],
        contactName: 'Fr. Mark McCormick',
        contactPhone: '(605) 342-1556',
        contactEmail: 'mmccormick@diorc.org',
        preparation: 'Multiple years of seminary formation',
        icon: <Cross size={20} />,
    },
    {
        id: 'matrimony',
        name: 'Matrimony',
        tagline: 'A Sacramental Bond for Life',
        description: 'Matrimony is the union of a man and a woman in a lifelong covenant of love, witnessed by the Church and blessed by God. Couples are encouraged to prepare well.',
        details: [
            'Contact the parish at least 6–9 months before your desired date',
            'Pre-Cana retreat required (Becoming One retreat offered locally)',
            'Engaged Encounter weekend also satisfies preparation',
        ],
        contactName: 'Parish Office',
        contactPhone: '(605) 342-1556',
        contactEmail: 'sttherese@diorc.org',
        preparation: '6–9 month preparation including Pre-Cana',
        icon: <Users size={20} />,
    },
];

export default function Sacraments() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="pt-[69px]" />

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
                <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
                <div className="container relative grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-end mx-auto px-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                            <BookOpen className="size-4" aria-hidden="true" /> Seven Sacred Gifts
                        </p>
                        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                            The Seven Sacraments.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            The seven sacraments are the ordinary ways the Lord Jesus Christ dispenses the grace of the Holy Spirit to his people. Each one meets us at a particular moment of life to give us what we need most.
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
                                className="group overflow-hidden rounded-3xl border-2 border-primary/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl p-8"
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

                                <div className="mb-5">
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

                                <div className="mb-5 p-4 rounded-2xl bg-accent/5 border border-accent/15">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80 mb-1">
                                        Preparation
                                    </p>
                                    <p className="text-xs text-primary font-medium">
                                        {sacrament.preparation}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-primary/10 flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Users size={12} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-primary">{sacrament.contactName}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`tel:${sacrament.contactPhone.replace(/\D/g, '')}`}
                                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                                    >
                                        <Phone size={12} /> {sacrament.contactPhone}
                                    </a>
                                    {sacrament.contactEmail && (
                                        <a
                                            href={`mailto:${sacrament.contactEmail}`}
                                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                                        >
                                            <Mail size={12} /> Email
                                        </a>
                                    )}
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
