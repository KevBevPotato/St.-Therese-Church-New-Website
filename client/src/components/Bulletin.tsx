import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import {
    Calendar,
    FileText,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import BulletinView, {
    Bulletin as BulletinType,
    BulletinSection,
    defaultContactInfo,
} from './BulletinView';
import {
    getCurrentWeekRange,
    getPdfUrlForWeek,
    formatBulletinRange,
} from '@/data/bulletins';

/**
 * Bulletin Page - Current Week
 * Auto-resolves the bulletin period based on the current date.
 * Rollover: every Saturday at 00:00 (start of Sat).
 *
 * Section data is sourced from the August 8-9, 2026 bulletin PDF
 * until per-week content management is introduced.
 */

// ====== Types ======
interface MassTime {
    day: string;
    time: string;
}

interface MassIntention {
    day: string;
    time: string;
    intention: string;
}

interface LiturgicalRole {
    role: string;
    name: string;
}

interface LiturgicalSchedule {
    day: string;
    time: string;
    roles: LiturgicalRole[];
}

interface Sponsor {
    name: string;
    category: string;
}

// ====== Mass Times ======
const massTimesData: MassTime[] = [
    { day: 'Saturday', time: '4:30 pm' },
    { day: 'Sunday', time: '9:00 am' },
    { day: 'Sunday', time: '5:30 pm' },
];

// ====== Mass Intentions ======
const massIntentionsData: MassIntention[] = [
    { day: 'Monday, Aug 10', time: '7:30 am', intention: 'Cheryl Feist Merritt †' },
    { day: 'Tuesday, Aug 11', time: '7:30 am', intention: 'Mike & Patricia Christ' },
    { day: 'Wednesday, Aug 12', time: '7:30 am', intention: 'For Life' },
    { day: 'Thursday, Aug 13', time: '7:30 am', intention: 'Don Wieseler' },
    { day: 'Friday, Aug 14', time: '7:30 am', intention: 'Victoria Bantam' },
    { day: 'Friday, Aug 14', time: '5:30 pm', intention: 'Mary Wagner †' },
    { day: 'Saturday, Aug 15', time: '8:00 am', intention: 'Parishioners' },
    { day: 'Saturday, Aug 15', time: '4:30 pm', intention: 'Lyle Bradford †' },
    { day: 'Sunday, Aug 16', time: '9:00 am', intention: 'Gordon Milam †' },
    { day: 'Sunday, Aug 16', time: '5:30 pm', intention: 'Parishioners' },
];

// ====== Liturgical Schedule ======
const liturgicalScheduleData: LiturgicalSchedule[] = [
    {
        day: 'Saturday, August 15 at 4:30 pm',
        time: 'E.M.',
        roles: [
            { role: 'EM', name: 'Tim & Joan Renelt (s)' },
            { role: 'Deacon', name: 'Deacon' },
            { role: 'Lector', name: 'Kevin & Kris Miller' },
            { role: 'Ushers', name: 'Mac Caldwell, Will Dixon, Tim Shull, Dick Cuka' },
            { role: 'Altar Server', name: 'Mercedes James & John Solano' },
        ],
    },
    {
        day: 'Sunday, August 16 at 9:00 am',
        time: 'E.M.',
        roles: [
            { role: 'EM', name: 'Ginny Dejager (s), Paul Schneider' },
            { role: 'Deacon', name: 'Deacon' },
            { role: 'Lector', name: 'Howard Steiner, Joan Solano' },
            { role: 'Ushers', name: 'Jason Gorman, Dave Fletcher, Kent French, one needed' },
            { role: 'Altar Server', name: 'Robyn Myers, Dixon Hezelman' },
        ],
    },
    {
        day: 'Sunday, August 16 at 5:30 pm',
        time: 'E.M.',
        roles: [
            { role: 'EM', name: 'R.J. Puhle Heintz (s only)' },
            { role: 'Deacon', name: 'Deacon' },
            { role: 'Lector', name: 'Kelly Sutko' },
            { role: 'Ushers', name: 'Jeff Cook, Bill & Jan Winegar, one needed' },
            { role: 'Altar Server', name: 'Camden Walker' },
        ],
    },
];

// ====== New Parishioners ======
const newParishionersData = [
    { name: 'Tom and Marie DRAKES' },
];

// ====== Sponsors ======
const sponsorsData: Sponsor[] = [
    { name: 'Behrens Wilson Funeral Home', category: 'Funeral Services' },
    { name: 'DeDonat & Biggar, Ltd.', category: 'Cremation Services' },
    { name: 'Rapid City Medical Center', category: 'Medical' },
    { name: 'Will Dixon Real Estate', category: 'Real Estate' },
    { name: 'Kirk Appliances', category: 'Appliances' },
    { name: 'Spitzer Creative', category: 'Creative Services' },
    { name: 'Midwest Dumpsters LLC', category: 'Waste Management' },
    { name: 'Black Hills Funeral Home & Crematory', category: 'Funeral Services' },
    { name: 'Carpenter Dental', category: 'Dental' },
    { name: 'Dakota Dental Plus', category: 'Dental' },
    { name: 'Evans Orthodontics', category: 'Orthodontics' },
    { name: 'Rushmore Storage', category: 'Storage' },
    { name: 'Moon Stone Landscaping', category: 'Landscaping' },
    { name: 'Rangel Construction Company LLC', category: 'Construction' },
    { name: 'Mustard Seed Storage', category: 'Storage' },
];

// ====== Announcements ======
const announcementsData = [
    {
        title: 'Welcome Reception & Parish Picnic',
        description: 'Join us for a celebration of thanks and welcome to Father Mark & Father Todd on Sunday, August 16th at noon in the Parish Hall. Knights of Columbus will provide the main course. Drinks, plates, napkins & utensils provided. Please bring a side dish and/or dessert to share!',
    },
    {
        title: 'Fall Festival Planning Meeting',
        description: 'Sunday, August 9 at 10:15 am. Everyone is encouraged to attend and offer ideas/suggestions. Hope to see you there!',
    },
    {
        title: 'Family Rosary',
        description: 'Every Sunday at 7 pm. Everyone welcome!',
    },
    {
        title: 'Knights of Columbus Meeting',
        description: 'Monday, August 10th at 7 pm. Contact Grand Knight Doug Keyser or any KC if interested in becoming a Knight.',
    },
    {
        title: "Widow's Social Group Lunch",
        description: 'Wednesday, August 12 at 11:30 am at Armadillos (downtown). All widows welcome!',
    },
    {
        title: 'St. Vincent de Paul Pizza Ranch Fundraiser',
        description: 'Monday, August 10th from 5 to 8 pm. Please help to raise money to support those in need by coming to enjoy a pizza ranch buffet dinner. We appreciate your support!',
    },
    {
        title: 'O.C.I.A. Inquiry Night',
        description: 'August 24 or 31 at 6:30 pm in Room 103 at St. Therese Church. First class September 14 at 6:30 pm. Contact Anthony Flores at 605-484-3190.',
    },
    {
        title: 'EPIC Wednesday Evenings',
        description: 'Starting September 16th, 6 to 7:45 pm. Explore the people, places, and events that shaped our Catholic Church history. Contact Melanie at 605-342-1556 ext 5 or 605-430-0459.',
    },
    {
        title: 'Becoming One Marriage Retreat',
        description: 'September 4-6. Register at rapidcitydiocese.org/becomingone. Discover practical ways to strengthen your marriage.',
    },
    {
        title: "Bishop's Golf Classic",
        description: 'Monday, August 31 at Arrowhead Country Club. Registration 11 am, shotgun start noon. Scan to register online or call 605-721-6843.',
    },
];

// ====== Contributions ======
const contributionsData = {
    checkCollections: '$9,256.00',
    cashCollections: '$2,793.25',
    buildingImprovements: '$96.00',
    plantMinistry: '$5.00',
    familiesInNeed: '$200.00',
    facilityUseDonation: '$200.00',
    priestRetirementFund: '$257.00',
    seminarianFund: '$10.00',
    electronicTithing: '$1,329.25',
    heatCoolingGiving: '$50.00',
    familiesInNeedGiving: '$20.55',
    priestRetirementFundGiving: '$10.00',
    votiveCandle: '$72.00',
    total: '$14,310.05',
    weeklyNeeded: '$16,500.00',
};

// ====== Prayer List ======
const prayerListData = [
    'Elijah recognized the voice of God not in the strong and heavy wind, not in the earthquake, not in the fire, but in a tiny whispering sound. May we find enough quiet in our tumultuous world to hear His voice and discern what He is calling us to do each day.',
    'Please add Chris Gerken and Nancy Palmer to your prayers.',
    'Lynne Carlson - Rest in Peace',
];

// ====== Section Definitions ======
const bulletinSections: BulletinSection[] = [
    {
        id: 'mass-times',
        label: 'Mass Times',
        content: (
            <div className="space-y-3">
                {massTimesData.map((mass, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0">
                        <span className="font-semibold text-primary">{mass.day}</span>
                        <span className="text-muted-foreground">{mass.time}</span>
                    </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2 italic">Reconciliation: Saturday 3-4 pm, Sunday 8 am & 4:30 pm or by appointment</p>
            </div>
        ),
    },
    {
        id: 'announcements',
        label: 'Announcements',
        content: (
            <div className="space-y-4">
                {announcementsData.map((announcement, idx) => (
                    <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                        <h5 className="font-bold text-primary mb-1">{announcement.title}</h5>
                        <p className="text-sm text-muted-foreground">{announcement.description}</p>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'new-parishioners',
        label: 'New Parishioners',
        content: (
            <div className="space-y-2">
                {newParishionersData.map((parishioner, idx) => (
                    <div key={idx} className="pb-2 border-b border-gray-100 last:border-0">
                        <p className="text-sm text-primary font-semibold">{parishioner.name}</p>
                        <p className="text-xs text-muted-foreground">Welcome to our parish family!</p>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'mass-intentions',
        label: 'Mass Intentions',
        content: (
            <div className="space-y-2">
                {massIntentionsData.map((intention, idx) => (
                    <div key={idx} className="pb-2 border-b border-gray-100 last:border-0">
                        <p className="text-xs font-bold text-primary uppercase">{intention.day} at {intention.time}</p>
                        <p className="text-sm text-muted-foreground">{intention.intention}</p>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'daily-scriptures',
        label: 'Daily Scriptures',
        content: (
            <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Sunday:</strong> Jn 6:41-51</p>
                <p><strong>Monday:</strong> 2 Cor 12:1-4</p>
                <p><strong>Tuesday:</strong> Ez 2:8-3:4</p>
                <p><strong>Wednesday:</strong> Ez 12:1-12</p>
                <p><strong>Thursday:</strong> Ez 12:1-12</p>
                <p><strong>Friday:</strong> Ez 16:1-15,60,63</p>
                <p><strong>Saturday:</strong> Rv 11:19a; 12:1-6a, 10ab</p>
                <p className="text-xs pt-2 italic">See Daily Mass Times Here for complete readings</p>
            </div>
        ),
    },
    {
        id: 'lectors',
        label: 'Lectors',
        content: (
            <div className="space-y-3">
                {liturgicalScheduleData.map((schedule, idx) => (
                    <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                        <p className="text-xs font-bold text-primary uppercase mb-2">{schedule.day}</p>
                        <div className="space-y-1">
                            {schedule.roles
                                .filter((r) => r.role === 'Lector')
                                .map((role, ridx) => (
                                    <p key={ridx} className="text-sm text-muted-foreground">
                                        <strong>{role.role}:</strong> {role.name}
                                    </p>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'ushers',
        label: 'Ushers',
        content: (
            <div className="space-y-3">
                {liturgicalScheduleData.map((schedule, idx) => (
                    <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                        <p className="text-xs font-bold text-primary uppercase mb-2">{schedule.day}</p>
                        <div className="space-y-1">
                            {schedule.roles
                                .filter((r) => r.role === 'Ushers')
                                .map((role, ridx) => (
                                    <p key={ridx} className="text-sm text-muted-foreground">
                                        <strong>{role.role}:</strong> {role.name}
                                    </p>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'altar-servers',
        label: 'Altar Servers',
        content: (
            <div className="space-y-3">
                {liturgicalScheduleData.map((schedule, idx) => (
                    <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                        <p className="text-xs font-bold text-primary uppercase mb-2">{schedule.day}</p>
                        <div className="space-y-1">
                            {schedule.roles
                                .filter((r) => r.role === 'Altar Server')
                                .map((role, ridx) => (
                                    <p key={ridx} className="text-sm text-muted-foreground">
                                        <strong>{role.role}:</strong> {role.name}
                                    </p>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'contributions',
        label: 'Contributions',
        content: (
            <div className="space-y-2 text-sm">
                <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-muted-foreground">Check Collections</span>
                    <span className="font-semibold text-primary">{contributionsData.checkCollections}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-muted-foreground">Cash Collections</span>
                    <span className="font-semibold text-primary">{contributionsData.cashCollections}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-muted-foreground">Building Improvements</span>
                    <span className="font-semibold text-primary">{contributionsData.buildingImprovements}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-gray-100">
                    <span className="text-muted-foreground">Electronic Tithing</span>
                    <span className="font-semibold text-primary">{contributionsData.electronicTithing}</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-primary">
                    <span>Total</span>
                    <span>{contributionsData.total}</span>
                </div>
                <p className="text-xs text-accent font-bold pt-2">Weekly Amount Needed: {contributionsData.weeklyNeeded}</p>
            </div>
        ),
    },
    {
        id: 'prayer-list',
        label: 'Prayer List',
        content: (
            <div className="space-y-3">
                {prayerListData.map((item, idx) => (
                    <div key={idx} className="pb-2 border-b border-gray-100 last:border-0">
                        <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'a-little-laugh',
        label: 'A Little Laugh',
        content: (
            <div className="space-y-3">
                <div className="pb-3 border-b border-gray-100">
                    <p className="text-sm text-muted-foreground italic">
                        Connie said in staff meeting, "Did you hear about the new garlic diet? You don't lose much weight, but from a distance, friends think you look thinner."
                    </p>
                </div>
                <div className="pb-3 border-b border-gray-100">
                    <p className="text-sm text-muted-foreground italic">What is orange and sounds like a parrot? A carrot.</p>
                </div>
                <div className="pb-3 border-b border-gray-100">
                    <p className="text-sm text-muted-foreground italic">What do you call a dog that does magic tricks? A labracadabrador.</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground italic">What do you call a French man wearing sandals? Phillipe Phillop.</p>
                </div>
            </div>
        ),
    },
    {
        id: 'needs',
        label: 'Needs',
        content: (
            <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                    <h5 className="font-bold text-primary mb-1">Helping Hands Donation Needs</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Pregnancy Support: Volunteers needed (not accepting diapers at this time but need baby care products, clothing, maternity wear)</li>
                        <li>Church Response: Non-perishable food items and laundry soap</li>
                        <li>Momma's Closet: Size 3-7 diapers, pull-ups & wipes, baby formula, new books, coloring books & markers/crayons</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-primary mb-1">Volunteers Needed</h5>
                    <p>St. Therese parishioners are amazing and generous. Truly thank you for your time and talents!</p>
                </div>
            </div>
        ),
    },
    {
        id: 'sponsors',
        label: 'Sponsors',
        content: (
            <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3 font-semibold">Please let these advertisers know you saw their ad in the bulletin!</p>
                <div className="grid grid-cols-2 gap-2">
                    {sponsorsData.map((sponsor, idx) => (
                        <div key={idx} className="pb-2 border-b border-gray-100 last:border-0">
                            <p className="text-sm font-semibold text-primary">{sponsor.name}</p>
                            <p className="text-xs text-muted-foreground">{sponsor.category}</p>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
];

// ====== Build bulletin for current week ======
function buildBulletinForRange(start: Date, end: Date): BulletinType {
    return {
        id: formatBulletinRange(start, end),
        week: formatBulletinRange(start, end),
        startDate: start,
        endDate: end,
        pdfUrl: getPdfUrlForWeek(start),
        sections: bulletinSections,
    };
}

export default function Bulletin() {
    const currentRange = getCurrentWeekRange();
    const currentBulletin = buildBulletinForRange(currentRange.start, currentRange.end);

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
            <Header />
            <div className="pt-[69px]" />

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

                        {/* Current week bulletin */}
                        <BulletinView
                            bulletin={currentBulletin}
                            title="This Week's Bulletin"
                            subtitle="Current Week"
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
