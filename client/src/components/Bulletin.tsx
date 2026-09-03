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

// ====== Announcements ======
const announcementsData = [
    {
        title: 'Fall Kick-Off at Main St. Square',
        description: 'September 2nd: 4:30 pm Social, 5:30 pm Mass, 6:30 pm Picnic Dinner. All welcome!',
    },
    {
        title: 'Faith Formation Kick-Off',
        description: 'Starts Wednesday, Sept 9th with a Parish Potluck and Meet & Greet with Teachers. Classes for all ages at 6:15 pm.',
    },
    {
        title: 'First KC Breakfast',
        description: 'Sunday, Sept 13th, 8 am until all served after the 9 am Mass.',
    },
    {
        title: 'OCIA Informational Gathering',
        description: 'August 31st at 6:30 pm in Room 103. First class begins September 14th at 6:30 pm.',
    },
    {
        title: 'St. Therese Fall Festival',
        description: 'September 27th, 10:30 am to 1:30 pm. Roast Beef Dinner, Silent Auction, Bake Sale. All proceeds to Building Fund.',
    },
    {
        title: 'EPIC Journey Video Series',
        description: 'Starts Sept 15th, Tuesday evenings 4 to 6 pm. 20-session study of Catholic Church history.',
    },
    {
        title: 'Parish Pinochle Nights',
        description: 'Hosted by the KC’s starting September 22nd, Tuesdays 6 to 8:30 pm in the North Hall.',
    },
    {
        title: 'Altar Society Meeting',
        description: 'September 13th @ 10:15 am in Room 103. All women 18+ are members.',
    },
    {
        title: 'Blood Drive',
        description: 'September 24th from 2:30 to 6 pm. Vitalant Bus will be in the parking lot.',
    },
    {
        title: 'Family Rosary',
        description: 'Every Sunday at 7 pm. All welcome!',
    },
];

// ====== New Parishioners ======
const newParishionersData = []; 

// ====== Mass Intentions ======
const massIntentionsData: MassIntention[] = [
    { day: 'Monday, Aug 31', time: '7:30 am', intention: 'Bruce Cook †' },
    { day: 'Tuesday, Sept 1', time: '7:30 am', intention: 'Larry Cole †' },
    { day: 'Wednesday, Sept 2', time: '7:30 am', intention: 'Willie Sauer †' },
    { day: 'Thursday, Sept 3', time: '7:30 am', intention: 'Cal & Vera Ackerman †' },
    { day: 'Friday, Sept 4', time: '7:30 am', intention: 'Bruce Cook †' },
    { day: 'Saturday, Sept 5', time: '4:30 pm', intention: 'Carrol † & Jo Krause' },
    { day: 'Sunday, Sept 6', time: '9:00 am', intention: 'Chad & Julie Carroll Family Parishioners' },
];

// ====== Daily Scriptures ======
const dailyScripturesData = [
    { day: 'Monday', reading: '1 Cor 2:1-5, Ps 119:97-102, Lk 4:16-30' },
    { day: 'Tuesday', reading: '1 Cor 2:10b-16, Ps 145:8-14, Lk 4:31-37' },
    { day: 'Wednesday', reading: '1 Cor 3:1-9, Ps 33:12-15,20-21, Lk 4:38-44' },
    { day: 'Thursday', reading: '1 Cor 3:18-23, Ps 24:1bc-4ab,5-6, Lk 5:1-11' },
    { day: 'Friday', reading: '1 Cor 4:1-5, Ps 37:3-6,27-28,39-40, Lk 5:33-39' },
    { day: 'Saturday', reading: '1 Cor 4:6b-15, Ps 145:17-21, Lk 6:1-5' },
    { day: 'Sunday', reading: 'Ez 33:7-9, Ps 95:1-2,6-9, Rom 13:8-10, Mt 1:15-0' },
];

