import { useRoute } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Calendar,
    Building2,
    Phone,
    Mail,
    CheckCircle2,
    HelpCircle,
    Users,
    Heart
} from 'lucide-react';
import { Link } from 'wouter';

/**
 * Opportunity Detail Page
 * A dynamic template to explain specific parish projects and groups in depth.
 */

export default function OpportunityDetail() {
    const [match, params] = useRoute('/get-involved/:id');

    // In a real application, you would fetch data from a database or a shared constant file.
    // For this prototype, we map the ID to the correct content.
    const id = params?.id;

    // Mock data mapping
    const getDetailData = (id: string | undefined) => {
        switch (id) {
            case '2':
                return {
                    title: "Youth Ministry Mentors",
                    organization: "Faith Formation",
                    contact: { name: "Jane Doe", phone: "(605) 867-5309", email: "office@sttherese.org" },
                    description: "Our Youth Ministry is more than just a class; it's a community where high schoolers can encounter Christ. Mentors provide a consistent, loving presence that helps teens navigate their faith in the modern world.",
                    faqs: [
                        { q: "What is the time commitment?", a: "Mentors meet every Wednesday evening from 6:30 PM to 8:30 PM during the school year." },
                        { q: "Do I need special training?", a: "Yes, all volunteers must complete Safe Environment Training (Safe Haven). We provide the resources for this." }
                    ],
                    requirements: ["Active member of the parish", "Vibrant personal prayer life", "Safe Environment Training completion"]
                };
            case '1':
                return {
                    title: "Sanctuary Renovation",
                    organization: "Parish Council",
                    contact: { name: "John Doe", phone: "(605) 867-5309", email: "office@sttherese.org" },
                    description: "Help us preserve the beauty of our sacred space. This project involves restoring liturgical elements and upgrading sanctuary technology.",
                    faqs: [
                        { q: "How can I contribute?", a: "You can sponsor specific items or make a general donation to the renovation fund." },
                        { q: "When will the project be finished?", a: "We aim to complete the primary restorations by Easter 2027." }
                    ],
                    requirements: ["A heart for liturgical beauty", "Financial support or specialized craft skills"]
                };
            default:
                return {
                    title: "Parish Opportunity",
                    organization: "St. Therese Parish",
                    contact: { name: "Parish Office", phone: "(605) 348-6808", email: "office@sttherese.org" },
                    description: "Join this vital parish mission to serve our community and grow in faith together.",
                    faqs: [
                        { q: "How do I get started?", a: "Fill out the interest form on the Get Involved page or contact the coordinator listed here." }
                    ],
                    requirements: ["Active parishioner", "Willingness to serve"]
                };
        }
    };

    const details = getDetailData(id);

    if (!match) return null;

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="aspect-video bg-gray-200 rounded-3xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800" alt="Parish Life" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-primary/20" />
                            </div>
                            <div className="aspect-video bg-gray-200 rounded-3xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=800" alt="Fellowship" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-primary/20" />
                            </div>
                        </div>

                        <div className="space-y-8 pt-8">
                            <h2 className="font-serif text-3xl font-bold text-primary flex items-center gap-3">
                                <HelpCircle className="text-accent" /> Frequently Asked Questions
                            </h2>
                            <div className="space-y-6">
                                {details.faqs.map((faq, i) => (
                                    <div key={i} className="bg-white p-8 rounded-3xl border border-primary/5 shadow-sm">
                                        <h4 className="font-bold text-primary mb-3">{faq.q}</h4>
                                        <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                                    <a href={`mailto:${details.contact.email}`} className="flex items-center gap-3 text-sm hover:text-accent transition-colors">
                                        <Mail size={16} /> {details.contact.email}
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
