// client/src/pages/HomeEventPages/BishopBookclub.tsx
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EventMedia } from '@/components/EventMedia';
import type { EventLandingPageProps } from '@/components/eventfolders/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, BookOpen, ExternalLink, Headphones, Calendar, Sparkles, Quote,
} from 'lucide-react';

const DIOCESE_URL = 'https://www.rapidcitydiocese.org/bookclub/';

/**
 * Bishop Bullock's Bookclub — monthly podcast discussion.
 * Source: https://www.rapidcitydiocese.org/bookclub/
 *
 * Generic landing page for all Bookclub episodes. Specific titles (The End
 * of the Affair, The Way of the Disciple, Brideshead Revisited, The Power
 * and the Glory, Wheat that Springeth Green, etc.) are listed on the
 * diocesan page.
 */
export default function BishopBookclub({ event }: EventLandingPageProps) {
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
                            <BookOpen className="size-4" /> Diocesan Event
                        </p>
                        <h1 className="mt-4 font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                            Bishop's Bookclub.
                        </h1>
                        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                            Each month, Bishop Robert E. Bullock picks a book that has shaped his
                            faith and shares a thoughtful podcast discussion. Then it's your turn —
                            read along, listen in, and join the conversation.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild className="bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg">
                                <a href={DIOCESE_URL} target="_blank" rel="noopener noreferrer">
                                    <Headphones className="mr-2 size-4" />
                                    See Past Episodes
                                    <ExternalLink className="ml-2 size-4" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    <aside className="flex justify-center md:justify-end">
                        <div className="w-full max-w-md aspect-square overflow-hidden rounded-3xl border-2 border-primary/10 shadow-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                            <BookOpen className="size-32 text-primary/30" />
                        </div>
                    </aside>
                </div>
            </section>

            <section className="container mx-auto px-4">
                <EventMedia event={event} />
            </section>

            {/* How it works */}
            <section className="py-16 md:py-20 bg-secondary/20 border-y border-primary/10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3">
                            <Sparkles size={14} /> How It Works
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                            One book. One conversation.
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        <Card className="p-8 border-2 border-primary/10 bg-white rounded-3xl shadow-sm">
                            <div className="text-3xl font-serif font-bold text-accent mb-2">1</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-2">Bishop picks the book</h3>
                            <p className="text-sm text-muted-foreground">
                                Classics, modern fiction, spiritual reading — always something worth your time.
                            </p>
                        </Card>
                        <Card className="p-8 border-2 border-primary/10 bg-white rounded-3xl shadow-sm">
                            <div className="text-3xl font-serif font-bold text-accent mb-2">2</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-2">You read along</h3>
                            <p className="text-sm text-muted-foreground">
                                Pick up a copy from your library or favorite bookstore.
                            </p>
                        </Card>
                        <Card className="p-8 border-2 border-primary/10 bg-white rounded-3xl shadow-sm">
                            <div className="text-3xl font-serif font-bold text-accent mb-2">3</div>
                            <h3 className="font-serif text-xl font-bold text-primary mb-2">Podcast drops</h3>
                            <p className="text-sm text-muted-foreground">
                                Bishop Bullock releases his discussion the third Tuesday of each month.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Schedule */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <Calendar className="size-10 text-accent mx-auto mb-4" />
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                        Released monthly
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        Past selections have included works by Graham Greene, Evelyn Waugh,
                        Erasmo Leiva-Merikakis, and J.F. Powers — Catholic and literary classics alike.
                    </p>
                    <Button asChild variant="outline" className="border-2 border-primary/30 text-primary hover:bg-primary/5 px-8 py-6 font-bold uppercase tracking-widest">
                        <a href={DIOCESE_URL} target="_blank" rel="noopener noreferrer">
                            View Full List
                            <ExternalLink className="ml-2 size-4" />
                        </a>
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
