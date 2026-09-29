import { CalendarEvent } from './types';
import eventData from './oneTimeEvents.json'; // Changed path to ./

export const oneTimeEvents: CalendarEvent[] = (eventData as any).events.map((event: any) => ({
    ...event,
    date: new Date(event.date)
}));
