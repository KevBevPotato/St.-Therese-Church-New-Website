// client/src/pages/HomeEventPages/RisePodcast.tsx
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EventMedia } from '@/components/EventMedia';
import type { EventLandingPageProps } from '@/components/eventfolders/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, Mic, ExternalLink, Headphones, Sparkles, Quote,
} from 'lucide-react';

// 🔧 Replace with the actual Rise podcast URL when you have it.
// Likely location: rapidcitydiocese.org/podcast/ or similar.
const RISE_PODCAST_URL = 'https://www.rapidcitydiocese.org/';

/**
 * Bishop Bullock's "Rise" podcast — flagship diocesan podcast.
 * Source: https://www.rapidcitydiocese.org/  (search "Rise" podcast)
 *
 * Once you have the actual Rise podcast URL, replace RISE_PODCAST_URL above.
 */
export default function RisePodcast({ event }: EventLandingPageProps) {
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
                            <Mic className="size-4" /> Diocesan Podcast
                        </p>
                        <h1 className="mt-4 font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                            The Rise Podcast.
                        </h1>
                        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                            Bishop Robert E. Bullock's flagship podcast — conversations on faith,
                            culture, and what it means to follow Christ in the Black Hills and
                            the Great Plains.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild className="bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg">
                                <a href={RISE_PODCAST_URL} target="_blank" rel="noopener noreferrer">
                                    <Headphones className="mr-2 size-4" />
                                    Listen Now
                                    <ExternalLink className="ml-2 size-4" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    <aside className="flex justify-center md:justify-end">
                        <div className="w-full max-w-md aspect-square overflow-hidden rounded-3xl border-2 border-primary/10 shadow-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <Mic className="size-32 text-primary/30" />
                        </div>
                    </aside>
                </div>
            </section>

            <section className="container mx-auto px-4">
                <EventMedia event={event} />
            </section>

            {/* About */}
            <section className="py-16 md:py-20 bg-secondary/20 border-y border-primary/10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3">
                            <Sparkles size={14} /> About the Show
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                            Faith for the everyday.
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Rise features conversations with Catholics from every walk of life —
                            pastors, parents, teachers, business owners — about how the Gospel
                            meets the realities of daily life.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quote */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <Quote className="size-12 text-accent/40 mx-auto mb-6" />
                    <blockquote className="font-serif text-2xl md:text-3xl italic leading-snug text-primary">
                        "Every Catholic has a story worth telling. Rise is where those stories meet the Gospel."
                    </blockquote>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f]">
                        Bishop Robert E. Bullock
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
