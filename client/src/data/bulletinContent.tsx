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
                    <p className="text-xs pt-2 italic">See Daily Mass Times Here for complete readings</p>
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
    '2026-08-29': {
        hasContent: true,
        sections: buildSections({
            massTimes: [
                { day: 'Saturday', time: '4:30 pm' },
                { day: 'Sunday', time: '9:00 am' },
                { day: 'Sunday', time: '5:30 pm' },
                { day: 'Monday', time: '7:30 am' },
                { day: 'Tuesday', time: '7:30 am' },
                { day: 'Wednesday', time: '7:30 am' },
                { day: 'Thursday', time: '7:30 am' },
                { day: 'Friday', time: '7:30 am' },
            ],
            announcements: [
                { title: 'Fall Kick-Off at Main St. Square', description: 'September 2nd: 4:30 pm Social, 5:30 pm Mass, 6:30 pm Picnic Dinner.' },
                { title: 'Faith Formation Kick-Off', description: 'Starts Wednesday, Sept 9th with a Parish Potluck.' },
            ],
            newParishioners: [],
            massIntentions: [
                { day: 'Monday, Aug 31', time: '7:30 am', intention: 'Bruce Cook †' },
            ],
            dailyScriptures: [
                { day: 'Monday', reading: '1 Cor 2:1-5, Ps 119:97-102, Lk 4:16-30' },
            ],
            liturgicalSchedule: [],
            contributions: {
                total: '$17,939.10',
                weeklyNeeded: '$16,500.00',
            },
            prayerList: ['Alisha Divis Arch'],
            laughs: ['Joke from August...'],
            needs: [],
            sponsors: [],
        }),
    },
    '2026-09-05': {
        hasContent: true,
        sections: buildSections({
            massTimes: [
                { day: 'Saturday', time: '4:30 pm' },
                { day: 'Sunday', time: '9:00 am' },
                { day: 'Sunday', time: '5:30 pm' },
                { day: 'Monday', time: '7:30 am' },
                { day: 'Tuesday', time: '7:30 am' },
                { day: 'Wednesday', time: '7:30 am' },
                { day: 'Thursday', time: '7:30 am' },
                { day: 'Friday', time: '7:30 am' },
                { day: 'Saturday', time: '8:00 am' },
            ],
            announcements: [
                { title: 'Family Rosary', description: 'Every Sunday at 7:00 pm. All welcome!' },
                { title: 'Labor Day', description: 'Monday, September 7th: 7:30 am Mass (Rosary at 7 am). Office closed.' },
                { title: 'Widow\'s Social Group Lunch', description: 'Wednesday, September 9th at 11:30 am at the FIREHOUSE downtown.' },
                { title: 'Faith Formation for All Ages Kick-Off', description: 'Starts Wednesday, Sept 9th with 5:30 pm Parish Potluck & Meet & Greet.' },
                { title: 'First KC Breakfast of the Season', description: 'Sunday, September 13th, 8:00 am until all served following 9 am Mass.' },
                { title: 'Altar Society Meeting', description: 'Sunday, September 13th at 10:15 am in Room 103.' },
                { title: 'OCIA Begins', description: 'Mondays at 6:00 pm starting September 14th.' },
                { title: 'EPIC Journey Video Series', description: 'Tuesday evenings 4 to 6 pm starting September 15th.' },
                { title: 'Parish Pinochle Nights', description: 'Tuesdays 6 to 8:30 pm starting September 22nd in the North Hall.' },
                { title: 'Blood Drive', description: 'September 24th from 2:30 pm to 6:00 pm.' },
                { title: 'Fall Festival', description: 'Sunday, September 27th, 10:30 am to 1:30 pm. Bring large salad and dessert.' },
                { title: 'Priesthood Sunday', description: 'September 27th: Celebrate and thank our priests.' },
                { title: 'Renewing the Temple Presentation', description: 'Wednesday, September 16th, 6:15-7:30 pm following a 5:30 pm meal.' },
            ],
            newParishioners: [
                { name: 'Dayton & Klaire SEALEY' },
                { name: 'Lyle Josephine "Josie" BYRNE' },
                { name: 'Rowan WINTER' },
                { name: 'Andrew & Angelica WITTMAN' },
                { name: 'Anthony' },
            ],
            massIntentions: [
                { day: 'Monday', time: '7:30 am', intention: 'Joseph Carlin Sr. †' },
                { day: 'Tuesday', time: '7:30 am', intention: 'Don Wieseler' },
                { day: 'Wednesday', time: '7:30 am', intention: 'For Life' },
                { day: 'Thursday', time: '7:30 am', intention: 'Robert Peel †' },
                { day: 'Friday', time: '7:30 am', intention: 'Bruce Cook †' },
                { day: 'Saturday', time: '8:00 am', intention: 'Jack Tomac' },
                { day: 'Saturday', time: '4:30 pm', intention: 'Tim Bjork †' },
                { day: 'Sunday', time: '9:00 am', intention: 'Pearl Schroepfer †' },
                { day: 'Sunday', time: '5:30 pm', intention: 'Parishioners' },
            ],
            dailyScriptures: [
                { day: 'Monday', reading: '1 Cor 5:1-8, Ps 5:5-7, 12, Lk 6:6-11' },
                { day: 'Tuesday', reading: 'Mi 5:1-4a, Ps 13:6abc, Mt 1:1-16, 18-23' },
                { day: 'Wednesday', reading: '1 Cor 7:25-31, Ps 45:11-12, 14-17, Lk 6:20-26' },
                { day: 'Thursday', reading: '1 Cor 8:1b-7, 11-13, Ps 139:1b-3, 13-14b, 23-24, Lk 6:27-38' },
                { day: 'Friday', reading: '1 Cor 9:16-19, 22b-27, Ps 84:3-6, 12, Lk 6:39-42' },
                { day: 'Saturday', reading: '1 Cor 10:14-22, Ps 11:12-13, 17-18, Lk 6:43-49' },
                { day: 'Sunday', reading: 'Sir 27:30-28:7, Ps 103:1-4, 9-12, Rom 14:7-9, Mt 18:21-35' },
            ],
            liturgicalSchedule: [
                {
                    day: 'Saturday, Sept 12',
                    time: '4:30 pm',
                    roles: [
                        { role: 'E.M.', name: 'Shelby Anderson (S), Patti Zephier, NEEDED' },
                        { role: 'Lector', name: 'Faye Clough, Mary Miller' },
                        { role: 'Ushers', name: 'Tim Shull, Mike & Betty Quasney, ONE NEEDED' },
                        { role: 'Altar Server', name: 'Mercedes, James & John Solano' },
                    ],
                },
                {
                    day: 'Sunday, Sept 13',
                    time: '9:00 am',
                    roles: [
                        { role: 'E.M.', name: 'Del & Joann Solano (S), Charlotte Verhey' },
                        { role: 'Lector', name: 'Judee Popken, Howard Steiner' },
                        { role: 'Ushers', name: 'Dik Dahlquist, Dave Fletcher, Rick Edelen, ONE NEEDED' },
                        { role: 'Altar Server', name: 'Lizzy Gorman, Robert Myers' },
                    ],
                },
                {
                    day: 'Sunday, Sept 13',
                    time: '5:30 pm',
                    roles: [
                        { role: 'E.M.', name: 'Martha Cook (S)' },
                        { role: 'Lector', name: 'Toni Weber' },
                        { role: 'Ushers', name: 'David & Chris VanCleave, TWO NEEDED' },
                        { role: 'Altar Server', name: 'Julie Heintz' },
                    ],
                },
            ],
            contributions: {
                checkCollections: '$2,771.00',
                cashCollections: '$2,292.00',
                buildingImprovements: '$50.00',
                vivienReichMemorial: '$500.00',
                newPriestVestments: '$800.00',
                reRegistration: '$175.00',
                adultFormation: '$140.00',
                plantMinistry: '$8.00',
                seminarianFund: '$55.00',
                electronicTithing: '$1,883.60',
                heatCoolingEGiving: '$50.00',
                reRegistrationsEGiving: '$25.69',
                familiesInNeedEGiving: '$30.65',
                priestRetirementFundEGiving: '$10.00',
                votiveCandleIncome: '$129.75',
                total: '$8,920.69',
                weeklyNeeded: '$16,500',
            },
            prayerList: [
                'Prayer Chain: London Fraser, Clarence Schumacher',
                'Bulletin List: Alisha Divis Arch, Karen B., Billie Begley, Fred Berendse, Milferd Best, Mark Biggs, Addie Carroll, Marv Czerwonka, Sue Fennel, Mary Fleming, Angela Fraser, Diane Fraser, London Fraser, Steve Fuhrmann, Chris Gerken, Pauline Gyver, Heidi, Judy Hellman, Keith Karp, Kelsey, Marlene Kleckner, Fr. Brian Lane, Ben Lang, Lynn, Joe Martin, Elaine Paulson, Rosie Ortega, Nancy Palmer, Renee Pansch, Tom Parson, Isla Pearl, Curtis Peterson, Faye Peterson, Carol Schneider, Clarence Schumacher, Pat Silbernagel, Jim Snyder, Floyd Sperlich, Butch Thomas, Joyce Thome, Donalee Tillitt, Jack Tomac, Dean Tubandt, Dcn. Jim Van Loan, Ray Wagner, Carol Waliser, William Wehrle, Fred Welsch, Diane Wilkinson, Larry Willis, Liz Willis, Bobbi Wurnig, Letha Wynia',
                'Rest In Peace: Sharon Ormesher, Mary Mitchell',
            ],
            laughs: [
                'Connie exclaimed, "I\'ve found the perfect weight-loss system. I converted to the metric system and lost half my weight in just seconds!"',
                'People say I have issues with taking responsibility. That\'s hardly my fault, is it?',
                'I ordered a rug from IKEA that ended up being just a needle and 50 lbs. of thread.',
            ],
            needs: [
                { category: 'Birthright Pregnancy Support', items: 'Newborn-6 mo. baby-care products, clothing, & maternity wear. (NO diapers). Volunteers needed!' },
                { category: 'Church Response', items: 'Non-perishable food: pork n beans, pasta & rice a\'ronis, canned vegetables, shampoo/conditioner.' },
                { category: 'Mommy\'s Closet', items: 'Size 3 to 7 diapers, pull ups & wipes, baby formula, new car seats, children\'s books.' },
                { category: 'General', items: 'Puzzle books and adult/kid coloring books & markers/crayons.' },
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
};

export function getBulletinContentForWeek(startDate: Date): BulletinWeekContent {
    return bulletinContentManifest[formatDateKey(startDate)] ?? {
        sections: [],
        hasContent: false,
    };
}
