import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import {
    FileText,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import BulletinView, {
    Bulletin as BulletinType,
    defaultContactInfo,
} from './BulletinView';
import {
    getCurrentWeekRange,
    getPdfUrlForWeek,
    formatBulletinRange,
    BulletinCMS
} from '@/data/bulletins';
import bulletinDataRaw from '@/data/bulletins_data.json';

// Cast the JSON data to the interface we defined in bulletins.ts
const bulletinData = bulletinDataRaw as BulletinCMS[];

// ====== This is the function you were looking for! ======
// It takes raw data from the JSON and turns it into a format BulletinView understands
function buildBulletinForRange(start: Date, end: Date): BulletinType {
    // Find the bulletin in the CMS JSON that matches this start date
    const data = bulletinData.find(b =>
        new Date(b.startDate + 'T00:00:00').getTime() === start.getTime()
    );

    return {
        id: formatBulletinRange(start, end),
        week: formatBulletinRange(start, end),
        startDate: start,
        endDate: end,
        pdfUrl: data?.pdfUrl || getPdfUrlForWeek(start),
        // We map the CMS sections to add an 'id' so the Filter buttons work
        sections: data?.sections.map(s => ({
            ...s,
            id: s.label.toLowerCase().replace(/\s+/g, '-'),
        })) || [],
        hasContent: data ? (data.sections.length > 0) : false,
    };
}

export default function Bulletin() {
    const currentRange = getCurrentWeekRange();
    const currentBulletin = buildBulletinForRange(currentRange.start, currentRange.end);

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
            <Header />
            <div className="pt-[var(--header-height)]" />

            <main className="flex-grow container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="mt-16 mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-accent" size={28} />
                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary">Parish Bulletins</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Stay informed with our weekly parish bulletins. View the latest announcements, mass schedules, and community events directly in your browser.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between">
                            <Link
                                href="/bulletin/previous"
                                className="flex items-center gap-2 text-primary hover:text-accent transition-colors font-bold text-sm uppercase tracking-widest"
                            >
                                <ChevronLeft size={16} /> All Previous Bulletins
                            </Link>
                            <Link
                                href="/bulletin/next"
                                className="flex items-center gap-2 text-primary hover:text-accent transition-colors font-bold text-sm uppercase tracking-widest"
                            >
                                Next Week's Bulletin <ChevronRight size={16} />
                            </Link>
                        </div>

                        {/* Current week bulletin - we pass the 'currentBulletin' we built above into the View */}
                        <BulletinView
                            bulletin={currentBulletin}
                            title="This Week's Bulletin"
                            subtitle="Current Week"
                            hideSectionsWithoutPdf
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Contact Card */}
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
                            <h3 className="font-serif text-xl font-bold text-primary mb-4">About Our Bulletins</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Our weekly bulletins contain important announcements, mass schedules, community news, and spiritual reflections. View the PDF to read all sections or use the filters to focus on specific content.
                            </p>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