// ====== Liturgical Schedule (Lectors, Ushers, Altar Servers) ======
const liturgicalScheduleData: LiturgicalSchedule[] = [
    {
        day: 'Saturday, September 5 at 4:30 pm',
        time: '4:30 pm',
        roles: [
            { role: 'Lector', name: 'Cindy Begley, Carman Timmerman' },
            { role: 'Ushers', name: 'Diane Ange, Will Dixon, Jim & Roxie Quintus' },
            { role: 'Altar Server', name: 'Patti Zephier' },
        ],
    },
    {
        day: 'Sunday, September 6 at 9:00 am',
        time: '9:00 am',
        roles: [
            { role: 'All Ministries', name: 'Knights of Columbus' },
        ],
    },
    {
        day: 'Sunday, September 6 at 5:30 pm',
        time: '5:30 pm',
        roles: [
            { role: 'Lector', name: 'David VanCleave' },
            { role: 'Ushers', name: 'Bill & Jan Winegar, TWO NEEDED' },
            { role: 'Altar Server', name: 'Pete Lien' },
        ],
    },
];

// ====== Contributions ======
// Audited every single line from the financial table
const contributionsData = {
    checkCollections: '$5,433.00',
    cashCollections: '$2,465.02',
    buildingImprovements: '$60.00',
    assumption: '$55.00',
    familiesInNeed: '$500.00',
    adultFormationWordAmongUs: '$25.00',
    plantMinistry: '$25.00',
    priestRetirementFund: '$60.00',
    seminarianFund: '$230.00',
    electronicTithing: '$6,893.45',
    buildingFundEGiving: '$476.69',
    heatCoolingEGiving: '$50.00',
    reRegistrations: '$101.88',
    familiesInNeedEGiving: '$101.38',
    priestRetirementFundEGiving: '$50.00',
    seminarianFundEGiving: '$996.58',
    votiveCandleIncome: '$66.10',
    total: '$17,939.10',
    weeklyNeeded: '$16,500.00',
};

// ====== Prayer List ======
const prayerListData = [
    'Alisha Divis Arch, Karen B., Billie Begley, Fred Berendse, Milferd Best, Mark Biggs, Addie Carroll, Marv Czerwonka, Sue Fennel, Mary Fleming, Angela Fraser, Diane Fraser, Steve Fuhrmann, Chris Gerken, Pauline Gyver, Heidi, Judy Hellman, Keith Karp, Kelsey, Marlene Kleckner, Fr. Brian Lane, Ben Lang, Lynn, Joe Martin, Elaine Paulson, Rosie Ortega, Nancy Palmer, Renee Pansch, Tom Parson, Isla Pearl, Curtis Peterson, Faye Peterson, Carol Schneider, Pat Silbernagel, Jim Snyder, Floyd Sperlich, Butch Thomas, Joyce Thome, Donalee Tillitt, Jack Tomac, Dean Tubandt, Dcn. Jim Van Loan, Ray Wagner, Carol Waliser, William Wehrle, Fred Welsch, Diane Wilkinson, Larry Willis, Liz Willis, Bobbi Wurnig, Letha Wynia',
    'Rest In Peace: Mary Ellen Lynass, Sharon Ormesher, Mary Mitchell, Liane Rausch',
];

// ====== A Little Laugh ======
const laughsData = [
    'Connie said, "I do have washboard abs. They just happen to have a whole lot of laundry on them right now."',
    'I have Attention Deficit Disorder. I get distracted easily because my head..... SHOULDERS, KNEES, AND TOES!! KNEES AND TOES!!',
    'I pulled into the crowded parking lot at the local shopping mall and rolled down the car windows to make sure my Labrador Retriever Pup had fresh air. She was stretched full-out on the back seat and I wanted to impress upon her that she must remain there. I walked to the curb backward, pointing my finger at the car and saying emphatically, "Now you stay. Do you hear me?" "Stay! Stay!" The driver of a nearby car gave me a strange look and said, "Why don\'t you just put it in Park?"',
];

// ====== Needs ======
const needsData = [
    {
        category: 'Birthright Pregnancy Support',
        items: 'Newborn-6 mo. baby-care products, clothing, & maternity wear. (Not accepting diapers currently). Volunteers needed!'
    },
    {
        category: 'Church Response',
        items: 'Non-perishable food: pork n beans, pasta & rice a\'ronis, canned vegetables, and shampoo/conditioner.'
    },
    {
        category: 'Mommy\'s Closet',
        items: 'Size 3 to 7 diapers, pull ups & wipes, baby formula, new (in box) car seats, 6 pk. children\'s books/activity books.'
    },
    {
        category: 'General',
        items: 'Puzzle books and adult/kid coloring books & markers/crayons for city organizations.'
    }
];

