// client/src/pages/HomeEventPages/CinemaWithTheShepherd.tsx
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, Film, Calendar, MapPin, ExternalLink, Sparkles, Popcorn, Quote,
} from 'lucide-react';

const DIOCESE_URL = 'https://www.rapidcitydiocese.org/cinema26/';

/**
 * Bishop's "Cinema with the Shepherd" film festival.
 * Source: https://www.rapidcitydiocese.org/cinema26/
 *
 * Generic landing page — used for every monthly screening in the series.
 * Specific film info (La Strada, Bicycle Thieves, Burmese Harp, Wizard of Oz,
 * Babette's Feast, etc.) is on the diocesan page linked above.
 */
export default function CinemaWithTheShepherd() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="pt-[var(--header-height)]" />

            <section className="container mx-auto px-4 pt-8">
                <Link href="/events" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f] hover:text-primary transition-colors">
                    <ArrowLeft className="size-4" /> All Events
                </Link>
            </section>

            {/* Hero */}
            <section className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center max-w-6xl mx-auto">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                            <Film className="size-4" /> Diocesan Event
                        </p>
                        <h1 className="mt-4 font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                            Cinema with the Shepherd.
                        </h1>
                        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                            Bishop Robert E. Bullock hosts a monthly film series featuring
                            great Catholic cinema — classics and hidden gems from around
                            the world — followed by discussion and fellowship.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild className="bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg">
                                <a href={DIOCESE_URL} target="_blank" rel="noopener noreferrer">
                                    <Sparkles className="mr-2 size-4" />
                                    See This Year's Lineup
                                    <ExternalLink className="ml-2 size-4" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    <aside className="flex justify-center md:justify-end">
                        <div className="w-full max-w-md aspect-[3/4] overflow-hidden rounded-3xl border-2 border-primary/10 shadow-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <div className="text-center p-8">
                                <Popcorn className="size-24 mx-auto text-primary/30 mb-4" />
                                <p className="font-serif text-xl font-bold text-primary italic">
                                    "A cinema that forms the soul."
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Series overview */}
            <section className="py-16 md:py-20 bg-secondary/20 border-y border-primary/10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3">
                            <Film size={14} /> The Series
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                            Great films. Great conversation.
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Cinema with the Shepherd brings the parish and diocesan community
                            together around films that move the heart and challenge the mind.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        <Card className="p-8 border-2 border-primary/10 bg-white rounded-3xl shadow-sm">
                            <Calendar className="size-10 text-accent mb-4" />
                            <h3 className="font-serif text-xl font-bold text-primary mb-2">Monthly</h3>
                            <p className="text-sm text-muted-foreground">
                                One film per month, typically the first Tuesday at 6:30 PM.
                            </p>
                        </Card>
                        <Card className="p-8 border-2 border-primary/10 bg-white rounded-3xl shadow-sm">
                            <MapPin className="size-10 text-accent mb-4" />
                            <h3 className="font-serif text-xl font-bold text-primary mb-2">St. Joseph Hall</h3>
                            <p className="text-sm text-muted-foreground">
                                Held at the Cathedral of Our Lady of Perpetual Help in Rapid City.
                            </p>
                        </Card>
                        <Card className="p-8 border-2 border-primary/10 bg-white rounded-3xl shadow-sm">
                            <Quote className="size-10 text-accent mb-4" />
                            <h3 className="font-serif text-xl font-bold text-primary mb-2">Discussion</h3>
                            <p className="text-sm text-muted-foreground">
                                Bishop Bullock leads a reflection after each screening.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Quote */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <Quote className="size-12 text-accent/40 mx-auto mb-6" />
                    <blockquote className="font-serif text-2xl md:text-3xl italic leading-snug text-primary">
                        "Storytelling is a profound way to encounter truth, beauty, and goodness. The films in this series were chosen because they speak to the human person — and to the journey of every Christian."
                    </blockquote>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f]">
                        Bishop Robert E. Bullock
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-secondary/20 border-t border-primary/10">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                        See the full lineup & RSVP
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        Each screening is free and open to all. The diocesan page lists every
                        film in the 2026 series with descriptions and trailer links.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg">
                        <a href={DIOCESE_URL} target="_blank" rel="noopener noreferrer">
                            View on Diocese Site
                            <ExternalLink className="ml-2 size-4" />
                        </a>
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
