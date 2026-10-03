// client/src/pages/FaithFormationDetail.tsx
import { Link, useParams } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Clock,
    User,
    Mail,
    Phone,
    FileText,
    Shield,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Users,
} from 'lucide-react';
import {
    faithCategories,
    faithFormationSettings,
    type FaithCategory,
} from '@/data/faith-formation';

/**
 * Faith Formation Program Detail Page
 *
 * Route: /faith-formation/:categoryId
 *
 * Renders the full landing page for a single program (e.g. OCIA, Youth Ministry,
 * Altar Society Catechesis, etc.) with:
 *   - Hero with title, tagline, and "Register" CTA
 *   - Meeting time & location
 *   - About section
 *   - Catechists (circular photos + Safe Environment PDF links)
 *   - Photo carousel (placeholder ready for images)
 *   - Resources
 */

export default function FaithFormationDetail() {
    const params = useParams<{ categoryId: string }>();
    const categoryId = params?.categoryId;

    const category = faithCategories.find((c) => c.id === categoryId);

    // ----- Not found state -----
    if (!category) {
        return (
            <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
                <Header />
                <div className="pt-[var(--header-height)]" />
                <main className="flex-grow flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <BookOpen className="size-12 text-primary/20 mx-auto mb-4" />
                        <h1 className="font-serif text-3xl font-bold text-primary mb-3">
                            Program Not Found
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            We couldn't find a faith formation program with that ID.
                        </p>
                        <Link href="/faith-formation">
                            <Button className="bg-primary hover:bg-primary/90">
                                <ArrowLeft className="mr-2 size-4" /> Back to All Programs
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const primaryCatechist = category.catechists?.[0];
    const extraCatechists = (category.catechists?.length ?? 0) - 1;

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
            <Header />
            <div className="pt-[var(--header-height)]" />

            {/* ============== HERO ============== */}
            <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
                <div
                    className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl"
                    aria-hidden="true"
                />
                <div className="container mx-auto px-4 relative">
                    <Link href="/faith-formation">
                        <a className="inline-flex items-center gap-2 text-primary/60 hover:text-accent transition-colors mb-6 font-bold uppercase tracking-widest text-xs">
                            <ArrowLeft size={16} /> Back to All Programs
                        </a>
                    </Link>

                    <div className="grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] flex items-center gap-2">
                                <BookOpen className="size-4" /> Faith Formation
                            </p>
                            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-6xl">
                                {category.title}
                            </h1>
                            {category.subtitle && (
                                <p className="mt-3 font-serif text-xl italic text-accent">
                                    {category.subtitle}
                                </p>
                            )}
                            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                                {category.shortDescription}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                <Link href="/faith-formation#register">
                                    <Button
                                        size="lg"
                                        className="bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg"
                                    >
                                        Register Your Child
                                    </Button>
                                </Link>
                                {faithFormationSettings.classroomMapUrl && (
                                    <a
                                        href={faithFormationSettings.classroomMapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-white text-accent border-2 border-accent hover:bg-accent/10 px-8 py-3 font-bold uppercase tracking-widest shadow-lg transition-all rounded-md"
                                    >
                                        <FileText size={18} /> {faithFormationSettings.classroomMapLabel}
                                    </a>
                                )}
                            </div>
                        </div>
                        <aside className="border-l-2 border-[#b8954f] pl-6 md:mb-1">
                            <p className="font-serif text-2xl italic leading-snug text-primary">
                                "Faith is a journey we walk together, supporting one another in love and truth."
                            </p>
                            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f]">
                                Our Mission
                            </p>
                        </aside>
                    </div>
                </div>
            </section>

            {/* ============== MEETING INFO ============== */}
            <section className="py-12 bg-white border-b border-primary/10">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <Card className="p-8 border-2 border-primary/10">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Meeting Time</p>
                                    <p className="text-lg font-serif font-bold text-primary">
                                        {category.meetingTime ?? 'Wednesdays 6:15 PM – 7:30 PM'}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">{faithFormationSettings.classNote}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 border-2 border-primary/10">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Location</p>
                                    <p className="text-lg font-serif font-bold text-primary">
                                        {category.location?.startsWith('Room') ? category.location : `Room: ${category.location ?? 'St. Thérèse Parish'}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">{faithFormationSettings.classroomNote}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* ============== ABOUT ============== */}
            <section className="py-16 md:py-20 bg-[#fbfaf6]">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3 flex items-center justify-center gap-2">
                            <BookOpen size={14} /> About This Program
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
                            What to Expect
                        </h2>
                    </div>

                    <Card className="p-10 border-none shadow-xl bg-white rounded-3xl">
                        <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                            {category.aboutText || category.longDescription || category.shortDescription}
                        </p>

                        {(category as any).details && Array.isArray((category as any).details) && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="font-serif text-xl font-bold text-primary mb-4">Program Details</h3>
                                <ul className="space-y-2">
                                    {((category as any).details as string[]).map((detail, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                                            <span className="text-accent mt-1">•</span>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card>
                </div>
            </section>

            {/* ============== CATECHISTS ============== */}
            {category.catechists && category.catechists.length > 0 && (
                <section className="py-16 md:py-20 bg-white border-t border-primary/10">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-12">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3 flex items-center justify-center gap-2">
                                <Users size={14} /> Leadership
                            </p>
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                                Meet the Catechists
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                The faithful men and women who walk alongside your family on this journey.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {category.catechists.map((catechist, idx) => (
                                <Card
                                    key={idx}
                                    className="group overflow-hidden border-2 border-primary/12 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden bg-primary/5 flex items-center justify-center">
                                        {catechist.photo ? (
                                            <img
                                                src={catechist.photo}
                                                alt={catechist.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                style={{ objectPosition: catechist.photoPosition ?? 'center 25%' }}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-primary">
                                                <User className="size-12 text-primary/15 mb-2" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-serif text-base font-bold text-primary mb-1 leading-tight">
                                            {catechist.name}
                                        </h3>
                                        {catechist.role && (
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
                                                {catechist.role}
                                            </p>
                                        )}
                                        {catechist.email && (
                                            <a
                                                href={`mailto:${catechist.email}`}
                                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-2"
                                            >
                                                <Mail size={11} /> <span className="truncate">{catechist.email}</span>
                                            </a>
                                        )}
                                        {/* Safe Environment PDF link — per parish policy */}
                                        {catechist.safeEnvironmentPdf && (
                                            <a
                                                href={catechist.safeEnvironmentPdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors mt-2 pt-2 border-t border-primary/5"
                                            >
                                                <Shield size={11} className="text-green-600" />
                                                Safe Environment Link
                                            </a>
                                        )}
                                    </div> 
                                </Card>
                            ))}
                        </div>

                        {extraCatechists > 0 && (
                            <p className="text-center text-sm text-muted-foreground mt-6 italic">
                                + {extraCatechists} more {extraCatechists === 1 ? 'catechist' : 'catechists'} serving this program
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* ============== PHOTO CAROUSEL PLACEHOLDER ============== */}
            <section className="py-16 md:py-20 bg-secondary/20 border-t border-primary/10">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3">
                            Life in the Program
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
                            Photos
                        </h2>
                    </div>

                    {/* Replace `category.images` with your actual photo array */}
                    {((category as any).images as string[] | undefined)?.length ? (
                        <PhotoCarousel images={(category as any).images} />
                    ) : (
                        <Card className="p-16 text-center border-2 border-dashed border-primary/15 bg-white rounded-3xl">
                            <BookOpen className="size-12 text-primary/20 mx-auto mb-4" />
                            <p className="text-muted-foreground font-bold">Photos coming soon!</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Photos from this year's program will be shared here as they're available.
                            </p>
                        </Card>
                    )}
                </div>
            </section>

            {/* ============== CONTACT CTA ============== */}
            <section className="py-16 bg-[#fbfaf6] border-t border-primary/10">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                        Ready to Register?
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        Have questions about {category.title}? Reach out to us — we'd love to hear from you.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/faith-formation">
                            <Button
                                size="lg"
                                className="bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg"
                            >
                                Begin Registration
                            </Button>
                        </Link>
                        <a
                            href={`tel:${faithFormationSettings.contactPhone.replace(/\D/g, '')}`}
                            className="inline-flex items-center gap-2 bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 px-8 py-3 font-bold uppercase tracking-widest shadow-lg transition-all rounded-md"
                        >
                            <Phone size={16} /> {faithFormationSettings.contactPhone}
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

/* ============================================================ */
/*             Photo Carousel (simple, no deps)                 */
/* ============================================================ */

function PhotoCarousel({ images }: { images: string[] }) {
    const [index, setIndex] = useStateSafeState(0);
    const prev = () => setIndex((index - 1 + images.length) % images.length);
    const next = () => setIndex((index + 1) % images.length);

    return (
        <div className="relative">
            <div className="aspect-video bg-primary/5 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                    src={images[index]}
                    alt={`Program photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-primary transition-all"
                        aria-label="Previous photo"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-primary transition-all"
                        aria-label="Next photo"
                    >
                        <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`size-2 rounded-full transition-all ${i === index ? 'bg-white w-6' : 'bg-white/50'}`}
                                aria-label={`Go to photo ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// Tiny shim so the carousel works without importing useState at the top
import { useState as useStateSafeState } from 'react';
