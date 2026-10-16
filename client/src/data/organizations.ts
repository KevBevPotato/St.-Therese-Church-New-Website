import altarSociety from './organization-pages/altar-society.json';
import catholicDaughters from './organization-pages/catholic-daughters.json';
import knightsOfColumbus from './organization-pages/knights-of-columbus.json';
import stVincentDePaul from './organization-pages/st-vincent-de-paul.json';
import { visibleContent } from './visible-content';

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
    isHidden?: boolean;
}

export interface Member {
    id: string;
    name: string;
    photo?: string;
    photoPosition?: string;
    yearsAsMember?: number;
    email?: string;
    phone?: string;
    bio?: string;
    isHidden?: boolean;
}

export interface Organization {
    id: string;
    name: string;
    tagline: string;
    description: string;
    audienceTag?: string;
    audience?: string;
    founded?: number;
    meetingSchedule?: string;
    room?: string;
    heroImage?: string;
    gallery?: Array<{
        photo: string;
        caption?: string;
        linkUrl?: string;
        showInCarousel?: boolean;
    }>;
    hideMembersSection?: boolean;
    hideUpcomingEventsSection?: boolean;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    joinUrl?: string;
    stats?: Array<{ label: string; value: string }>;
    officers?: Officer[];
    members?: Member[];
}

export const organizations: Organization[] = [
    knightsOfColumbus,
    altarSociety,
    stVincentDePaul,
    catholicDaughters,
].flatMap((organization) => visibleContent([organization]));

export function getOrganizationById(id: string): Organization | undefined {
    return organizations.find(o => o.id === id);
}
