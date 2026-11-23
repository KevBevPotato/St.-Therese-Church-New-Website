// client/src/pages/events/DailyRosary.tsx
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EventMedia } from '@/components/EventMedia';
import type { EventLandingPageProps } from '@/components/eventfolders/types';
import { Card } from '@/components/ui/card';
import {
    ArrowLeft,
    Cross,
    Download,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CmsMarkdown from '@/components/CmsMarkdown';
import getInvolvedData from '@/data/get-involved';

/**
 * Daily Rosary — landing page
 *
 * One rich landing page for the Daily Rosary event. The same component is
 * used for every occurrence (Mon–Fri at 7 AM); the date in the URL is
 * irrelevant to this page.
 *
 * The link to Fr. Mark-Mary Ames's "Rosary in a Year" podcast uses the
 * Ascension Press URL provided.
 */

const ROSARY_IN_A_YEAR_URL =
    'https://app.ascensionpress.com/podcasts/f050d01d-da47-4d3d-bb68-b22339db672a';

const MARYKNOLL_ROSARY_GUIDE =
    'https://www.maryknollsisters.org/pray-with-us/pray-rosary-us/?gad_source=1&gad_campaignid=23374479357&gbraid=0AAAAABtvOnY7g8nyvAdYShNA80_tMmxfx&gclid=Cj0KCQjw4orUBhCjARIsAIbF3qy2U8ni3lrwxi_-ukzHYXnDQclEm5tbqJaxn_U-9KQIW6nJ9Dt4BV8aAgaaEALw_wcB';

export default function DailyRosary({ event }: EventLandingPageProps) {
    const page = getInvolvedData.settings.parishLifePages?.rosaryPage;
    const resources = (page?.resources ?? []).filter(
        resource =>
            typeof resource?.title === 'string' &&
            resource.title.trim().length > 0 &&
            typeof resource?.document === 'string' &&
            resource.document.trim().length > 0
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="pt-[var(--header-height)]" />

            {/* Breadcrumb / back link */}
            <section className="container mx-auto px-4 pt-8">
                <Link
                    href="/events"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f] hover:text-primary transition-colors"
                >
                    <ArrowLeft className="size-4" /> All Events
                </Link>
            </section>

            {/* Hero with rosary image on the right */}
            <section className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center max-w-6xl mx-auto">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                            {page?.eyebrow || 'Sacramental Life'}
                        </p>
                        <h1 className="mt-4 font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                            {page?.title || 'The Daily Rosary.'}
                        </h1>
                        <div className="mt-6 text-lg leading-relaxed text-muted-foreground">
                            <CmsMarkdown>
                                {page?.introduction ||
                                    'Every weekday morning at **7:00 AM** in the Main Sanctuary, our parish family gathers to pray the rosary together before the day begins. All are welcome — join us for the full rosary, a single decade, or simply to sit in prayer.'}
                            </CmsMarkdown>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button
                                asChild
                                className="bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg"
                            >
                                <a href={ROSARY_IN_A_YEAR_URL} target="_blank" rel="noopener noreferrer">
                                    Pray with Fr. Mark-Mary
                                    <ExternalLink className="ml-2 size-4" />
                                </a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="border-2 border-primary/30 text-primary hover:bg-primary/5 px-8 py-6 font-bold uppercase tracking-widest"
                            >
                                <a href={MARYKNOLL_ROSARY_GUIDE} target="_blank" rel="noopener noreferrer">
                                    How to Pray the Rosary
                                    <ExternalLink className="ml-2 size-4" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Rosary image on the right */}
                    <aside className="flex justify-center md:justify-end">
                        <div className="w-full max-w-md aspect-square overflow-hidden rounded-3xl border-2 border-primary/10 shadow-xl bg-white">
                            <img
                                src={page?.heroImage || '/landingpagephotos/Rosary.png'}
                                alt="The Rosary"
                                loading="eager"
                                decoding="async"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </aside>
                </div>
            </section>

            {resources.length > 0 && (
                <section className="border-y border-primary/10 bg-[#f3efe5] py-16 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                                Pray with Scripture
                            </p>
                            <h2 className="mt-3 font-serif text-3xl font-bold text-primary md:text-4xl">
                                {page?.resourcesTitle || 'Scriptural Rosary Guides'}
                            </h2>
                            {page?.resourcesIntroduction && (
                                <div className="mt-4 leading-relaxed text-muted-foreground">
                                    <CmsMarkdown>{page.resourcesIntroduction}</CmsMarkdown>
                                </div>
                            )}
                        </div>
                        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
                            {resources.map((resource, index) => (
                                <Card
                                    key={`${resource.title}-${index}`}
                                    className="flex flex-col border border-primary/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                                >
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-primary">
                                            {resource.title}
                                        </h3>
                                        {resource.description && (
                                            <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                <CmsMarkdown>{resource.description}</CmsMarkdown>
                                            </div>
                                        )}
                                    </div>
                                    <a
                                        href={resource.document}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-primary/15 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white sm:mt-0"
                                    >
                                        <Download className="size-4" aria-hidden="true" />
                                        Download
                                    </a>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="container mx-auto px-4">
                <EventMedia event={event} includeCarouselPhotosInGallery />
            </section>

            {/* Fr. Mark-Mary Ames feature */}
            <section className="py-12 md:py-16 bg-secondary/20 border-y border-primary/10">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid gap-10 md:grid-cols-[0.4fr_1fr] md:items-center">
                        <div className="flex justify-center">
                            <div className="w-full max-w-[240px] overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-primary/5">
                                <img
                                    src="/landingpagephotos/Fr.MarkMary.png"
                                    alt="Fr. Mark-Mary Ames, CFR"
                                    className="h-full w-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-2">
                                Featured Resource
                            </p>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                                Rosary in a Year
                            </h2>
                            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                                Join Fr. Mark-Mary Ames, CFR and the Ascension community in praying
                                through the entire rosary — all 20 mysteries, all 365 days of the
                                year. Each short daily podcast walks you through one decade and
                                shares reflections from the saints.
                            </p>
                            <p className="text-sm text-muted-foreground italic mb-6">
                                "The rosary is the most powerful weapon to touch the Heart of Jesus,
                                and to obtain graces from His Mother."
                                <br />
                                <span className="not-italic font-bold text-primary/70">— St. Louis de Montfort</span>
                            </p>
                            <a
                                href={ROSARY_IN_A_YEAR_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-bold uppercase tracking-widest text-xs"
                            >
                                Listen on Ascension Press
                                <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Saints & the Rosary */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3">
                            <Cross size={14} /> A Long Tradition
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                            Saints and the Rosary
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            The rosary has been the daily companion of saints across every century
                            of the Church's history.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Card className="p-8 border-2 border-primary/10 bg-white rounded-3xl shadow-sm">
                            <h3 className="font-serif text-xl font-bold text-primary mb-2">
                                Padre Pio
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                The famous stigmatist was said to pray <strong>nearly 33 rosaries
                                    each day</strong> — one for each year of Christ's life. He offered
                                the rosary constantly for the souls in purgatory and for those who
                                came to him in confession.
                            </p>
                        </Card>

                        <Card className="p-8 border-2 border-primary/10 bg-white rounded-3xl shadow-sm">
                            <h3 className="font-serif text-xl font-bold text-primary mb-2">
                                St. Louis de Montfort
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Author of <em>True Devotion to Mary</em>, he preached the rosary
                                as the most powerful means of consecration to Jesus through Mary.
                            </p>
                        </Card>

                        <Card className="p-8 border-2 border-primary/10 bg-white rounded-3xl shadow-sm">
                            <h3 className="font-serif text-xl font-bold text-primary mb-2">
                                St. John Paul II
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Wrote <em>Rosarium Virginis Mariae</em>, an apostolic letter on
                                the rosary, calling it his "favorite prayer." He added the
                                Luminous Mysteries in 2002.
                            </p>
                        </Card>

                        <Card className="p-8 border-2 border-primary/10 bg-white rounded-3xl shadow-sm">
                            <h3 className="font-serif text-xl font-bold text-primary mb-2">
                                St. Thérèse of Lisieux
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                Our own patroness! She prayed the rosary every day and said:
                                <em> "I do not know of any prayer more beautiful than the rosary."</em>
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Practical info */}
            <section className="py-16 bg-secondary/20 border-t border-primary/10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="p-8 md:p-10 border-2 border-primary/10 rounded-3xl bg-white">
                        <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                            When & Where
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">
                                    When
                                </p>
                                <p className="font-serif text-lg font-bold text-primary">
                                    Monday – Friday · 7:00 AM
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    About 20–25 minutes
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">
                                    Where
                                </p>
                                <p className="font-serif text-lg font-bold text-primary">
                                    Main Sanctuary
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Enter through the main church doors
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                        New to the rosary?
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        No experience needed. We have extras to share, and we'll walk you through
                        every prayer. Come as you are.
                    </p>
                    <Link href="/events">
                        <Button variant="outline" className="border-2 border-primary/30 text-primary hover:bg-primary/5 px-8 py-6 font-bold uppercase tracking-widest">
                            <ArrowLeft className="mr-2 size-4" /> Back to Calendar
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
