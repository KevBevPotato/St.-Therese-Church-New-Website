import { CalendarEvent } from './types';
import eventData from './oneTimeEvents.json';

export const oneTimeEvents: CalendarEvent[] = (eventData as any).events.map((event: any) => {
    // If the date is in YYYY-MM-DD format, append T00:00:00 to prevent timezone shifting
    const dateString = typeof event.date === 'string' && event.date.length === 10
        ? `${event.date}T00:00:00`
        : event.date;

    return {
        ...event,
        date: new Date(dateString),
        categories: (event.categories || []).map((c: any) => {
            if (typeof c === 'object' && c.category) return c.category;
            if (typeof c === 'string') return c.trim();
            return 'parishEvents';
        })
    };
});
