// 2026-2027 Wednesday Night Catechists & Faith Formation Programs

export interface Catechist {
    id: string;
    name: string;
    photo?: string;
    photoPosition?: string;
    safeEnvironmentPdf?: string;
    role?: string;
}

export interface Resource {
    title: string;
    description: string;
    publisher?: string;
    link?: string;
}

export type FaithGroup = 'elementary' | 'middle-school' | 'high-school' | 'adult';

export interface FaithCategory {
    id: string;
    title: string;
    subtitle?: string;
    programName?: string;
    ageRange: string;
    group: FaithGroup;
    shortDescription: string;
    longDescription: string;
    meetingTime: string;
    location: string;
    catechists: Catechist[];
    photos: string[];
    resources: Resource[];
    aboutText: string;
}

export const MEETING_TIME = 'Wednesdays 6:15 PM - 7:30 PM';

export const faithCategories: FaithCategory[] = [
    // ====================== ELEMENTARY ======================
    {
        id: 'nursery',
        title: 'Nursery',
        ageRange: 'Infant – Age 2',
        group: 'elementary',
        shortDescription: 'Loving, Safe Environment–trained care for our littlest ones while parents attend class.',
        longDescription:
            'Our nursery provides safe, loving care for infants and toddlers during Wednesday evening Faith Formation classes. Volunteer caregivers engage children with age-appropriate toys, books, and music while modeling Christ\'s love.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – Nursery',
        catechists: [
            {
                id: 'anne-pozorski',
                name: 'Anne Pozorski',
                role: 'Lead Catechist',
                photo: '/catechists/anne-pozorski.jpg',
                safeEnvironmentPdf: '/safe-env/anne-pozorski.pdf',
            },
        ],
        photos: [
            '/faith-formation/nursery-1.jpg',
            '/faith-formation/nursery-2.jpg',
            '/faith-formation/nursery-3.jpg',
        ],
        resources: [
            {
                title: "The Beginner's Bible",
                description: 'Age-appropriate Bible stories with colorful illustrations to introduce little ones to the stories of our faith.',
                publisher: 'Zonderkidz',
            },
            {
                title: 'Catholic Board Books',
                description: 'Simple board books featuring prayers, saints, and basic Catholic concepts designed for tiny hands.',
            },
        ],
        aboutText:
            'The nursery is staffed by volunteer caregivers who have all completed Safe Environment training. Children enjoy supervised play, songs, and simple Bible stories in a warm and welcoming environment. Parents can drop off their little ones with confidence while they attend their own Faith Formation class.',
    },
    {
        id: 'pre-k',
        title: 'Pre-K',
        ageRange: 'Ages 3 – 4',
        group: 'elementary',
        shortDescription: "Introduction to God's love through play, songs, crafts, and simple stories.",
        longDescription:
            'Pre-K is where our youngest learners begin to discover God\'s love through play, songs, crafts, and simple Bible stories. The children build friendships and start their journey of faith in a nurturing environment.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – Pre-K Room',
        catechists: [
            {
                id: 'kelli-whartman-prek',
                name: 'Kelli Whartman',
                role: 'Lead Catechist',
                photo: '/catechists/kelli-whartman.jpg',
                safeEnvironmentPdf: '/safe-env/kelli-whartman.pdf',
            },
        ],
        photos: ['/faith-formation/prek-1.jpg', '/faith-formation/prek-2.jpg'],
        resources: [
            {
                title: 'Seeds Program',
                description: 'A Pflaum Gospel Weeklies program designed for preschoolers, featuring colorful visuals and age-appropriate activities that connect weekly to Sunday\'s Gospel.',
                publisher: 'Pflaum Publishing',
            },
            {
                title: "Catholic Children's Prayer Book",
                description: 'Simple prayers and blessings children can learn by heart.',
            },
        ],
        aboutText:
            'Our Pre-K program introduces three- and four-year-olds to the joy of faith through stories, songs, crafts, and play. Children learn that God made them, loves them, and is always with them.',
    },
    {
        id: 'kindergarten',
        title: 'Kindergarten',
        ageRange: 'Age 5',
        group: 'elementary',
        shortDescription: "Exploring God's creation and basic Catholic prayers in a fun environment.",
        longDescription:
            'Kindergarteners explore the wonders of God\'s creation and learn basic Catholic prayers and traditions. The curriculum emphasizes God\'s love, the beauty of the world He made, and the importance of daily prayer.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – Kindergarten Room',
        catechists: [
            {
                id: 'carol-brechtel',
                name: 'Carol Brechtel',
                role: 'Lead Catechist',
                photo: '/catechists/carol-brechtel.jpg',
                safeEnvironmentPdf: '/safe-env/carol-brechtel.pdf',
            },
        ],
        photos: ['/faith-formation/kindergarten-1.jpg', '/faith-formation/kindergarten-2.jpg'],
        resources: [
            {
                title: 'Seeds Program',
                description: 'Pflaum Gospel Weeklies for kindergarteners — a weekly leaflet and activity that brings the Sunday Gospel to life in age-appropriate ways.',
                publisher: 'Pflaum Publishing',
            },
            {
                title: 'My First Catechism',
                description: 'Simple explanations of Catholic beliefs and prayers for young children.',
            },
        ],
        aboutText:
            'Kindergarten faith formation builds on the foundation established in Pre-K. Students learn basic prayers (Sign of the Cross, Our Father, Hail Mary), hear Bible stories, and grow in understanding that God made each of them special.',
    },
    {
        id: '1st-grade',
        title: '1st Grade',
        ageRange: 'Age 6',
        group: 'elementary',
        shortDescription: 'Building a foundation of faith and learning about the life of Jesus.',
        longDescription:
            'First graders begin a more structured exploration of the Catholic faith, with a focus on the life of Jesus, the sacraments, and the prayer life of the Church.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – 1st Grade Room',
        catechists: [
            {
                id: 'johanna-auriemma',
                name: 'Johanna Auriemma',
                role: 'Lead Catechist',
                photo: '/catechists/johanna-auriemma.jpg',
                safeEnvironmentPdf: '/safe-env/johanna-auriemma.pdf',
            },
        ],
        photos: ['/faith-formation/1st-1.jpg', '/faith-formation/1st-2.jpg'],
        resources: [
            {
                title: 'Promise Program',
                description: 'Pflaum Gospel Weeklies for 1st graders, connecting weekly Gospel readings with classroom activities.',
                publisher: 'Pflaum Publishing',
            },
        ],
        aboutText:
            'First graders develop a deeper understanding of who Jesus is, learn the Act of Contrition and other traditional prayers, and begin to understand that they are part of a larger family of believers.',
    },
    {
        id: '2nd-grade',
        title: '2nd Grade',
        subtitle: '1st Reconciliation & First Communion',
        ageRange: 'Age 7',
        group: 'elementary',
        shortDescription: 'Sacramental preparation for First Reconciliation and First Holy Communion.',
        longDescription:
            'This is a special year of preparation for the Sacraments of First Reconciliation (Confession) and First Holy Communion. Children learn about God\'s mercy, the gift of the Eucharist, and how to receive these sacraments with reverence.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – 2nd Grade Room',
        catechists: [
            {
                id: 'sarah-freeland',
                name: 'Sarah Freeland',
                role: 'Lead Catechist',
                photo: '/catechists/sarah-freeland.jpg',
                safeEnvironmentPdf: '/safe-env/sarah-freeland.pdf',
            },
        ],
        photos: ['/faith-formation/2nd-1.jpg', '/faith-formation/2nd-2.jpg'],
        resources: [
            {
                title: 'Promise Program',
                description: 'Pflaum Gospel Weeklies continues in 2nd grade with a focus on sacramental preparation.',
                publisher: 'Pflaum Publishing',
            },
            {
                title: 'Reconciliation & First Eucharist Preparation',
                description: 'Diocesan-approved materials to help children prepare for these important sacraments.',
            },
            {
                title: 'My First Holy Communion',
                description: 'A keepsake book to help children prepare for and remember their First Communion.',
            },
        ],
        aboutText:
            'Second grade is a milestone year as children prepare for two of the most important sacraments of their young lives. The catechist works closely with parents to ensure that children understand what they are receiving and are well-prepared spiritually.',
    },
    {
        id: '3rd-grade',
        title: '3rd Grade',
        ageRange: 'Age 8',
        group: 'elementary',
        shortDescription: 'Deepening understanding of the Church community and the Holy Spirit.',
        longDescription:
            'Third graders explore the mystery of the Holy Trinity, the Holy Spirit, and the community of the Church. They begin to understand that they belong to something bigger than themselves.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – 3rd Grade Room',
        catechists: [
            {
                id: 'sheri-zimmer',
                name: 'Sheri Zimmer',
                role: 'Lead Catechist',
                photo: '/catechists/sheri-zimmer.jpg',
                safeEnvironmentPdf: '/safe-env/sheri-zimmer.pdf',
            },
        ],
        photos: ['/faith-formation/3rd-1.jpg', '/faith-formation/3rd-2.jpg'],
        resources: [
            {
                title: 'Promise Program',
                description: 'Pflaum Gospel Weeklies for 3rd graders.',
                publisher: 'Pflaum Publishing',
            },
        ],
        aboutText:
            'Third graders learn about the Holy Trinity, the gifts of the Holy Spirit, and how the Church continues the mission of Jesus through the work of believers today.',
    },
    {
        id: '4th-grade',
        title: '4th Grade',
        ageRange: 'Age 9',
        group: 'elementary',
        shortDescription: 'Learning about the Ten Commandments and living a moral life.',
        longDescription:
            'Fourth graders study the Ten Commandments and the Beatitudes, learning how to live a moral life as followers of Christ. They explore the difference between right and wrong through the lens of Catholic teaching.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – 4th Grade Room',
        catechists: [
            {
                id: 'charli-stamper',
                name: 'Charli Stamper',
                role: 'Lead Catechist',
                photo: '/catechists/charli-stamper.jpg',
                safeEnvironmentPdf: '/safe-env/charli-stamper.pdf',
            },
        ],
        photos: ['/faith-formation/4th-1.jpg', '/faith-formation/4th-2.jpg'],
        resources: [
            {
                title: 'Promise Program',
                description: 'Pflaum Gospel Weeklies for 4th graders, with a focus on the Ten Commandments and moral living.',
                publisher: 'Pflaum Publishing',
            },
        ],
        aboutText:
            'Fourth graders dive deep into the Ten Commandments and the Beatitudes, learning how Catholic moral teaching guides us to love God and love our neighbor in our daily lives.',
    },
    {
        id: '5th-grade',
        title: '5th Grade',
        ageRange: 'Age 10',
        group: 'elementary',
        shortDescription: 'Exploring the seven Sacraments and their importance in our spiritual journey.',
        longDescription:
            'Fifth graders study the seven sacraments in depth, learning what each one is, why it matters, and how it shapes our relationship with God and the Church.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – 5th Grade Room',
        catechists: [
            {
                id: 'kathy-auriemma',
                name: 'Kathy Auriemma',
                role: 'Lead Catechist',
                photo: '/catechists/kathy-auriemma.jpg',
                safeEnvironmentPdf: '/safe-env/kathy-auriemma.pdf',
            },
        ],
        photos: ['/faith-formation/5th-1.jpg', '/faith-formation/5th-2.jpg'],
        resources: [
            {
                title: 'Promise Program',
                description: 'Pflaum Gospel Weeklies for 5th graders, with comprehensive coverage of the seven sacraments.',
                publisher: 'Pflaum Publishing',
            },
        ],
        aboutText:
            'Fifth graders explore all seven sacraments — Baptism, Confirmation, Eucharist, Penance, Anointing of the Sick, Holy Orders, and Matrimony — learning how each is a special encounter with God\'s grace.',
    },

    // ====================== MIDDLE SCHOOL ======================
    {
        id: '6th-grade-edge',
        title: '6th Grade',
        subtitle: 'Edge',
        programName: 'Edge',
        ageRange: 'Age 11',
        group: 'middle-school',
        shortDescription: 'Edge middle school program — fun, faith, and friendship.',
        longDescription:
            'Edge is our middle school ministry program designed to meet the unique needs of 6th graders. It combines fun, engaging activities with solid catechesis to help pre-teens navigate their faith journey during a time of rapid change.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – Edge Room',
        catechists: [
            {
                id: 'natasha-combs',
                name: 'Natasha Combs',
                role: 'Edge Coordinator',
                photo: '/catechists/natasha-combs.jpg',
                safeEnvironmentPdf: '/safe-env/natasha-combs.pdf',
            },
        ],
        photos: ['/faith-formation/edge-1.jpg', '/faith-formation/edge-2.jpg', '/faith-formation/edge-3.jpg'],
        resources: [
            {
                title: 'Edge Program',
                description: 'Life Teen\'s middle school ministry program, designed to lead teens closer to Christ through fun, fellowship, and formation.',
                publisher: 'Life Teen',
                link: 'https://lifeteen.com/edge/',
            },
        ],
        aboutText:
            'Edge is more than a class — it\'s a community where 6th graders can ask tough questions, find authentic friendships, and grow in their relationship with Jesus. The program uses engaging activities, small group discussions, and relevant teaching to reach middle schoolers where they are.',
    },

    // ====================== HIGH SCHOOL ======================
    {
        id: 'confirmation',
        title: 'Confirmation',
        subtitle: '7th Grade and Up',
        ageRange: 'Age 12+',
        group: 'high-school',
        shortDescription: 'Preparation for the Sacrament of Confirmation and life as a disciple.',
        longDescription:
            'Our Confirmation preparation program welcomes students in 7th grade and older who are ready to receive the Sacrament of Confirmation. The program combines catechesis, service, retreat experiences, and reflection on the gifts of the Holy Spirit.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – Confirmation Room',
        catechists: [
            {
                id: 'fr-todd-vandermay',
                name: 'Fr. Todd VanderMay',
                role: 'Pastor & Confirmation Coordinator',
                photo: '/FrToddVanderMay.jpg',
                safeEnvironmentPdf: '/safe-env/fr-todd-vandermay.pdf',
            },
            {
                id: 'jeff-cook',
                name: 'Jeff Cook',
                role: 'Confirmation Catechist',
                photo: '/catechists/jeff-cook.jpg',
                safeEnvironmentPdf: '/safe-env/jeff-cook.pdf',
            },
            {
                id: 'martha-cook',
                name: 'Martha Cook',
                role: 'Confirmation Catechist',
                photo: '/catechists/martha-cook.jpg',
                safeEnvironmentPdf: '/safe-env/martha-cook.pdf',
            },
            {
                id: 'alex-whitney',
                name: 'Alex Whitney',
                role: 'Confirmation Catechist',
                photo: '/AlexWhitney.jpg',
                safeEnvironmentPdf: '/safe-env/alex-whitney.pdf',
            },
        ],
        photos: [
            '/faith-formation/confirmation-1.jpg',
            '/faith-formation/confirmation-2.jpg',
            '/faith-formation/confirmation-3.jpg',
        ],
        resources: [
            {
                title: 'Chosen',
                description: 'Ascension Press\' comprehensive Confirmation preparation program, including videos, workbooks, and leader guides.',
                publisher: 'Ascension Press',
                link: 'https://ascensionpress.com/collections/chosen',
            },
            {
                title: 'Decision Point',
                description: 'Dynamic Catholic\'s Confirmation prep program that combines Scripture, Catechism, and engaging multimedia.',
                publisher: 'Dynamic Catholic',
            },
        ],
        aboutText:
            'Confirmation is a pivotal moment in the life of a young Catholic. Our multi-year preparation process includes catechesis, service hours, a retreat, and reflection on the gifts and fruits of the Holy Spirit. Candidates are paired with sponsors who walk with them on their journey.',
    },
    {
        id: 'lifeteen',
        title: 'Lifeteen',
        subtitle: 'High School',
        programName: 'Lifeteen',
        ageRange: 'Ages 14 – 18',
        group: 'high-school',
        shortDescription: 'Life Teen — high school ministry with vibrant community and authentic faith.',
        longDescription:
            'Life Teen is our high school ministry program for 9th through 12th graders. It\'s a vibrant community where teens can encounter Christ, build real friendships, and grow in their faith through relevant teaching, small groups, and service.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – Life Teen Room',
        catechists: [
            {
                id: 'bobby-myers',
                name: 'Bobby Myers',
                role: 'Director of Religious Education & Life Teen Coordinator',
                photo: '/BobbyMeyers.jpg',
                safeEnvironmentPdf: '/safe-env/bobby-myers.pdf',
            },
            {
                id: 'jim-blackwell',
                name: 'Jim Blackwell',
                role: 'Life Teen Catechist',
                photo: '/catechists/jim-blackwell.jpg',
                safeEnvironmentPdf: '/safe-env/jim-blackwell.pdf',
            },
            {
                id: 'jess-skinner',
                name: 'Jess Skinner',
                role: 'Life Teen Catechist',
                photo: '/catechists/jess-skinner.jpg',
                safeEnvironmentPdf: '/safe-env/jess-skinner.pdf',
            },
        ],
        photos: [
            '/faith-formation/lifeteen-1.jpg',
            '/faith-formation/lifeteen-2.jpg',
            '/faith-formation/lifeteen-3.jpg',
        ],
        resources: [
            {
                title: 'Life Teen Program',
                description: 'A nationwide Catholic movement for high school teens, with a complete curriculum, retreats, and small group materials.',
                publisher: 'Life Teen',
                link: 'https://lifeteen.com/',
            },
            {
                title: 'YDisciple',
                description: 'Life Teen\'s small-group video-based discipleship program.',
            },
        ],
        aboutText:
            'Life Teen is where high schoolers come to be themselves, encounter Christ, and grow in friendship with Him and with one another. Through large-group nights, small groups, retreats, and service projects, teens discover that faith is exciting, relevant, and life-giving.',
    },

    // ====================== ADULT ======================
    {
        id: 'ocia',
        title: 'OCIA',
        subtitle: 'Rite of Christian Initiation for Adults',
        programName: 'OCIA',
        ageRange: 'Adults',
        group: 'adult',
        shortDescription: 'For adults seeking full initiation into the Catholic Church.',
        longDescription:
            'OCIA (Order of Christian Initiation of Adults) is the process by which adults are welcomed into the Catholic Church. It is a journey of faith, study, prayer, and discernment — open to unbaptized adults, baptized Christians from other denominations, and baptized Catholics seeking Confirmation and Eucharist.',
        meetingTime: 'Mondays 6:15 PM - 7:30 PM',
        location: 'Parish Hall – OCIA Room',
        catechists: [
            { id: 'anthony-flores', name: 'Anthony Flores', role: 'OCIA Coordinator', photo: '/AnthonyFlores.jpg', safeEnvironmentPdf: '/safe-env/anthony-flores.pdf' },
            { id: 'christine-moore', name: 'Christine Moore', role: 'OCIA Team', photo: '/catechists/christine-moore.jpg', safeEnvironmentPdf: '/safe-env/christine-moore.pdf' },
            { id: 'don-moore', name: 'Don Moore', role: 'OCIA Team', photo: '/catechists/don-moore.jpg', safeEnvironmentPdf: '/safe-env/don-moore.pdf' },
            { id: 'chad-carroll', name: 'Chad Carroll', role: 'OCIA Team', photo: '/ChadCarroll.jpg', safeEnvironmentPdf: '/safe-env/chad-carroll.pdf' },
            { id: 'carol-peters', name: 'Carol Peters', role: 'OCIA Team', photo: '/catechists/carol-peters.jpg', safeEnvironmentPdf: '/safe-env/carol-peters.pdf' },
            { id: 'tesia-walker', name: 'Tesia Walker', role: 'OCIA Team', photo: '/catechists/tesia-walker.jpg', safeEnvironmentPdf: '/safe-env/tesia-walker.pdf' },
            { id: 'lexen-smith', name: 'Lexen Smith', role: 'OCIA Team', photo: '/catechists/lexen-smith.jpg', safeEnvironmentPdf: '/safe-env/lexen-smith.pdf' },
            { id: 'neil-whartman', name: 'Neil Whartman', role: 'OCIA Team', photo: '/NeilWhartman.jpg', safeEnvironmentPdf: '/safe-env/neil-whartman.pdf' },
            { id: 'kelli-whartman-ocia', name: 'Kelli Whartman', role: 'OCIA Team', photo: '/catechists/kelli-whartman.jpg', safeEnvironmentPdf: '/safe-env/kelli-whartman.pdf' },
        ],
        photos: ['/faith-formation/ocia-1.jpg', '/faith-formation/ocia-2.jpg'],
        resources: [
            {
                title: 'OCIA (RCIA) Process',
                description: 'The official rite and process for initiating adults into the Catholic Church.',
                publisher: 'United States Conference of Catholic Bishops',
                link: 'https://www.usccb.org/prayer-and-worship/sacraments/rcia',
            },
            {
                title: 'Catechism of the Catholic Church',
                description: 'The authoritative source for Catholic teaching, used throughout the OCIA journey.',
                publisher: 'USCCB',
                link: 'https://www.usccb.org/sites/default/files/flipbooks/catechism/index.html',
            },
            {
                title: 'Catholic Study Bible',
                description: 'A study Bible with helpful notes for understanding Scripture in light of Catholic tradition.',
            },
        ],
        aboutText:
            'OCIA is a journey, not a class. It typically begins each fall with an Inquiry period, moves through Catechumenate and Purification, and culminates at the Easter Vigil when candidates receive the Sacraments of Initiation (Baptism, Confirmation, and Eucharist). Sponsors walk with candidates throughout the process, providing prayer, witness, and fellowship.',
    },
    {
        id: 'adult-education',
        title: 'Adult Education Classes',
        ageRange: 'Adults',
        group: 'adult',
        shortDescription: 'Continuing education in faith, scripture, and spiritual growth for adults.',
        longDescription:
            'Our Adult Education program offers a variety of ongoing classes, Bible studies, and formation opportunities for adults who want to deepen their faith and understanding of Catholic teaching.',
        meetingTime: MEETING_TIME,
        location: 'Parish Hall – Adult Ed Room',
        catechists: [
            { id: 'melanie-karp', name: 'Melanie Karp', role: 'Adult Ed Coordinator', photo: '/MelanieKarp.jpg', safeEnvironmentPdf: '/safe-env/melanie-karp.pdf' },
            { id: 'hugh-brechtel', name: 'Hugh Brechtel', role: 'Adult Ed Catechist', photo: '/catechists/hugh-brechtel.jpg', safeEnvironmentPdf: '/safe-env/hugh-brechtel.pdf' },
            { id: 'carol-brechtel-adult', name: 'Carol Brechtel', role: 'Adult Ed Catechist', photo: '/catechists/carol-brechtel.jpg', safeEnvironmentPdf: '/safe-env/carol-brechtel.pdf' },
            { id: 'chad-carroll-adult', name: 'Chad Carroll', role: 'Adult Ed Catechist', photo: '/ChadCarroll.jpg', safeEnvironmentPdf: '/safe-env/chad-carroll.pdf' },
            { id: 'bob-case', name: 'Bob Case', role: 'Adult Ed Catechist', photo: '/BobCase.jpg', safeEnvironmentPdf: '/safe-env/bob-case.pdf' },
            { id: 'kevin-baltzer', name: 'Kevin Baltzer', role: 'Adult Ed Catechist', photo: '/Kevin-Baltzer.jpg', safeEnvironmentPdf: '/safe-env/kevin-baltzer.pdf' },
            { id: 'fr-mark-mccormick', name: 'Fr. Mark McCormick', role: 'Adult Ed Catechist', photo: '/FrMark.jpg', safeEnvironmentPdf: '/safe-env/fr-mark-mccormick.pdf' },
        ],
        photos: ['/faith-formation/adult-ed-1.jpg', '/faith-formation/adult-ed-2.jpg'],
        resources: [
            {
                title: 'The Great Adventure Bible Study',
                description: 'A timeline-based approach to understanding the story of salvation history.',
                publisher: 'Ascension Press',
            },
            {
                title: 'FORMED',
                description: 'A Catholic streaming service with Bible studies, movies, audiobooks, and children\'s programs.',
                link: 'https://formed.org',
            },
            {
                title: 'Various Books & Studies',
                description: 'Throughout the year, different small groups study various books of the Bible, the Catechism, and works of Catholic authors.',
            },
        ],
        aboutText:
            'Adult Education at St. Therese provides ongoing formation for adults at every stage of their faith journey. Classes meet on Wednesdays during the school year, and additional studies are offered seasonally (Advent, Lent).',
    },
];

export const substituteTeachers: Catechist[] = [
    {
        id: 'rita-dupres',
        name: 'Rita Dupres',
        role: 'Substitute Teacher',
        photo: '/catechists/rita-dupres.jpg',
        safeEnvironmentPdf: '/safe-env/rita-dupres.pdf',
    },
];

export function getFaithCategoryById(id: string): FaithCategory | undefined {
    return faithCategories.find((cat) => cat.id === id);
}

export const faithCategoriesByGroup = {
    elementary: faithCategories.filter((c) => c.group === 'elementary'),
    middleSchool: faithCategories.filter((c) => c.group === 'middle-school'),
    highSchool: faithCategories.filter((c) => c.group === 'high-school'),
    adult: faithCategories.filter((c) => c.group === 'adult'),
};
