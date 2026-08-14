// src/data/staff.ts
export interface StaffMember {
  slug: string;
  name: string;
  titles: string[];
  email?: string;
  phone?: string;
  categories: Array<'clergy' | 'staff' | 'catechist' | 'council' | 'music' | 'ministries'>;
  photo?: string;
  photoPosition?: string;
  photoFit?: 'cover' | 'contain';
  duties?: string;
  bio?: string;
}

export const baseStaffMembers: Array<Omit<StaffMember, 'duties' | 'bio'>> = [
  // CLERGY
  {
    slug: 'fr-mark-mccormick',
    name: 'Fr. Mark McCormick',
    titles: ['Pastor'],
    email: 'mmccormick@diorc.org',
    categories: ['clergy'],
    photo: '/FrMark.jpg',
    photoPosition: 'center 24%',
    photoFit: 'cover',
  },
  {
    slug: 'fr-todd-vandermay',
    name: 'Fr. Todd VanderMay',
    titles: ['Associate Pastor'],
    email: 'tvandermay@diorc.org',
    categories: ['clergy'],
    photo: '/FrToddVanderMay.jpg',
    photoPosition: 'center 22%',
    photoFit: 'cover',
  },
  {
    slug: 'dcn-chuck-rausch',
    name: 'Deacon Chuck Rausch',
    titles: ['Retired Deacon'],
    email: 'crausch@diorc.org',
    categories: ['clergy'],
    photo: '/DcnChuck.jpg',
    photoPosition: 'center 28%',
    photoFit: 'cover',
  },
  {
    slug: 'dcn-don-moore',
    name: 'Deacon Don Moore',
    titles: ['Deacon'],
    email: 'dmoore@diorc.org',
    categories: ['clergy'],
    photo: '/DcnDon.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },

  // STAFF
  {
    slug: 'bobby-myers',
    name: 'Bobby Myers',
    titles: ['Director of Religious Education'],
    email: 'bmyers@diorc.org',
    categories: ['staff'],
    photo: '/BobbyMeyers.jpg',
    photoPosition: 'center 24%',
    photoFit: 'cover',
  },
  {
    slug: 'connie-heeren',
    name: 'Connie Heeren',
    titles: ['Staff'],
    email: 'cheeren@diorc.org',
    categories: ['staff'],
    photo: '/ConnieHeeran.jpg',
    photoPosition: 'center 21%',
    photoFit: 'cover',
  },
  {
    slug: 'melanie-karp',
    name: 'Melanie Karp',
    titles: ['Staff'],
    email: 'mkarp@diorc.org',
    categories: ['staff'],
    photo: '/MelanieKarp.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'elaine-duncan',
    name: 'Elaine Duncan',
    titles: ['Staff'],
    categories: ['staff'],
    photo: '/ElaineDuncan.jpg',
    photoPosition: 'center 24%',
    photoFit: 'cover',
  },
  {
    slug: 'faye-clough',
    name: 'Faye Clough',
    titles: ['Staff'],
    categories: ['staff'],
    photo: '/FayeClough.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'lorinda-collings',
    name: 'Lorinda Collings',
    titles: ['Staff'],
    email: 'lorinda.collings@ojbh.org',
    categories: ['staff'],
    photo: '/LorindaCollings.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'anthony-flores',
    name: 'Anthony Flores',
    titles: ['OCIA Coordinator'],
    categories: ['staff'],
    photo: '/AnthonyFlores.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },

  // CATECHISTS
  {
    slug: 'kevin-baltzer',
    name: 'Kevin Baltzer',
    titles: ['Director of Evangelization & Adult & Family Formation'],
    email: 'kbaltzer@diorc.org',
    categories: ['staff'],
    photo: '/Kevin-Baltzer.jpg',
    photoPosition: 'center 35%',
    photoFit: 'cover',
  },

  // PARISH COUNCIL
  {
    slug: 'chad-carroll',
    name: 'Chad Carroll',
    titles: ['President', 'Buildings & Grounds'],
    categories: ['council'],
    photo: '/ChadCarroll.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'neil-whartman',
    name: 'Neil Whartman',
    titles: ['Vice-President', 'Faith Formation'],
    categories: ['council'],
    photo: '/NeilWhartman.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'carman-timmerman',
    name: 'Carman Timmerman',
    titles: ['Secretary'],
    categories: ['council'],
    photo: '/CarmanTimmerman.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'jean-french',
    name: 'Jean French',
    titles: ['Stewardship'],
    categories: ['council'],
    photo: '/JeanFrench.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'alex-whitney',
    name: 'Alex Whitney',
    titles: ['Member'],
    categories: ['council'],
    photo: '/AlexWhitney.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },

  // MUSIC MINISTRY
  {
    slug: 'sue-englin',
    name: 'Sue Englin',
    titles: ['Music Ministry'],
    email: 'insback40@gmail.com',
    categories: ['music'],
    photo: '/SueEnglin.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'jeanne-schneider',
    name: 'Jeanne Schneider',
    titles: ['Music Ministry'],
    email: 'Jeanne@KTLLP.com',
    categories: ['music'],
    photo: '/JeanneSchneider.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'jolene-click',
    name: 'Jolene Click',
    titles: ['Music Ministry'],
    email: 'misterpallet@msn.com',
    categories: ['music'],
    photo: '/Logo.webp',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'mary-boydston',
    name: 'Mary Boydston',
    titles: ['New Underwood Music Ministry'],
    email: 'mary.boydston@yahoo.com',
    categories: ['music'],
    photo: '/Logo.webp',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },

  // OTHER MINISTRIES
  {
    slug: 'doug-keyser',
    name: 'Doug Keyser',
    titles: ['Knights of Columbus Grand Knight'],
    categories: ['ministries'],
    photo: '/DougKeyser.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'elaine-kocher',
    name: 'Elaine Kocher',
    titles: ['Altar Society President'],
    categories: ['ministries'],
    photo: '/ElaineKocher.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'bob-case',
    name: 'Bob Case',
    titles: ['Lector Training'],
    email: 'bobcaserhc@rushmore.com',
    categories: ['ministries'],
    photo: '/BobCase.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'dick-cuka',
    name: 'Dick Cuka',
    titles: ['Usher Training (4:30 pm)'],
    categories: ['ministries'],
    photo: '/DickCuka.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'al-solano',
    name: 'Al Solano',
    titles: ['Usher Training (9 am)'],
    categories: ['ministries'],
    photo: '/AlSolano.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'dave-vancleave',
    name: 'Dave VanCleave',
    titles: ['Usher Training (5:30 pm)'],
    categories: ['ministries'],
    photo: '/DaveVanCleave.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    slug: 'toni-weber',
    name: 'Toni Weber',
    titles: ['Catholic Daughters'],
    categories: ['ministries'],
    photo: '/ToniWeber.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
];

// Custom overrides keyed by slug — anything left out falls back to the default
const staffOverrides: Record<string, Pick<StaffMember, 'duties' | 'bio'>> = {
  'kevin-baltzer': {
    duties:
      'I\'m in charge of Adult & Family Ministry, which is being taught on Sundays & Wednesdays — see the "Faith Formation" tab for more information.\nI\'m also the staff designated IT guy who built this new website and will keep it running and updated!',
    bio:
      "Growing up on a farm southwest of Huron, SD, I earned my Chemical Engineering degree from South Dakota Mines before spending three years as a full-time missionary with FOCUS Catholic. Today, I serve as the Director of Evangelization and Adult & Family Formation at St. Thérèse the Little Flower Parish in Rapid City. Driven by a love for classical learning and Catholic youth formation, I am thrilled to join Chesterton Academy of Blessed Alcuin of York to teach mathematics and bring both a technical foundation and a missionary heart into the classroom!\n\nHe currently lives in the Rapid Valley area with his wife Katie (married by Fr. Mark on 9/1/24) and their daughter Lucia, born June 26.",
  },
  // future overrides go here, e.g.:
  'fr-mark-mccormick': {
    duties: 
      'Fr. Mark is serving as Head Pastor of St. Thérèse the Little Flower & the St. Carlo Acutis Catholic Student Center, serving alongside Fr. Todd VanderMay.',
    bio: 
      'Fr. Mark was born in Rapid City, SD, and grew up in the Black Hills. He attended St. Martin\'s College in Lacey, WA, and graduated with a degree in Philosophy. He then attended Mount Angel Seminary in St. Benedict, OR, where he earned a Master of Divinity degree. Fr. Mark was ordained to the priesthood on May 30, 1999, and has served in various parishes throughout the Diocese of Rapid City.',
  },
    'anthony-flores': {
    duties:
      'Anthony serves as the OCIA Coordinator, guiding individuals through the process of becoming fully initiated members of the Catholic Church. He is passionate about helping others grow in their faith and understanding of Catholic teachings.',
    bio:
      "Anthony Flores is a dedicated member of the St. Thérèse the Little Flower parish community, serving as the OCIA Coordinator. With a deep commitment to faith formation, Anthony guides individuals through the process of becoming fully initiated members of the Catholic Church. His passion for helping others grow in their faith and understanding of Catholic teachings is evident in his work with catechumens and candidates. Anthony's approachable nature and knowledge of Church doctrine make him an invaluable resource for those seeking to deepen their spiritual journey.",
  },
};

const defaultDuties = 'Serving the parish community with care and dedication.';
const defaultBio = 'More information about this ministry role will be shared soon.';


export const staffMembers: StaffMember[] = baseStaffMembers.map((m) => ({
  ...m,
  ...(staffOverrides[m.slug] ?? {}),
  duties: staffOverrides[m.slug]?.duties ?? defaultDuties,
  bio: staffOverrides[m.slug]?.bio ?? defaultBio,
}));

export const staffCategories = [
  { id: 'all', label: 'All Personnel' },
  { id: 'clergy', label: 'Clergy' },
  { id: 'staff', label: 'Staff' },
  { id: 'catechist', label: 'Catechists' },
  { id: 'council', label: 'Parish Council' },
  { id: 'music', label: 'Music Ministry' },
  { id: 'ministries', label: 'Other Ministries' },
] as const;

export const getStaffBySlug = (slug: string) =>
  staffMembers.find((m) => m.slug === slug);
