import type { BulletinSection } from '@/components/BulletinView';
import { formatDateKey } from '@/data/bulletins';

// --- Types ---
interface MassTime { day: string; time: string; }
interface MassIntention { day: string; time: string; intention: string; }
interface LiturgicalRole { role: string; name: string; }
interface LiturgicalSchedule { day: string; time: string; roles: LiturgicalRole[]; }
interface Sponsor { name: string; category: string; }
interface Need { category: string; items: string; }
interface Announcement { title: string; description: string; }

interface WeekData {
    massTimes: MassTime[];
    announcements: Announcement[];
    newParishioners: { name: string }[];
    massIntentions: MassIntention[];
    dailyScriptures: { day: string; reading: string }[];
    liturgicalSchedule: LiturgicalSchedule[];
    contributions: {
        [key: string]: string;
        total: string;
        weeklyNeeded: string;
    };
    prayerList: string[];
    laughs: string[];
    needs: Need[];
    sponsors: Sponsor[];
}

export interface BulletinWeekContent {
    sections: BulletinSection[];
    hasContent: boolean;
}

// --- Section Builder ---
function buildSections(data: WeekData): BulletinSection[] {
    return [
        {
            id: 'mass-times',
            label: 'Mass Times',
            content: (
                <div className="space-y-3">
                    {data.massTimes.map((mass, idx) => (
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
                    {data.announcements.map((ann, idx) => (
                        <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                            <h5 className="font-bold text-primary mb-1">{ann.title}</h5>
                            <p className="text-sm text-muted-foreground">{ann.description}</p>
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
                    {data.newParishioners.length > 0 ? (
                        data.newParishioners.map((p, idx) => (
                            <div key={idx} className="pb-2 border-b border-gray-100 last:border-0">
                                <p className="text-sm text-primary font-semibold">{p.name}</p>
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
                    {data.massIntentions.map((int, idx) => (
                        <div key={idx} className="pb-2 border-b border-gray-100 last:border-0">
                            <p className="text-xs font-bold text-primary uppercase">{int.day} at {int.time}</p>
                            <p className="text-sm text-muted-foreground">{int.intention}</p>
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
                    {data.dailyScriptures.map((s, idx) => (
                        <p key={idx}><strong className="text-primary">{s.day}:</strong> {s.reading}</p>
                    ))}
                </div>
            ),
        },
        {
            id: 'lectors',
            label: 'Lectors',
            content: (
                <div className="space-y-3">
                    {data.liturgicalSchedule.map((sch, idx) => (
                        <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                            <p className="text-xs font-bold text-primary uppercase mb-2">{sch.day}</p>
                            {sch.roles.filter(r => r.role === 'Lector').map((r, ridx) => (
                                <p key={ridx} className="text-sm text-muted-foreground"><strong className="text-primary">{r.role}:</strong> {r.name}</p>
                            ))}
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
                    {data.liturgicalSchedule.map((sch, idx) => (
                        <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                            <p className="text-xs font-bold text-primary uppercase mb-2">{sch.day}</p>
                            {sch.roles.filter(r => r.role === 'Ushers').map((r, ridx) => (
                                <p key={ridx} className="text-sm text-muted-foreground"><strong className="text-primary">{r.role}:</strong> {r.name}</p>
                            ))}
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
                    {data.liturgicalSchedule.map((sch, idx) => (
                        <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                            <p className="text-xs font-bold text-primary uppercase mb-2">{sch.day}</p>
                            {sch.roles.filter(r => r.role === 'Altar Server').map((r, ridx) => (
                                <p key={ridx} className="text-sm text-muted-foreground"><strong className="text-primary">{r.role}:</strong> {r.name}</p>
                            ))}
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
                    {Object.entries(data.contributions)
                        .filter(([key]) => key !== 'total' && key !== 'weeklyNeeded')
                        .map(([key, value]) => (
                            <div key={key} className="flex justify-between pb-1 border-b border-gray-100">
                                <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className="font-semibold text-primary">{value}</span>
                            </div>
                        ))
                    }
                    <div className="flex justify-between pt-2 font-bold text-primary">
                        <span>Total</span>
                        <span>{data.contributions.total}</span>
                    </div>
                    <p className="text-xs text-accent font-bold pt-2">Weekly Amount Needed: {data.contributions.weeklyNeeded}</p>
                </div>
            ),
        },
        {
            id: 'prayer-list',
            label: 'Prayer List',
            content: (
                <div className="space-y-3">
                    {data.prayerList.map((item, idx) => (
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
                    {data.laughs.map((joke, idx) => (
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
                    {data.needs.map((need, idx) => (
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
                        {data.sponsors.map((s, idx) => (
                            <div key={idx} className="pb-2 border-b border-gray-100 last:border-0">
                                <p className="text-sm font-semibold text-primary">{s.name}</p>
                                <p className="text-xs text-muted-foreground">{s.category}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
    ];
}

// --- The Manifest ---

export const bulletinContentManifest: Record<string, BulletinWeekContent> = {
    '2026-09-26': {
        hasContent: true,
        sections: buildSections({
            massTimes: [
                { day: 'Saturday', time: '4:30 pm' },
                { day: 'Sunday', time: '9:00 am' },
                { day: 'Sunday', time: '5:30 pm' },
                { day: 'Monday - Friday', time: '7:30 am' },
                { day: 'Saturday', time: '8:00 am' },
            ],
            announcements: [
                { title: 'Fall Festival', description: 'Sunday, September 27th, 10:30 am to 1:30 pm.' },
                { title: 'Family Rosary', description: 'Every Sunday at 7:00 pm. All welcome!' },
                { title: 'Connect Groups', description: 'Starting Monday, October 19th, 6:00-7:30 pm at the St. Therese Rectory. Contact Kevin Baltzer.' },
                { title: 'Damascus Summer Camp', description: 'Encounter experience for students in grades 6-12. Contact Bobby Myers.' },
                { title: 'World Youth Day 2027', description: 'July 31-August 13, 2027 in Seoul, South Korea. Priority registration deadline Sept 30.' },
                { title: 'Altar Society Meeting', description: 'October 4th at 10:15 am in Room 103.' },
                { title: 'OCIA', description: 'Mondays at 6:30 pm. Contact Anthony Flores.' },
                { title: 'EPIC Journey', description: 'Tuesday evenings 4:00 to 6:00 pm.' },
                { title: 'Parish Pinochle Nights', description: 'Tuesdays 6:00 to 8:30 pm in the North Hall, hosted by the KC.' },
                { title: 'Blessing of the Animals', description: 'Saturday, October 3rd at 2:30 pm.' },
                { title: 'Fall Bazaar', description: 'October 2nd - 4th. Includes Yard Sale, Country Store, and Silent Auction.' },
                { title: '3rd Annual Arts & Crafts Fair', description: 'November 14th, 8 am - 2 pm. Contact Melanie for registration.' },
            ],
            newParishioners: [
                { name: 'Simeon BALL (Baptism)' },
                { name: 'Anthony WITTMANN (Baptism)' },
                { name: 'Deanne GRIBBLE' },
            ],
            massIntentions: [
                { day: 'Monday', time: '7:30 am', intention: 'Bruce Cook †' },
                { day: 'Tuesday', time: '7:30 am', intention: 'Eugene & Ann Keller †' },
                { day: 'Wednesday', time: '7:30 am', intention: 'Jerry Gutierrez †' },
                { day: 'Thursday', time: '7:30 am', intention: 'Gary McKinney †' },
                { day: 'Friday', time: '7:30 am', intention: 'Willie Sauer †' },
                { day: 'Saturday', time: '8:00 am', intention: 'Jack Tomac' },
                { day: 'Saturday', time: '4:30 pm', intention: 'Carrol Krause †' },
                { day: 'Sunday', time: '9:00 am', intention: 'Patty Fuegan †' },
                { day: 'Sunday', time: '5:30 pm', intention: 'Parishioners' },
            ],
            dailyScriptures: [
                { day: 'Monday', reading: 'Jb 1:6-22, Ps 17:1b-3,6-7, Lk 9:46-50' },
                { day: 'Tuesday', reading: 'Dn 7:9-10,13-14, Ps 138:1-5, Jn 1:47-51' },
                { day: 'Wednesday', reading: 'Jb 9:1-12,14-16, Ps 88:10b-15, Lk 9:57-62' },
                { day: 'Thursday', reading: 'Jb 19:21-27, Ps 27:7-9c, 13-14, Lk 10:1-12' },
                { day: 'Friday', reading: 'Jb 38:1,12-21;40:3-5, Ps 139:1-3,7-10,13-14b, Mt 18:1-5,10' },
                { day: 'Saturday', reading: 'Jb 42:1-3,5-6,12-17, Ps 119:66,71,75,91,125,130, Lk 10:17-24' },
                { day: 'Sunday', reading: 'Is 5:1-7, Ps 80:9,12-16,19-20, Phil 4:6-9, Mt 21:33-43' },
            ],
            liturgicalSchedule: [
                {
                    day: 'Saturday, Oct 3',
                    time: '4:30 pm',
                    roles: [
                        { role: 'Lector', name: 'Jim Blackwell, Bob Case' },
                        { role: 'Ushers', name: 'Bob & Kay Olson, Jim & Roxie Quintus' },
                        { role: 'Altar Server', name: 'Mercedes, James & John Solano' },
                    ],
                },
                {
                    day: 'Sunday, Oct 4',
                    time: '9:00 am',
                    roles: [
                        { role: 'Lector', name: 'Knights of Columbus' },
                        { role: 'Ushers', name: 'Knights of Columbus' },
                        { role: 'Altar Server', name: 'Knights of Columbus' },
                    ],
                },
                {
                    day: 'Sunday, Oct 4',
                    time: '5:30 pm',
                    roles: [
                        { role: 'Lector', name: 'Pat McDowell' },
                        { role: 'Ushers', name: 'Jeff Cook, Bill & Jan Winegar, ONE NEEDED' },
                        { role: 'Altar Server', name: 'Pete Lien' },
                    ],
                },
            ],
            contributions: {
                generalOtherFunds: '$4,625.00',
                buildingImprovements: '$2,639.56',
                elevatorFund: '$31.00',
                checkCollections: '$850.00',
                cashCollections: '$200.00',
                newPriestVestments: '$183.00',
                fallFestivalDonations: '$782.00',
                fallFestivalRaffle: '$200.00',
                craftFairBoothRentals: '$500.00',
                maryMitchellMemorial: '$250.00',
                copierMaintenance: '$350.00',
                reRegistration: '$14.00',
                plantMinistry: '$16.00',
                priestRetirementFund: '$1,150.00',
                seminarianFund: '$5,158.72',
                electronicTithing: '$421.00',
                buildingFundEGiving: '$83.00',
                heatCoolingEGiving: '$51.38',
                familiesInNeedEGiving: '$50.00',
                priestRetirementFundEGiving: '$70.55',
                votiveCandleIncome: '$20.00',
                seminarianFundEGiving: '$118.40',
                total: '$17,738.61',
                weeklyNeeded: '$16,500',
            },
            prayerList: [
                'Special Requests: Chris Wehrle',
                'Rest In Peace: Cecil McDaniels',
                'Bulletin List: Alisha Divis Arch, Karen B., Billie Begley, Fred Berendse, Milferd Best, Mark Biggs, Addie Carroll, Mary Czerwonka, Sue Fennel, Mary Fleming, Angela Fraser, Diane Fraser, London Fraser, Steve Fuhrmann, Chris Gerken, Pauline Gyver, Heidi, Judy Hellman, Keith Karp, Kelsey, Marlene Kleckner, Fr. Brian Lane, Ben Lang, Lynn, Joe Martin, Elaine Paulson, Rosie Ortega, Nancy Palmer, Renee Pansch, Tom Parson, Isla Pearl, Curtis Peterson, Faye Peterson, David Romig, Daniel Salvino, Carol Schneider, Clarence Schumacher, Pat Silbernagel, Jim Snyder, Floyd Sperlich, Butch Thomas, Joyce Thome, Donalee Tillitt, Jack Tomac, Dean Tubandt, Dcn. Jim Van Loan, Ray Wagner, Carol Waliser, Chris Wehrle, William Wehrle, Fred Welsch, Diane Wilkinson, Larry Willis, Liz Willis, Bobbi Wurnig, Letha Wynia',
            ],
            laughs: [
                'What\'s blue and not very heavy? Light blue.',
                'Who is the patron saint of copying people in emails? St. Francis of a Cc.',
                'The story of Roy and his "porch" that turned out to be a Ferrari.',
            ],
            needs: [
                { category: 'Birthright Pregnancy Support', items: 'Newborn-6 mo. baby-care products, clothing, & maternity wear. Volunteers needed!' },
                { category: 'Church Response', items: 'Non-perishable food: pork n beans, pasta & rice a\'ronis, canned vegetables, shampoo/conditioner.' },
                { category: 'Mommy\'s Closet', items: 'Size 3 to 7 diapers, pull ups & wipes, baby formula, new car seats, children\'s books/activity books.' },
                { category: 'General', items: 'Puzzle books, adult/kid coloring books & markers/crayons.' },
            ],
            sponsors: [
                { name: 'Behrens Wilson Funeral Home', category: 'Funeral Services' },
                { name: 'First Stop Guns', category: 'Guns & Accessories' },
                { name: 'Jolly Lane Greenhouse', category: 'Greenhouse' },
                { name: 'Spizzirri Creative', category: 'Print & Art' },
                { name: 'Midwest Dumpsters LLC', category: 'Waste Management' },
                { name: 'Black Hills Exteriors', category: 'Roofing & Siding' },
                { name: 'Dubba\'s Electric Service', category: 'Electrical' },
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
                { name: 'Love Begins in the Kitchen', category: 'Restaurant' },
                { name: 'Rangel Construction Company', category: 'Construction' },
                { name: 'We Still Cook Restaurant', category: 'Restaurant' },
            ],
        }),
    },
    '2026-10-03': {
        hasContent: true,
        sections: buildSections({
            massTimes: [],
            announcements: [
                { title: 'Welcome to October', description: 'Upcoming events for October will appear here!' },
            ],
            newParishioners: [],
            massIntentions: [],
            dailyScriptures: [],
            liturgicalSchedule: [],
            contributions: { total: '$0.00', weeklyNeeded: '$16,500' },
            prayerList: [],
            laughs: [],
            needs: [],
            sponsors: [],
        }),
    },
};

export function getBulletinContentForWeek(startDate: Date): BulletinWeekContent {
    const targetKey = formatDateKey(startDate);
    return bulletinContentManifest[targetKey] ?? {
        sections: [],
        hasContent: false,
    };
}
