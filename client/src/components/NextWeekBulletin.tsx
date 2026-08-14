import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import {
    FileText,
    Phone,
    Mail,
} from 'lucide-react';
import BulletinView, {
    Bulletin,
    defaultContactInfo,
} from './BulletinView';
import {
    getNextWeekRange,
    getPdfUrlForWeek,
    formatBulletinRange,
    formatShortDateRange,
} from '@/data/bulletins';

/**
 * Bulletin Page - Next Week (Preview)
 *
 * Shows the upcoming bulletin week using the same layout as the current
 * week. If the PDF has not been uploaded yet, displays an "available
 * Saturday morning" banner instead of a "View PDF" button.
 */

function buildNextBulletin(): Bulletin {
    const { start, end } = getNextWeekRange();
    return {
        id: `next-${formatBulletinRange(start, end)}`,
        week: formatBulletinRange(start, end),
        startDate: start,
        endDate: end,
        pdfUrl: getPdfUrlForWeek(start),
        sections: [],
    };
}

export default function NextWeekBulletin() {
    const nextBulletin = buildNextBulletin();
    const hasPdf = !!nextBulletin.pdfUrl;
    const shortLabel = formatShortDateRange(nextBulletin.startDate, nextBulletin.endDate);

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
            <Header />
            <div className="pt-[var(--header-height)]" />

            <main className="flex-grow container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-accent" size={28} />
                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary">
                            Next Week's Bulletin
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Preview of next week's bulletin (<span className="font-semibold">{shortLabel}</span>).
                        The PDF will be available once it has been uploaded by bulletin coordinators.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <BulletinView
                            bulletin={nextBulletin}
                            title="Next Week's Bulletin"
                            subtitle="Upcoming"
                            backHref="/bulletin"
                            backLabel="Back to Current Week's Bulletin"
                            showEmptyPdfWarning={!hasPdf}
                            emptyPdfMessage={
                                hasPdf
                                    ? ''
                                    : `Bulletin for ${shortLabel} not uploaded yet — check back Saturday morning at 12:00 AM.`
                            }
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <Card className="p-8 border-none shadow-lg bg-primary text-white rounded-[2rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <FileText size={80} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-6 relative z-10">Questions?</h3>
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <p className="font-bold">{defaultContactInfo.name}</p>
                                    <p className="text-xs text-white/60 uppercase tracking-widest">{defaultContactInfo.title}</p>
                                </div>
                                <div className="pt-4 border-t border-white/10 space-y-3">
                                    <a
                                        href={`tel:${defaultContactInfo.phone.replace(/\D/g, '')}`}
                                        className="flex items-center gap-3 text-sm hover:text-accent transition-colors"
                                    >
                                        <Phone size={16} /> {defaultContactInfo.phone}
                                    </a>
                                    <a
                                        href={`mailto:${defaultContactInfo.email}`}
                                        className="flex items-center gap-3 text-sm hover:text-accent transition-colors"
                                    >
                                        <Mail size={16} /> {defaultContactInfo.email}
                                    </a>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 border border-primary/12 rounded-[2rem] shadow-sm bg-white">
                            <h3 className="font-serif text-xl font-bold text-primary mb-4">About Next Week's Bulletin</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Next week's bulletin becomes available Saturday morning at 12:00 AM. Once uploaded, the View PDF button will appear here.
                            </p>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
