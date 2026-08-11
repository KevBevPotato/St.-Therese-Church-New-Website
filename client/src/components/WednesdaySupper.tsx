// --- File: WednesdaySupper.tsx ---
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Users,
    Utensils,
    ShoppingCart,
    Sparkles,
    Phone,
    ArrowLeft,
    Heart,
} from 'lucide-react';
import { Link } from 'wouter';

const FORM_URLS = {
    contribute: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UMU5XQlRRNEE4TVFXOFdQM0JBODFXWUhURy4u',
    signUpToHelp: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UQkFRRTFRUDIzWkcwT0JOODc2MzdaNlVERy4u',
    suggestion: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UMjBVRk5PNFk0S0lQS041NjdCNVo2QlkxNS4u',
    referral: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=4_1Q5hq9wkK9ouKfeVo9ueKRp4Y-VxtLvUss1gz4yg5UNFFTRkFRVkNXWU1VMkc4S1JXVU0yUFFRQy4u',
};

type RoleName = 'Grocery Pick-up' | 'Food Prep' | 'Food Server' | 'Clean-up Crew';

interface VolunteerRole {
    name: RoleName;
    needed: number;
    filled: number;
}

interface WednesdayWeek {
    id: string;
    date: Date;
    dateLabel: string;
    sponsor: string | null; // null = unsponsored, string = sponsor name
    sponsored: boolean;
    roles: VolunteerRole[];
    notes?: string;
}

interface MonthGroup {
    month: string;
    year: number;
    weeks: WednesdayWeek[];
}

const roleIcons: Record<RoleName, React.ReactNode> = {
    'Grocery Pick-up': <ShoppingCart size={14} />,
    'Food Prep': <Utensils size={14} />,
    'Food Server': <Users size={14} />,
    'Clean-up Crew': <Sparkles size={14} />,
};

