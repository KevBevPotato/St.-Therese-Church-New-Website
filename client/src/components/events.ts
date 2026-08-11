// ---- 1. Types ----
export type EventCategory =
    | 'sacramental'
    | 'parishEvents'      // ✅ Single unified category (community + youth + family)
    | 'special'
    | 'meeting'
    | 'vocations'
    | 'diocesan';

export type TimeFilter = 'all' | 'thisMonth' | 'nextMonth' | 'twoPlus';

export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    time: string;
    location: string;
    categories: EventCategory[];
    description?: string;
    image?: string;
    about?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    signupLink?: string;
    images?: string[];
    faqItems?: Array<{ question: string; answer: string }>;
    linkedOpportunityId?: string;
}

// ---- 2. Category Styling Defaults ----
export const EVENT_COLORS: Record<EventCategory, { bg: string; border: string; dot: string; label: string; labelColor: string }> = {
    sacramental:  { bg: 'bg-amber-50',    border: 'border-amber-400',    dot: 'bg-amber-500',    label: 'Sacramental Life', labelColor: 'text-amber-700' },
    parishEvents: { bg: 'bg-emerald-50',  border: 'border-emerald-400',  dot: 'bg-emerald-500',  label: 'Parish Events',    labelColor: 'text-emerald-700' },
    special:      { bg: 'bg-rose-50',     border: 'border-rose-400',     dot: 'bg-rose-500',     label: 'Special',          labelColor: 'text-rose-700' },
    meeting:      { bg: 'bg-slate-50',    border: 'border-slate-400',    dot: 'bg-slate-500',    label: 'Meeting',          labelColor: 'text-slate-700' },
    vocations:    { bg: 'bg-purple-50',   border: 'border-purple-400',   dot: 'bg-purple-500',   label: 'Vocations',        labelColor: 'text-purple-700' },
    diocesan:     { bg: 'bg-blue-50',     border: 'border-blue-400',     dot: 'bg-blue-500',     label: 'Diocesan',         labelColor: 'text-blue-700' },
};

/**
 * Generates recurring events for a specific month.
 * Returns ONLY the generated events, does not include base events.
 */
export function generateRecurringEventsForMonth(month: number, year: number): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // 7 am Rosary (M-F) - "forever"
        if (d.getDay() >= 1 && d.getDay() <= 5) {
            events.push({
                id: `rosary-daily-${dateStr}`,
                title: "Daily Rosary",
                date: new Date(year, month, day, 7, 0),
                time: "7:00 AM",
                location: "Main Sanctuary",
                categories: ["sacramental"],
                description: "Join us for our daily rosary prayer before the start of the day."
            });
        }

        // Sundays: Family Rosary
        if (d.getDay() === 0) {
            events.push({
                id: `rosary-sun-${dateStr}`,
                title: "Family Rosary",
                date: new Date(year, month, day, 19, 0),
                time: "7:00 PM",
                location: "Main Sanctuary",
                categories: ["sacramental", "parishEvents"],
                description: "Weekly family rosary prayer."
            });
        }

        // Fridays: Holy Hour
        if (d.getDay() === 5) {
            events.push({
                id: `holyhour-${dateStr}`,
                title: "Holy Hour",
                date: new Date(year, month, day, 8, 0),
                time: "8:00 AM - 9:00 AM",
                location: "Main Sanctuary",
                categories: ["sacramental"],
                description: "Includes morning prayer and Eucharistic Adoration."
            });
        }

        // Mondays: Knights of Columbus
        if (d.getDay() === 1) {
            const weekNum = Math.ceil(day / 7);
            if (weekNum === 1) {
                events.push({
                    id: `koc-officer-${dateStr}`,
                    title: "Knights of Columbus: Officer Meeting",
                    date: new Date(year, month, day, 19, 0),
                    time: "7:00 PM",
                    location: "Church Basement",
                    categories: ["meeting"],
                    description: "Monthly meeting for the Knights of Columbus Officers."
                });
            } else if (weekNum === 2) {
                events.push({
                    id: `koc-members-${dateStr}`,
                    title: "Knights of Columbus: All Members Invited",
                    date: new Date(year, month, day, 19, 0),
                    time: "7:00 PM",
                    location: "Church Basement",
                    categories: ["meeting", "parishEvents"],
                    description: "Monthly general meeting for all Knights of Columbus members."
                });
            }
        }

        // Wednesdays: Family Formation (Sept 2, 2026 - May 19, 2027)
        if (d.getDay() === 3) {
            const schoolYearStart = new Date(2026, 8, 2);
            const schoolYearEnd = new Date(2027, 4, 19);
            const exclusions = ["2026-11-25", "2026-12-23", "2026-12-30", "2027-03-31"];

            if (d >= schoolYearStart && d <= schoolYearEnd && !exclusions.includes(dateStr)) {
                events.push({
                    id: `family-formation-${dateStr}`,
                    title: "Wednesday Night Family Formation",
                    date: new Date(year, month, day, 17, 30),
                    time: "5:30 PM - 7:30 PM",
                    location: "Parish Hall & Classrooms",
                    categories: ["parishEvents", "sacramental"],
                    description: "Family Formation night. Meal from 5:30-6:00 PM, classes from 6:00-7:30 PM.",
                    linkedOpportunityId: "wednesday-night-supper"
                });
            }
        }
    }

    return events;
}

