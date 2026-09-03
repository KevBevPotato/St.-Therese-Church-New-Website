import { CalendarEvent } from './types';

export const oneTimeEvents: CalendarEvent[] = [
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

        // --- PHOTO SECTION ---
        // This is the main large photo at the top
        image: "/images/events/la-strada-hero.jpg",

        // This is the grid of photos at the bottom
        photos: [
            "/images/events/la-strada-1.jpg",
            "/images/events/la-strada-2.jpg",
            "/images/events/la-strada-3.jpg",
            "/images/events/la-strada-4.jpg",
        ],
        // ---------------------

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
        description: "Reception provided by the Knights of Columbus. Please bring a side dish or dessert to share!",
        organizationTags: ["knights-of-columbus"],
    },
    {
        id: "rhubarb-sale",
        title: "Everything Rhubarb Sale",
        date: new Date("2026-08-16T09:00:00"),
        time: "After Morning Masses",
        location: "Parish Hall",
        categories: ["parishEvents"],
        description: "Hosted by the Catholic Daughters.",
        organizationTags: ["catholic-daughters"],
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
        description: "Orientation for new (and new-ish) catechists.",
        signupLink: "https://rapidcitydiocese.ccbchurch.com/goto/forms/456/responses/new"
    },
    {
        id: "catechetical-kickoff-2026",
        title: "Catechetical Kick-Off Conference",
        date: new Date("2026-08-22T08:00:00"),
        time: "8:00 AM - 3:00 PM",
        location: "Terra Sancta Retreat Center",
        categories: ["diocesan", "special"],
        description: "Join us as we gather together as catechists.",
        signupLink: "https://rapidcitydiocese.ccbchurch.com/goto/forms/455/responses/new"
    },
    // Bingo Fair Expansion
    { id: "bingo-fair-21", title: "Bingo with the Knights of Columbus", date: new Date(2026, 7, 21, 18, 0), time: "6:00 PM - 10:00 PM", location: "Central States Fair", categories: ["parishEvents"], description: "Join the Knights for Bingo!", organizationTags: ["knights-of-columbus"] },
    { id: "bingo-fair-22", title: "Bingo with the Knights of Columbus", date: new Date(2026, 7, 22, 18, 0), time: "6:00 PM - 10:00 PM", location: "Central States Fair", categories: ["parishEvents"], description: "Join the Knights for Bingo!", organizationTags: ["knights-of-columbus"] },
    { id: "bingo-fair-23", title: "Bingo with the Knights of Columbus", date: new Date(2026, 7, 23, 18, 0), time: "6:00 PM - 10:00 PM", location: "Central States Fair", categories: ["parishEvents"], description: "Join the Knights for Bingo!", organizationTags: ["knights-of-columbus"] },
    { id: "bingo-fair-24", title: "Bingo with the Knights of Columbus", date: new Date(2026, 7, 24, 18, 0), time: "6:00 PM - 10:00 PM", location: "Central States Fair", categories: ["parishEvents"], description: "Join the Knights for Bingo!", organizationTags: ["knights-of-columbus"] },
    { id: "bingo-fair-25", title: "Bingo with the Knights of Columbus", date: new Date(2026, 7, 25, 18, 0), time: "6:00 PM - 10:00 PM", location: "Central States Fair", categories: ["parishEvents"], description: "Join the Knights for Bingo!", organizationTags: ["knights-of-columbus"] },
    { id: "bingo-fair-26", title: "Bingo with the Knights of Columbus", date: new Date(2026, 7, 26, 18, 0), time: "6:00 PM - 10:00 PM", location: "Central States Fair", categories: ["parishEvents"], description: "Join the Knights for Bingo!", organizationTags: ["knights-of-columbus"] },
    { id: "bingo-fair-27", title: "Bingo with the Knights of Columbus", date: new Date(2026, 7, 27, 18, 0), time: "6:00 PM - 10:00 PM", location: "Central States Fair", categories: ["parishEvents"], description: "Join the Knights for Bingo!", organizationTags: ["knights-of-columbus"] },
    { id: "bingo-fair-28", title: "Bingo with the Knights of Columbus", date: new Date(2026, 7, 28, 18, 0), time: "6:00 PM - 10:00 PM", location: "Central States Fair", categories: ["parishEvents"], description: "Join the Knights for Bingo!", organizationTags: ["knights-of-columbus"] },
    { id: "bingo-fair-29", title: "Bingo with the Knights of Columbus", date: new Date(2026, 7, 29, 18, 0), time: "6:00 PM - 10:00 PM", location: "Central States Fair", categories: ["parishEvents"], description: "Join the Knights for Bingo!", organizationTags: ["knights-of-columbus"] },
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
        description: "Monthly meeting.",
        organizationTags: ["altar-society"],
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
        description: "A chance to honor the priests in your life.",
        signupLink: "https://gods-call.com/ia-events/priesthood-sunday-2/"
    },
    {
        id: "danube-cruise",
        title: "Danube River Cruise Pilgrimage",
        date: new Date("2026-09-28T00:00:00"),
        time: "Sept 28 - Oct 13",
        location: "Bratislava, Vienna, Regensburg, & Prague",
        categories: ["special", "diocesan"],
        description: "Cavins Tours with Jeff and Emily Cavins.",
    },
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
        description: "Experience life at an undergraduate seminary program.",
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
    },
    {
        id: "fall-festival-2026",
        title: "Fall Festival Planning",
        date: new Date("2026-09-27T10:15:00"),
        time: "10:15 AM",
        location: "Parish Hall",
        categories: ["parishEvents", "meeting"],
        description: "Everyone is welcome to help plan our annual festival.",
        contactPerson: "Melanie Karp",
        contactEmail: "melanie@strcstaff.org",
        contactPhone: "(605) 123-4567",
        // --- PHOTO SECTION ---
        // This is the main large photo at the top
        image: "/images/events/la-strada-hero.jpg",

        // This is the grid of photos at the bottom
        photos: [
            "/images/events/la-strada-1.jpg",
            "/images/events/la-strada-2.jpg",
            "/images/events/la-strada-3.jpg",
            "/images/events/la-strada-4.jpg",
        ],
        faqItems: [
            { question: "Is lunch provided?", answer: "Yes, a light lunch will be served." },
            { question: "Can I bring a spouse?", answer: "Absolutely! Spouses are welcome." },
        ],
    },
];
