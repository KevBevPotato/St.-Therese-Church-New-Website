import organizationData from './organizations_data.json';

// --- File: client/src/data/organizations.ts ---

export interface Officer {
    id: string;
    name: string;
    title: string;
    photo?: string;
    photoPosition?: string;
    email?: string;
    phone?: string;
    bio?: string;
}

export interface Member {
    id: string;
    name: string;
    photo?: string;
    photoPosition?: string;
    yearsAsMember?: number;
}

export interface Organization {
    id: string;
    name: string;
    tagline: string;
    description: string;
    audienceTag: "Men's" | "Women's";
    audience: string; // For display: "Men of the Parish" | "Women of the Parish"
    founded: number;
    meetingSchedule: string;
    room?: string;
    heroImage?: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    joinUrl?: string;
    stats: Array<{ label: string; value: string }>;
    officers: Officer[];
    members: Member[];
}

export const organizations: Organization[] = organizationData.organizations as Organization[];

export function getOrganizationById(id: string): Organization | undefined {
    return organizations.find(o => o.id === id);
}
