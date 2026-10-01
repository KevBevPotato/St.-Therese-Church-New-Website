import { CalendarEvent } from './types';
import eventData from './oneTimeEvents.json';

export const oneTimeEvents: CalendarEvent[] = (eventData as any).events.map((event: any) => ({
    ...event,
    date: new Date(event.date),
    categories: typeof event.categories === 'string'
        ? event.categories.split(',').map((c: string) => c.trim())
        : event.categories
}));
