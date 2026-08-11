import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import {
    Calendar,
    FileText,
    ExternalLink,
    ArrowLeft,
    Clock,
} from 'lucide-react';
import {
    getArchivedBulletins,
    formatShortDateRange,
    getMonthKey,
} from '@/data/bulletins';

interface ArchiveEntry {
    start: Date;
    end: Date;
    pdfUrl?: string;
}

function groupByMonth(entries: ArchiveEntry[]): Record<string, ArchiveEntry[]> {
    return entries.reduce((acc, entry) => {
        const key = getMonthKey(entry.start);
        if (!acc[key]) acc[key] = [];
        acc[key].push(entry);
        return acc;
    }, {} as Record<string, ArchiveEntry[]>);
}

export default function PreviousBulletins() {
    const archived = getArchivedBulletins();
    const grouped = groupByMonth(archived);
    const monthKeys = Object.keys(grouped).sort((a, b) => {
        const dateA = grouped[a][0].start;
        const dateB = grouped[b][0].start;
        return dateB.getTime() - dateA.getTime();
    });

    const totalEntries = archived.length;

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
            <Header />
            <div className="pt-[69px]" />

            <main className="flex-grow container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="mb-12">
                    <Link
                        href="/bulletin"
                        className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-bold text-sm uppercase tracking-widest mb-6"
                    >
                        <ArrowLeft size={16} /> Back to Current Week's Bulletin
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-accent" size={28} />
                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary">All Previous Bulletins</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Browse our archive of past bulletins, sorted from most recent to oldest. Each entry covers a Saturday-to-Saturday week.
                    </p>
                    {totalEntries > 0 && (
                        <p className="text-sm text-muted-foreground/80 mt-2">
                            {totalEntries} {totalEntries === 1 ? 'bulletin' : 'bulletins'} archived
                        </p>
                    )}
                </div>

                {/* Archive list */}
                {totalEntries === 0 ? (
                    <Card className="p-12 text-center border border-primary/12 rounded-3xl bg-white">
                        <FileText className="mx-auto text-primary/40 mb-4" size={48} />
                        <h3 className="font-serif text-2xl font-bold text-primary mb-2">No archived bulletins yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Bulletins will appear here once they roll over to the archive each Saturday at 12:00 AM.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-12">
                        {monthKeys.map(monthKey => (
                            <section key={monthKey}>
                                <div className="flex items-center gap-3 mb-6">
                                    <Calendar className="text-accent" size={24} />
                                    <h2 className="font-serif text-3xl font-bold text-primary">{monthKey}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {grouped[monthKey].map(entry => {
                                        const label = formatShortDateRange(entry.start, entry.end);
                                        const hasPdf = !!entry.pdfUrl;

                                        return (
                                            <Card
                                                key={entry.start.toISOString()}
                                                className={`p-6 border rounded-2xl transition-all ${
                                                    hasPdf
                                                        ? 'border-primary/12 bg-white hover:shadow-lg hover:border-accent/40'
                                                        : 'border-gray-200 bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                                                            hasPdf ? 'text-accent' : 'text-muted-foreground'
                                                        }`}>
                                                            {hasPdf ? 'Bulletin' : 'Pending PDF'}
                                                        </p>
                                                        <h3 className="font-serif text-xl font-bold text-primary mb-2">
                                                            {label}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            Sat → Sat · 7 days
                                                        </p>
                                                    </div>
                                                    {hasPdf ? (
                                                        <a
                                                            href={entry.pdfUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-full font-bold text-xs transition-all shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
                                                        >
                                                            <ExternalLink size={14} /> View PDF
                                                        </a>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground italic flex-shrink-0">
                                                            <Clock size={14} /> Not uploaded
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