// ---- 3. Static Parish & Diocesan Events ----
export const staticEvents: CalendarEvent[] = [
    // --- August 2026 ---
    {
        id: "feeding-sd-aug-5",
        title: "Feeding South Dakota",
        date: new Date("2026-08-05T08:00:00"),
        time: "8:00 AM - 9:30 AM",
        location: "AMC Theater Parking Lot - 230 Knollwood Dr. Rapid City, SD",
        categories: ["parishEvents"],
        description: "Mobile food distribution.",
        about: "Feeding South Dakota is a mobile food distribution program serving the community.",
        contactPerson: "John Smith",
        contactEmail: "john@example.com",
        signupLink: "https://example.com/signup"
    },
    {
        id: "cinema-la-strada",
        title: "Cinema with the Shepherd: La Strada",
        date: new Date("2026-08-06T18:30:00"),
        time: "6:30 PM",
        location: "St. Joseph Hall, Cathedral",
        categories: ["parishEvents", "special", "diocesan"],
        description: "Bishop Bullock's film festival featuring 'La Strada' (1954).",
        about: "Join us for a special film screening and discussion with Bishop Bullock.",
        contactPerson: "Bishop Bullock",
        faqItems: [
            { question: "What time should I arrive?", answer: "Please arrive 15 minutes early." },
            { question: "Is there a cost?", answer: "Admission is free." }
        ]
    },
    {
        id: "feeding-sd-aug-8",
        title: "Feeding South Dakota",
        date: new Date("2026-08-08T09:00:00"),
        time: "9:00 AM - 11:00 AM",
        location: "Western Dakota Tech - 800 Mickelson Dr Rapid City, SD",
        categories: ["parishEvents"],
        description: "Mobile food distribution."
    },
    {
        id: "widows-lunch-aug-12",
        title: "Widow's Group Lunch",
        date: new Date("2026-08-12T11:30:00"),
        time: "11:30 AM",
        location: "Armadillos Ice Cream",
        categories: ["parishEvents"],
        description: "Monthly gathering and lunch for the Widow's Group at Armadillos Ice Cream."
    },
    {
        id: "assumption-vigil",
        title: "The Assumption Vigil (Holy Day)",
        date: new Date("2026-08-14T17:30:00"),
        time: "5:30 PM",
        location: "Main Sanctuary",
        categories: ["sacramental", "special"],
        description: "Holy Day of Obligation Vigil Mass."
    },
    {
        id: "assumption-day",
        title: "The Assumption (Holy Day)",
        date: new Date("2026-08-15T08:00:00"),
        time: "8:00 AM",
        location: "Main Sanctuary",
        categories: ["sacramental", "special"],
        description: "Holy Day of Obligation Mass."
    },
    {
        id: "olv-conference",
        title: "Our Lady of Victory Catholic Conference",
        date: new Date("2026-08-15T09:00:00"),
        time: "9:00 AM - 4:00 PM",
        location: "olvconference.com",
        categories: ["special", "parishEvents", "diocesan"],
        description: "Featuring Msgr. Charles Pope & Jesse Romero."
    },
    {
        id: "welcome-reception",
        title: "Welcome Reception: Fr. Mark & Fr. Todd",
        date: new Date("2026-08-16T11:30:00"),
        time: "11:30 AM",
        location: "Parish Hall",
        categories: ["parishEvents", "special"],
        description: "Reception provided by the Knights of Columbus. Please bring a side dish or dessert to share!"
    },
    {
        id: "fall-festival",
        title: "Fall Festival Planning",
        date: new Date("2026-08-16T10:15:00"),
        time: "10:15 AM",
        location: "Parish Hall",
        categories: ["parishEvents", "meeting"],
        description: "Everyone is welcome to help plan our annual festival."
    },
    {
        id: "rhubarb-sale",
        title: "Everything Rhubarb Sale",
        date: new Date("2026-08-16T09:00:00"),
        time: "After Morning Masses",
        location: "Parish Hall",
        categories: ["parishEvents"],
        description: "Hosted by the Catholic Daughters."
    },
    {
        id: "black-elk-mass",
        title: "Black Elk Anniversary Mass",
        date: new Date("2026-08-17T10:30:00"),
        time: "10:30 AM",
        location: "Holy Rosary Church, Pine Ridge",
        categories: ["sacramental", "special", "diocesan"],
        description: "Anniversary Mass followed by a picnic."
    },
    {
        id: "feeding-sd-aug-18-am",
        title: "Feeding South Dakota",
        date: new Date("2026-08-18T08:00:00"),
        time: "8:00 AM - 9:30 AM",
        location: "AMC Theater Parking Lot - 230 Knollwood Dr. Rapid City, SD",
        categories: ["parishEvents"],
        description: "Mobile food distribution."
    },
    {
        id: "feeding-sd-aug-18-pm",
        title: "Feeding South Dakota",
        date: new Date("2026-08-18T16:30:00"),
        time: "4:30 PM - 6:30 PM",
        location: "Western Dakota Tech - 800 Mickelson Dr Rapid City, SD",
        categories: ["parishEvents"],
        description: "Mobile food distribution."
    },
    {
        id: "bookclub-aug",
        title: "Bishop's Bookclub: The End of the Affair",
        date: new Date("2026-08-18T12:00:00"),
        time: "Podcast Release",
        location: "Online / Podcast",
        categories: ["parishEvents", "diocesan"],
        description: "Discussion on 'The End of the Affair' by Graham Greene."
    },
        {
        id: "new-catechist-orientation-2026",
        title: "New Catechist Orientation",
        date: new Date("2026-08-21T17:00:00"),
        time: "5:00 PM - 9:00 PM",
        location: "Terra Sancta Retreat Center",
        categories: ["diocesan", "special"],
        description: "Orientation for new (and new-ish) catechists will provide some basic information and best practices in the ministry of catechesis. How does a catechist effectively communicate the faith? What are some helpful pedagogical practices in the classroom? How do catechists grow in their own faith? How do catechists consistently improve their methods? All this and more at our new catechist orientation! All new (and new-ish) catechists are encouraged to attend.",
        signupLink: "https://rapidcitydiocese.ccbchurch.com/goto/forms/456/responses/new"
    },
    {
        id: "catechetical-kickoff-2026",
        title: "Catechetical Kick-Off Conference",
        date: new Date("2026-08-22T08:00:00"),
        time: "8:00 AM - 3:00 PM",
        location: "Terra Sancta Retreat Center",
        categories: ["diocesan", "special"],
        description: "Join us as we gather together as catechists, learning more about the craft of catechesis in ways specific to the apostolates we serve. The day will feature a keynote presentation by Bishop Bullock and various breakout sessions for more specific training and inspiration. We hope all diocesan catechists will attend.",
        signupLink: "https://rapidcitydiocese.ccbchurch.com/goto/forms/455/responses/new"
    },
    ...Array.from({ length: 9 }, (_, i) => ({
        id: `bingo-fair-${21 + i}`,
        title: "Bingo with the Knights of Columbus",
        date: new Date(2026, 7, 21 + i, 18, 0),
        time: "6:00 PM - 10:00 PM",
        location: "Central States Fair",
        categories: ["parishEvents" as EventCategory],
        description: "Join the Knights for Bingo at the Central States Fair!"
    })),
    {
        id: "ocia-1",
        title: "OCIA Info Meeting",
        date: new Date("2026-08-24T18:30:00"),
        time: "6:30 PM",
        location: "Parish Hall",
        categories: ["sacramental", "meeting"],
        description: "Information session for those interested in joining the Church."
    },
    {
        id: "parish-council",
        title: "Parish Council Meeting",
        date: new Date("2026-08-25T18:30:00"),
        time: "6:30 PM",
        location: "Parish Office",
        categories: ["meeting"],
        description: "Monthly meeting of the Parish Council."
    },
    {
        id: "feeding-sd-aug-26",
        title: "Feeding South Dakota",
        date: new Date("2026-08-26T10:00:00"),
        time: "10:00 AM - 11:30 AM",
        location: "Star Village - 27 Signal Dr. Rapid City, SD",
        categories: ["parishEvents"],
        description: "Mobile food distribution (behind the office)."
    },
    {
        id: "feeding-sd-aug-27",
        title: "Feeding South Dakota",
        date: new Date("2026-08-27T16:30:00"),
        time: "4:30 PM - 5:30 PM",
        location: "Box Elder - Francis Case Elementary - 441 Don Williams Dr.",
        categories: ["parishEvents"],
        description: "Mobile food distribution."
    },
    {
        id: "pfeifle-5k",
        title: "Tom Pfeifle Memorial 5k Run/Walk",
        date: new Date("2026-08-29T09:00:00"),
        time: "9:00 AM",
        location: "Raider Park",
        categories: ["parishEvents", "special"],
        description: "Benefit for Raider Park. Website: https://www.tompfeifle5k.org/"
    },
    {
        id: "ocia-2",
        title: "OCIA Info Meeting",
        date: new Date("2026-08-31T18:30:00"),
        time: "6:30 PM",
        location: "Parish Hall",
        categories: ["sacramental", "meeting"],
        description: "Information session for those interested in joining the Church."
    },

    // --- September 2026 ---
    {
        id: "cinema-bicycle-thieves",
        title: "Cinema with the Shepherd: Bicycle Thieves",
        date: new Date("2026-09-01T18:30:00"),
        time: "6:30 PM",
        location: "St. Joseph Hall, Cathedral",
        categories: ["parishEvents", "special", "diocesan"],
        description: "Bishop Bullock's film festival featuring 'Bicycle Thieves' (1948)."
    },
    {
        id: "becoming-one-retreat",
        title: "Becoming One Marriage Retreat",
        date: new Date("2026-09-04T00:00:00"),
        time: "Sept 4-6",
        location: "Terra Sancta Retreat Center",
        categories: ["parishEvents", "sacramental", "diocesan"],
        description: "Registration through the link.",
        signupLink: "https://rapidcitydiocese.ccbchurch.com/goto/forms/494/responses/new"
    },
    {
        id: "spiritual-motherhood-2026",
        title: "Spiritual Motherhood Day of Renewal",
        date: new Date("2026-09-13T10:00:00"),
        time: "10:00 AM - 3:00 PM",
        location: "Terra Sancta Retreat Center",
        categories: ["vocations", "diocesan", "special"],
        description: "Annual Day of Renewal and Prayer for Spiritual Mothers. Mass celebrated by Fr. Todd VanderMay. Lunch provided.",
        signupLink: "https://rapidcitydiocese.ccbchurch.com/goto/forms/494/responses/new"
    },
    {
        id: "altar-society-sept",
        title: "Altar Society Meeting",
        date: new Date("2026-09-13T10:15:00"),
        time: "10:15 AM",
        location: "Room 103",
        categories: ["meeting"],
        description: "Monthly meeting."
    },
    {
        id: "sheen-pilgrimage",
        title: "Beatification of Fulton J. Sheen Pilgrimage",
        date: new Date("2026-09-22T00:00:00"),
        time: "Sept 22-25",
        location: "St. Louis, MO",
        categories: ["special", "sacramental", "diocesan"],
        description: "Diocesan Pilgrimage. Website: https://www.rapidcitydiocese.org/sheen-pilgrimage/"
    },
    {
        id: "bookclub-sept",
        title: "Bishop's Bookclub: The Way of the Disciple",
        date: new Date("2026-09-22T12:00:00"),
        time: "Podcast Release",
        location: "Online / Podcast",
        categories: ["parishEvents", "diocesan"],
        description: "Discussion on 'The Way of the Disciple' by Erasmo Leiva-Merikakis."
    },
    {
        id: "ricky-manalo",
        title: "Fr. Ricky Manalo, CSP: Tune, Text, & Theology",
        date: new Date("2026-09-25T19:00:00"),
        time: "7:00 PM",
        location: "Our Lady of the Black Hills Church, Piedmont, SD",
        categories: ["special", "parishEvents", "diocesan"],
        description: "Presentation by Father Ricky Manalo."
    },
    {
        id: "priesthood-sunday-2026",
        title: "Priesthood Sunday",
        date: new Date("2026-09-27T00:00:00"),
        time: "All Day",
        location: "Parish Wide",
        categories: ["vocations", "special"],
        description: "A chance to honor the priests in your life. Give him a card, take him to lunch, or honor him at Mass.",
        signupLink: "https://gods-call.com/ia-events/priesthood-sunday-2/"
    },
    {
        id: "danube-cruise",
        title: "Danube River Cruise Pilgrimage",
        date: new Date("2026-09-28T00:00:00"),
        time: "Sept 28 - Oct 13",
        location: "Bratislava, Vienna, Regensburg, & Prague",
        categories: ["special", "diocesan"],
        description: "Cavins Tours with Jeff and Emily Cavins, Fr. Brian Lane & Fr. Kerry Prendiville."
    },

    // --- October 2026 ---
    {
        id: "bookclub-oct",
        title: "Bishop's Bookclub: Brideshead Revisited",
        date: new Date("2026-10-20T12:00:00"),
        time: "Podcast Release",
        location: "Online / Podcast",
        categories: ["parishEvents", "diocesan"],
        description: "Discussion on 'Brideshead Revisited' by Evelyn Waugh."
    },
    {
        id: "cinema-burmese-harp",
        title: "Cinema with the Shepherd: Burmese Harp",
        date: new Date("2026-10-27T18:30:00"),
        time: "6:30 PM",
        location: "St. Joseph Hall, Cathedral",
        categories: ["parishEvents", "special", "diocesan"],
        description: "Bishop Bullock's film festival featuring 'Burmese Harp' (1956)."
    },

    // --- November 2026 ---
    {
        id: "cinema-wizard-oz",
        title: "Cinema with the Shepherd: The Wizard of Oz",
        date: new Date("2026-11-03T18:30:00"),
        time: "6:30 PM",
        location: "St. Joseph Hall, Cathedral",
        categories: ["parishEvents", "special", "diocesan"],
        description: "Bishop Bullock's film festival featuring 'The Wizard of Oz' (1939)."
    },
    {
        id: "ihm-seminary-fall-2026",
        title: "IHM Seminary Come and See Weekend",
        date: new Date("2026-11-06T00:00:00"),
        time: "Nov 6 - Nov 9",
        location: "Immaculate Heart of Mary Seminary, Winona, MN",
        categories: ["vocations", "special", "diocesan"],
        description: "Experience life at an undergraduate seminary program. Join current seminarians to pray, attend classes, and enjoy fellowship.",
        signupLink: "https://gods-call.com/ia-events/immaculate-heart-of-mary-seminary-come-and-see-weekend-fall-2024/"
    },
    {
        id: "bookclub-nov",
        title: "Bishop's Bookclub: The Power and the Glory",
        date: new Date("2026-11-17T12:00:00"),
        time: "Podcast Release",
        location: "Online / Podcast",
        categories: ["parishEvents", "diocesan"],
        description: "Discussion on 'The Power and the Glory' by Graham Greene."
    },

    // --- December 2026 ---
    {
        id: "cinema-babettes-feast",
        title: "Cinema with the Shepherd: Babette's Feast",
        date: new Date("2026-12-01T18:30:00"),
        time: "6:30 PM",
        location: "St. Joseph Hall, Cathedral",
        categories: ["parishEvents", "special", "diocesan"],
        description: "Bishop Bullock's film festival featuring 'Babette's Feast' (1987)."
    },
    {
        id: "bookclub-dec",
        title: "Bishop's Bookclub: Wheat that Springeth Green",
        date: new Date("2026-12-15T12:00:00"),
        time: "Podcast Release",
        location: "Online / Podcast",
        categories: ["parishEvents", "diocesan"],
        description: "Discussion on 'Wheat that Springeth Green' by J.F. Powers."
    },

    // --- 2027 Events ---
    {
        id: "mothers-retreat-2027",
        title: "Mother's Retreat",
        date: new Date("2027-01-29T00:00:00"),
        time: "Jan 29-31, 2027",
        location: "Terra Sancta Retreat Center",
        categories: ["special", "parishEvents", "diocesan"],
        description: "Registration Information Coming Soon."
    },
    {
        id: "world-youth-day-2027",
        title: "World Youth Day",
        date: new Date("2027-07-31T00:00:00"),
        time: "July 31 - Aug 13, 2027",
        location: "Seoul, Korea",
        categories: ["parishEvents", "special", "diocesan"],
        description: "International gathering of Catholic youth."
    }
];
