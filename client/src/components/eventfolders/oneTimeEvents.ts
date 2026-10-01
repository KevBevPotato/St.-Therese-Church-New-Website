import { CalendarEvent } from './types';
import eventData from './oneTimeEvents.json';

export const oneTimeEvents: CalendarEvent[] = (eventData as any).events.map((event: any) => ({
    ...event,
    date: new Date(event.date),
    categories: (event.categories || []).map((c: any) => {
        if (typeof c === 'object' && c.category) return c.category; // Handles CMS list objects
        if (typeof c === 'string') return c.trim(); // Handles legacy comma strings
        return 'parishEvents'; // Default fallback
    })
}));
