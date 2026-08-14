// FaithFormation.tsx
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Users,
    BookOpen,
    X,
    FileText,
    MapPin,
    Phone,
    User,
    Heart
} from 'lucide-react';

/**
 * Faith Formation Page
 * Features:
 * - 5 PDF links in the hero for registration, schedule, medical release,
 *   Confirmation registration, and classroom locations
 * - Wednesday flyer image on the right side of the hero
 * - Registration form modal (still behind a button, but may not be needed
 *   since we now link directly to the registration PDF)
 */

// (All the type interfaces, faithEvents array, ageCategories, defaultChildData,
//  state initialization, form handlers, etc. stay exactly the same — omitted
//  here for brevity but they're unchanged in the file you sent.)

export default function FaithFormation() {
    // ... all state and logic unchanged ...

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
            <Header />
            <div className="pt-[var(--header-height)]" />

            {/* Hero Section — now with the Wednesday flyer on the right */}
            {/* Hero Section — now with the Wednesday flyer on the right */}
            <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
                <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
                <div className="container relative grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-start mx-auto px-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                            <BookOpen className="size-4" aria-hidden="true" /> Growing in Faith
                        </p>
                        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                            Faith Formation Programs
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            Nurturing faith at every stage of life. From young children to adults, discover programs designed to deepen your relationship with Christ and our parish community.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-8">
                            <a
                                href="/OldSTCCWebsite/Religious+Education+Registration+26-27.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3 font-bold uppercase tracking-widest shadow-lg transition-all rounded-md"
                            >
                                <FileText size={18} /> Register Now
                            </a>
                            <a
                                href="/OldSTCCWebsite/Faith+Formation+Schedule+2026+2027.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-accent border-2 border-accent hover:bg-accent/10 px-8 py-3 font-bold uppercase tracking-widest shadow-lg transition-all rounded-md"
                            >
                                <Calendar size={18} /> Schedule
                            </a>
                            <a
                                href="/OldSTCCWebsite/Permission+Slip+2025+2026.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-accent border-2 border-accent hover:bg-accent/10 px-8 py-3 font-bold uppercase tracking-widest shadow-lg transition-all rounded-md"
                            >
                                <FileText size={18} /> Activity & Medical Release
                            </a>
                            <a
                                href="/ChurchMap.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-accent border-2 border-accent hover:bg-accent/10 px-8 py-3 font-bold uppercase tracking-widest shadow-lg transition-all rounded-md"
                            >
                                <FileText size={18} /> View Classroom Locations
                            </a>
                            <a
                                href="/OldSTCCWebsite/Confirmation+Registration+26-27.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-accent border-2 border-accent hover:bg-accent/10 px-8 py-3 font-bold uppercase tracking-widest shadow-lg transition-all rounded-md"
                            >
                                <FileText size={18} /> Confirmation Registration
                            </a>
                        </div>
                    </div>

                    {/* Wednesday FF Flyer — wrapped in a clickable link, opens full size in new tab */}
                    <aside className="md:pt-12 flex flex-col items-center md:items-end">
                        <a
                            href="/OldSTCCWebsite/Wednesday+FF+flyer.webp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group w-full max-w-xl"
                            title="Click to view full size"
                        >
                            <img
                                src="/OldSTCCWebsite/Wednesday+FF+flyer.webp"
                                alt="Wednesday Faith Formation Flyer"
                                className="w-full rounded-2xl border-2 border-primary/10 shadow-lg transition-all group-hover:border-primary/30 group-hover:shadow-xl"
                                loading="lazy"
                                decoding="async"
                            />
                        </a>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f] text-center md:text-right">
                            Wednesday Night Faith Formation
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground text-center md:text-right">
                            Click image to view full size
                        </p>
                    </aside>
                </div>
            </section>

            <main className="flex-grow py-12">
                {/* ... rest of the page unchanged ... */}
            </main>

            <Footer />
        </div>
    );
}