// ============================================================
// EDIT THIS DATA to match your actual schedule
// Mark sponsors as "sponsored: true" and add their name when filled
// Update role filled counts as people sign up
// ============================================================
const allWeeks: WednesdayWeek[] = [
    // September 2026
    { id: 'sep-2-2026', date: new Date(2026, 8, 2), dateLabel: 'Sept 2, 2026', sponsor: 'Smith Family', sponsored: true, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 1 },
        { name: 'Food Prep', needed: 3, filled: 3 },
        { name: 'Food Server', needed: 3, filled: 2 },
        { name: 'Clean-up Crew', needed: 3, filled: 3 },
    ]},
    { id: 'sep-9-2026', date: new Date(2026, 8, 9), dateLabel: 'Sept 9, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 1 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'sep-16-2026', date: new Date(2026, 8, 16), dateLabel: 'Sept 16, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'sep-23-2026', date: new Date(2026, 8, 23), dateLabel: 'Sept 23, 2026', sponsor: 'Jones Family', sponsored: true, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 1 },
        { name: 'Food Prep', needed: 3, filled: 2 },
        { name: 'Food Server', needed: 3, filled: 3 },
        { name: 'Clean-up Crew', needed: 3, filled: 1 },
    ]},
    { id: 'sep-30-2026', date: new Date(2026, 8, 30), dateLabel: 'Sept 30, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    // October 2026
    { id: 'oct-7-2026', date: new Date(2026, 9, 7), dateLabel: 'Oct 7, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'oct-14-2026', date: new Date(2026, 9, 14), dateLabel: 'Oct 14, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'oct-21-2026', date: new Date(2026, 9, 21), dateLabel: 'Oct 21, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'oct-28-2026', date: new Date(2026, 9, 28), dateLabel: 'Oct 28, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    // November 2026
    { id: 'nov-4-2026', date: new Date(2026, 10, 4), dateLabel: 'Nov 4, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'nov-11-2026', date: new Date(2026, 10, 11), dateLabel: 'Nov 11, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'nov-18-2026', date: new Date(2026, 10, 18), dateLabel: 'Nov 18, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'nov-25-2026', date: new Date(2026, 10, 25), dateLabel: 'Nov 25, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ], notes: 'Thanksgiving week - special menu' },
    // December 2026
    { id: 'dec-2-2026', date: new Date(2026, 11, 2), dateLabel: 'Dec 2, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'dec-9-2026', date: new Date(2026, 11, 9), dateLabel: 'Dec 9, 2026', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    // January 2027
    { id: 'jan-6-2027', date: new Date(2027, 0, 6), dateLabel: 'Jan 6, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'jan-13-2027', date: new Date(2027, 0, 13), dateLabel: 'Jan 13, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'jan-20-2027', date: new Date(2027, 0, 20), dateLabel: 'Jan 20, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'jan-27-2027', date: new Date(2027, 0, 27), dateLabel: 'Jan 27, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    // February 2027
    { id: 'feb-3-2027', date: new Date(2027, 1, 3), dateLabel: 'Feb 3, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'feb-10-2027', date: new Date(2027, 1, 10), dateLabel: 'Feb 10, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'feb-17-2027', date: new Date(2027, 1, 17), dateLabel: 'Feb 17, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'feb-24-2027', date: new Date(2027, 1, 24), dateLabel: 'Feb 24, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    // March 2027
    { id: 'mar-3-2027', date: new Date(2027, 2, 3), dateLabel: 'Mar 3, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'mar-10-2027', date: new Date(2027, 2, 10), dateLabel: 'Mar 10, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'mar-17-2027', date: new Date(2027, 2, 17), dateLabel: 'Mar 17, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'mar-24-2027', date: new Date(2027, 2, 24), dateLabel: 'Mar 24, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    // April 2027
    { id: 'apr-14-2027', date: new Date(2027, 3, 14), dateLabel: 'Apr 14, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ], notes: 'Holy Week schedule - check bulletin' },
    { id: 'apr-21-2027', date: new Date(2027, 3, 21), dateLabel: 'Apr 21, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'apr-28-2027', date: new Date(2027, 3, 28), dateLabel: 'Apr 28, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    // May 2027
    { id: 'may-5-2027', date: new Date(2027, 4, 5), dateLabel: 'May 5, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'may-12-2027', date: new Date(2027, 4, 12), dateLabel: 'May 12, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ]},
    { id: 'may-19-2027', date: new Date(2027, 4, 19), dateLabel: 'May 19, 2027', sponsor: null, sponsored: false, roles: [
        { name: 'Grocery Pick-up', needed: 1, filled: 0 },
        { name: 'Food Prep', needed: 3, filled: 0 },
        { name: 'Food Server', needed: 3, filled: 0 },
        { name: 'Clean-up Crew', needed: 3, filled: 0 },
    ], notes: 'End of year celebration!' },
];

// Group weeks by month
const monthGroups: MonthGroup[] = (() => {
    const groups: Record<string, MonthGroup> = {};
    allWeeks.forEach(week => {
        const monthName = week.date.toLocaleString('default', { month: 'long' });
        const key = `${monthName}-${week.date.getFullYear()}`;
        if (!groups[key]) {
            groups[key] = {
                month: monthName,
                year: week.date.getFullYear(),
                weeks: [],
            };
        }
        groups[key].weeks.push(week);
    });
    return Object.values(groups);
})();

export default function WednesdaySupper() {
    const [expandedMonth, setExpandedMonth] = useState<string>('September-2026');
    const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

    const totalWeeks = allWeeks.length;
    const sponsoredWeeks = allWeeks.filter(w => w.sponsored).length;
    const totalRolesNeeded = allWeeks.reduce(
        (sum, w) => sum + w.roles.reduce((s, r) => s + r.needed, 0),
        0
    );
    const totalRolesFilled = allWeeks.reduce(
        (sum, w) => sum + w.roles.reduce((s, r) => s + r.filled, 0),
        0
    );

    const openForm = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="pt-[69px]" />

            {/* Hero */}
            <section className="relative py-20 bg-[#fbfaf6] border-b border-primary/10 overflow-hidden">
                <div className="container mx-auto px-4">
                    <Link href="/get-involved">
                        <a className="inline-flex items-center gap-2 text-primary/60 hover:text-accent transition-colors mb-6 font-bold uppercase tracking-widest text-xs">
                            <ArrowLeft size={16} /> Back to All Opportunities
                        </a>
                    </Link>
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3">
                            Parish Hospitality
                        </p>
                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                            Wednesday Night Supper
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Every Wednesday during the school year, our parish family gathers for supper from 5:30-6:00 PM before Faith Formation classes. Sponsor a week for $200, or sign up to help with grocery pick-up, food prep, serving, or cleanup.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-primary text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-4xl font-serif font-bold text-accent">{sponsoredWeeks}/{totalWeeks}</p>
                            <p className="text-xs uppercase tracking-widest text-white/60 mt-1">Weeks Sponsored</p>
                        </div>
                        <div>
                            <p className="text-4xl font-serif font-bold text-accent">{totalRolesFilled}/{totalRolesNeeded}</p>
                            <p className="text-xs uppercase tracking-widest text-white/60 mt-1">Volunteer Roles Filled</p>
                        </div>
                        <div>
                            <p className="text-4xl font-serif font-bold text-accent">$200</p>
                            <p className="text-xs uppercase tracking-widest text-white/60 mt-1">Per Week to Sponsor</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-grow py-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mb-12 justify-center">
                        <Button
                            onClick={() => openForm(FORM_URLS.contribute)}
                            className="bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg"
                        >
                            <Heart size={16} className="mr-2" /> Sponsor a Week
                        </Button>
                        <Button
                            onClick={() => openForm(FORM_URLS.signUpToHelp)}
                            variant="outline"
                            className="px-8 py-6 font-bold uppercase tracking-widest border-2"
                        >
                            <Users size={16} className="mr-2" /> Sign Up to Volunteer
                        </Button>
                    </div>

                    {/* Month Accordion */}
                    <div className="space-y-4">
                        {monthGroups.map(group => {
                            const monthKey = `${group.month}-${group.year}`;
                            const isExpanded = expandedMonth === monthKey;
                            const monthSponsored = group.weeks.filter(w => w.sponsored).length;
                            const monthTotal = group.weeks.length;
                            const monthPct = (monthSponsored / monthTotal) * 100;

                            return (
                                <div key={monthKey} className="bg-white rounded-2xl border-2 border-primary/10 overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setExpandedMonth(isExpanded ? '' : monthKey)}
                                        className="w-full p-6 flex items-center justify-between hover:bg-primary/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <Calendar className="text-accent shrink-0" size={24} />
                                            <div className="text-left flex-1 min-w-0">
                                                <h2 className="font-serif text-2xl font-bold text-primary">
                                                    {group.month} {group.year}
                                                </h2>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {monthSponsored} of {monthTotal} weeks sponsored
                                                </p>
                                            </div>
                                            <div className="hidden sm:block w-32">
                                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400 transition-all"
                                                        style={{ width: `${monthPct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {isExpanded ? <ChevronUp className="text-primary/40 ml-2 shrink-0" /> : <ChevronDown className="text-primary/40 ml-2 shrink-0" />}
                                    </button>

                                    {isExpanded && (
                                        <div className="border-t border-primary/10 p-6 space-y-3 bg-gray-50/50">
                                            {group.weeks.map(week => {
                                                const isWeekExpanded = expandedWeek === week.id;
                                                const weekRolesFilled = week.roles.reduce((s, r) => s + r.filled, 0);
                                                const weekRolesNeeded = week.roles.reduce((s, r) => s + r.needed, 0);
                                                const weekPct = weekRolesNeeded > 0 ? (weekRolesFilled / weekRolesNeeded) * 100 : 0;

                                                return (
                                                    <div key={week.id} className="bg-white rounded-xl border border-primary/10 overflow-hidden">
                                                        <button
                                                            onClick={() => setExpandedWeek(isWeekExpanded ? null : week.id)}
                                                            className="w-full p-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                <div className={`shrink-0 size-10 rounded-full flex items-center justify-center font-bold text-sm ${week.sponsored ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                    {week.date.getDate()}
                                                                </div>
                                                                <div className="text-left flex-1 min-w-0">
                                                                    <p className="font-bold text-primary">{week.dateLabel}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {week.sponsored
                                                                            ? `Sponsored by ${week.sponsor}`
                                                                            : 'Available to sponsor'}
                                                                    </p>
                                                                </div>
                                                                <div className="hidden md:flex items-center gap-3 text-xs shrink-0">
                                                                    <div className="text-right">
                                                                        <p className="font-bold text-primary">{weekRolesFilled}/{weekRolesNeeded}</p>
                                                                        <p className="text-[10px] text-muted-foreground uppercase">Roles</p>
                                                                    </div>
                                                                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full transition-all ${week.sponsored ? 'bg-amber-400' : 'bg-rose-400'}`}
                                                                            style={{ width: `${weekPct}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {isWeekExpanded ? <ChevronUp className="text-primary/40 ml-2 shrink-0" size={18} /> : <ChevronDown className="text-primary/40 ml-2 shrink-0" size={18} />}
                                                        </button>

                                                        {isWeekExpanded && (
                                                            <div className="border-t border-primary/10 p-6 space-y-4 bg-gray-50/30">
                                                                {week.notes && (
                                                                    <div className="rounded-xl bg-accent/5 border border-accent/20 p-3 text-sm text-primary">
                                                                        <span className="font-bold">Note:</span> {week.notes}
                                                                    </div>
                                                                )}

                                                                {/* Sponsor Status */}
                                                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                                    <div>
                                                                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Sponsor</p>
                                                                        <p className="text-sm font-bold text-primary mt-1">
                                                                            {week.sponsored ? week.sponsor : 'Available — $200'}
                                                                        </p>
                                                                    </div>
                                                                    {!week.sponsored && (
                                                                        <Button
                                                                            onClick={() => openForm(FORM_URLS.contribute)}
                                                                            size="sm"
                                                                            className="bg-accent hover:bg-accent/90 text-white text-xs font-bold uppercase tracking-widest"
                                                                        >
                                                                            Sponsor
                                                                        </Button>
                                                                    )}
                                                                </div>

                                                                {/* Roles */}
                                                                <div>
                                                                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">
                                                                        Volunteer Roles ({weekRolesFilled}/{weekRolesNeeded} filled)
                                                                    </p>
                                                                    <div className="space-y-2">
                                                                        {week.roles.map(role => {
                                                                            const rolePct = (role.filled / role.needed) * 100;
                                                                            const isFull = role.filled >= role.needed;
                                                                            return (
                                                                                <div key={role.name} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100">
                                                                                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${isFull ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                                                                                        {roleIcons[role.name]}
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <div className="flex items-center justify-between mb-1">
                                                                                            <p className="text-sm font-bold text-primary">{role.name}</p>
                                                                                            <p className="text-xs text-muted-foreground">
                                                                                                {role.filled}/{role.needed}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                                            <div
                                                                                                className={`h-full transition-all ${isFull ? 'bg-green-400' : 'bg-rose-400'}`}
                                                                                                style={{ width: `${rolePct}%` }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    {!isFull && (
                                                                                        <Button
                                                                                            onClick={() => openForm(FORM_URLS.signUpToHelp)}
                                                                                            size="sm"
                                                                                            variant="outline"
                                                                                            className="text-xs font-bold uppercase tracking-widest shrink-0"
                                                                                        >
                                                                                            Sign Up
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Contact */}
                    <div className="mt-16 text-center bg-white p-8 rounded-2xl border border-primary/10">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Questions?</p>
                        <p className="text-lg font-bold text-primary mb-1">Parish Office</p>
                        <a href="tel:6058675309" className="inline-flex items-center gap-2 text-accent hover:underline">
                            <Phone size={14} /> (605) 867-5309
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
