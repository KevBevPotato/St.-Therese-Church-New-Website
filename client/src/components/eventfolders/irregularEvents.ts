import { CalendarEvent } from './types';
import eventData from './irregularEvents.json'; // Changed path to ./

export const irregularEvents: CalendarEvent[] = (eventData as any).events.map((event: any) => ({
    ...event,
    date: new Date(event.date)
}));
