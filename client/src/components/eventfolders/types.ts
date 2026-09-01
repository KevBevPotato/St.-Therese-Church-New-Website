// src/data/events/types.ts
export type EventCategory = 'sacramental' | 'parishEvents' | 'special' | 'meeting' | 'vocations' | 'diocesan' | 'carloAcutis';
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
    organizationTags?: string[];
}
