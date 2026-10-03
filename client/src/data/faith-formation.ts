import faithFormationData from './faith-formation.json';

// 2026-2027 Wednesday Night Catechists & Faith Formation Programs

export interface Catechist {
    id?: string;                       // ✅ you already have this on objects
    name: string;
    photo?: string;
    photoPosition?: string;
    role?: string;
    email?: string;                    // ✅ for landing-page contact display
    phone?: string;                    // optional, helpful for parish office
    safeEnvironmentPdf?: string;       // ✅ for "Safe Environment Verified" link
    bio?: string;                      // optional, for future bio expansion
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
export const faithFormationSettings = faithFormationData.settings;

export const faithCategories: FaithCategory[] = faithFormationData.categories as FaithCategory[];

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
