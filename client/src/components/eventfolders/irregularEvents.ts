import { CalendarEvent } from './types';
import eventData from './irregularEvents.json';

export const irregularEvents: CalendarEvent[] = (eventData as any).events.map((event: any) => ({
    ...event,
    date: new Date(event.date),
    categories: (event.categories || []).map((c: any) => {
        if (typeof c === 'object' && c.category) return c.category;
        if (typeof c === 'string') return c.trim();
        return 'parishEvents';
    })
}));