// ====== Sponsors ======
const sponsorsData: Sponsor[] = [
    { name: 'Behrens Wilson Funeral Home', category: 'Funeral Services' },
    { name: 'First Stop Guns', category: 'Guns & Accessories' },
    { name: 'Jolly Lane Greenhouse', category: 'Greenhouse' },
    { name: 'Spizzirri Creative', category: 'Print & Art' },
    { name: 'Midwest Dumpsters LLC', category: 'Waste Management' },
    { name: 'Black Hills Exteriors', category: 'Roofing & Siding' },
    { name: 'Jubba\'s Electric Service', category: 'Electrical' },
    { name: 'DeSmet and Biggs, LLP', category: 'Accounting' },
    { name: 'Colonial House Restaurant', category: 'Restaurant' },
    { name: 'Kirk Funeral Home', category: 'Funeral Services' },
    { name: 'Carpenter Dental', category: 'Dental' },
    { name: 'Mel\'s Auto Body & Glass', category: 'Auto Body' },
    { name: 'Ace Steel & Recycling', category: 'Steel & Recycling' },
    { name: 'Dakota Star Federal Credit Union', category: 'Financial' },
    { name: 'Select International Pilgrimage', category: 'Travel' },
    { name: 'Weiland Painting Service', category: 'Painting' },
    { name: 'Dakota Dental', category: 'Dental' },
    { name: 'Rapid City Medical Center', category: 'Medical' },
    { name: 'The Skin Institute', category: 'Dermatology' },
    { name: 'Will Dixon Real Estate', category: 'Real Estate' },
    { name: 'Rapid City Orthodontics', category: 'Orthodontics' },
    { name: 'Evans Orthodontics', category: 'Orthodontics' },
    { name: 'Western South Dakota Catholic Foundation', category: 'Foundation' },
    { name: 'Knights of Columbus', category: 'Financial' },
    { name: 'Rushmore Storage', category: 'Storage' },
    { name: 'Rausch Memorials', category: 'Monuments' },
    { name: 'Mustard Seed Catholic Store', category: 'Retail' },
    { name: 'Moda Stone', category: 'Stone' },
    { name: 'Il Rangel', category: 'Restaurant' },
    { name: 'Rangel Construction Company', category: 'Construction' },
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
                {newParishionersData.length > 0 ? (
                    newParishionersData.map((parishioner, idx) => (
                        <div key={idx} className="pb-2 border-b border-gray-100 last:border-0">
                            <p className="text-sm text-primary font-semibold">{parishioner.name}</p>
                            <p className="text-xs text-muted-foreground">Welcome to our parish family!</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground italic">No new parishioners this week.</p>
                )}
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
                {dailyScripturesData.map((scripture, idx) => (
                    <p key={idx}><strong className="text-primary">{scripture.day}:</strong> {scripture.reading}</p>
                ))}
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
                                        <strong className="text-primary">{role.role}:</strong> {role.name}
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
                                        <strong className="text-primary">{role.role}:</strong> {role.name}
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
                                        <strong className="text-primary">{role.role}:</strong> {role.name}
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
                {/* 
                    Dynamic Loop: This loops through all keys in contributionsData 
                    except 'total' and 'weeklyNeeded' so that every fund is listed automatically.
                */}
                {Object.entries(contributionsData)
                    .filter(([key]) => key !== 'total' && key !== 'weeklyNeeded')
                    .map(([key, value]) => (
                        <div key={key} className="flex justify-between pb-1 border-b border-gray-100">
                            <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-semibold text-primary">{value as string}</span>
                        </div>
                    ))
                }
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
                {laughsData.map((joke, idx) => (
                    <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                        <p className="text-sm text-muted-foreground italic">{joke}</p>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: 'needs',
        label: 'Needs',
        content: (
            <div className="space-y-4 text-sm text-muted-foreground">
                {needsData.map((need, idx) => (
                    <div key={idx}>
                        <h5 className="font-bold text-primary mb-1">{need.category}</h5>
                        <p className="text-sm">{need.items}</p>
                    </div>
                ))}
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
