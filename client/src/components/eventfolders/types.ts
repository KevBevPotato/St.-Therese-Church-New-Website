// src/data/events/types.ts
export type EventCategory = 'sacramental' | 'parishEvents' | 'meeting' | 'vocations' | 'diocesan'; // Removed 'special' and 'carloAcutis'
export type EventOrganizationTag =
    | 'knights-of-columbus'
    | 'altar-society'
    | 'catholic-daughters'
    | 'st-vincent-de-paul'
    | 'faith-formation';
export type TimeFilter = 'all' | 'thisMonth' | 'nextMonth' | 'twoPlus';

export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    time: string;
    location: string;
    categories: EventCategory[];
    description?: string;
    image?: string; // This is for the Hero image
    about?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    signupLink?: string;
    photos?: string[]; // <--- CHANGE THIS from 'images' to 'photos'
    gallery?: { photo: string; caption?: string }[]; // <--- ADD THIS LINE
    faqItems?: Array<{ question: string; answer: string }>;
    linkedOpportunityId?: string;
    organizationTags?: EventOrganizationTag[];
    isHidden?: boolean;
}
export const EVENT_COLORS: Record<EventCategory, { bg: string; border: string; dot: string; label: string; labelColor: string }> = {
    sacramental: { bg: 'bg-amber-50', border: 'border-amber-400', dot: 'bg-amber-500', label: 'Sacramental Life', labelColor: 'text-amber-700' },
    parishEvents: { bg: 'bg-emerald-50', border: 'border-emerald-400', dot: 'bg-emerald-500', label: 'Parish Events', labelColor: 'text-emerald-700' },
    meeting: { bg: 'bg-slate-50', border: 'border-slate-400', dot: 'bg-slate-500', label: 'Meeting', labelColor: 'text-slate-700' },
    vocations: { bg: 'bg-purple-50', border: 'border-purple-400', dot: 'bg-purple-500', label: 'Vocations', labelColor: 'text-purple-700' },
    diocesan: { bg: 'bg-blue-50', border: 'border-blue-400', dot: 'bg-blue-500', label: 'Diocesan', labelColor: 'text-blue-700' },
};
