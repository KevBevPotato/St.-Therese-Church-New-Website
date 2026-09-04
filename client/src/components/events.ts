import { CalendarEvent, EventCategory, TimeFilter } from './eventfolders/types';
import { oneTimeEvents } from './eventfolders/oneTimeEvents';
import { irregularEvents } from './eventfolders/irregularEvents';

export type { CalendarEvent, EventCategory, TimeFilter };

export const EVENT_COLORS: Record<EventCategory, { bg: string; border: string; dot: string; label: string; labelColor: string }> = {
    sacramental:  { bg: 'bg-amber-50',    border: 'border-amber-400',    dot: 'bg-amber-500',    label: 'Sacramental Life', labelColor: 'text-amber-700' },
    parishEvents: { bg: 'bg-emerald-50',  border: 'border-emerald-400',  dot: 'bg-emerald-500',  label: 'Parish Events',    labelColor: 'text-emerald-700' },
    meeting:      { bg: 'bg-slate-50',    border: 'border-slate-400',    dot: 'bg-slate-500',    label: 'Meeting',          labelColor: 'text-slate-700' },
    vocations:    { bg: 'bg-purple-50',   border: 'border-purple-400',   dot: 'bg-purple-500',   label: 'Vocations',        labelColor: 'text-purple-700' },
    diocesan:     { bg: 'bg-blue-50',     border: 'border-blue-400',     dot: 'bg-blue-500',     label: 'Diocesan',         labelColor: 'text-blue-700' },
};

// HUB: Combine all static lists. The sort at the bottom handles the order.
export const staticEvents: CalendarEvent[] = [
    ...oneTimeEvents,
    ...irregularEvents,
];

/**
 * PERPETUAL & FINITE RECURRING LOGIC
 */
export function generateRecurringEventsForMonth(month: number, year: number): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // --- PERPETUAL RECURRING (Forever) ---
        if (d.getDay() >= 1 && d.getDay() <= 5) {
            events.push({
                id: `mass-daily-${dateStr}`,
                title: 'Daily Mass',
                date: new Date(year, month, day, 7, 30),
                time: '7:30 AM',
                location: 'Main Sanctuary',
                categories: ['sacramental'],
                description: 'Daily Mass — Monday through Friday.',
            });
            events.push({
                id: `rosary-daily-${dateStr}`,
                title: "Daily Rosary",
                date: new Date(year, month, day, 7, 0),
                time: "7:00 AM",
                location: "Main Sanctuary",
                categories: ["sacramental"],
            });
        }
        if (d.getDay() === 6) {
            events.push({
                id: `mass-saturday-${dateStr}`,
                title: 'Saturday Vigil Mass',
                date: new Date(year, month, day, 16, 30),
                time: '4:30 PM',
                location: 'Main Sanctuary',
                categories: ['sacramental'],
            });
        }
        if (d.getDay() === 0) {
            events.push({ id: `mass-sunday-am-${dateStr}`, title: 'Sunday Mass (9:00 AM)', date: new Date(year, month, day, 9, 0), time: '9:00 AM', location: 'Main Sanctuary', categories: ['sacramental'] });
            events.push({ id: `mass-sunday-pm-${dateStr}`, title: 'Sunday Mass (5:30 PM)', date: new Date(year, month, day, 17, 30), time: '5:30 PM', location: 'Main Sanctuary', categories: ['sacramental'] });
            events.push({ id: `rosary-sun-${dateStr}`, title: "Family Rosary", date: new Date(year, month, day, 19, 0), time: "7:00 PM", location: "Main Sanctuary", categories: ["sacramental", "parishEvents"] });
        }
        if (d.getDay() === 5) {
            events.push({ id: `holyhour-${dateStr}`, title: "Holy Hour", date: new Date(year, month, day, 8, 0), time: "8:00 AM - 9:00 AM", location: "Main Sanctuary", categories: ["sacramental"] });
        }

        // --- FINITE RECURRING (e.g. School Year Sept-May) ---
        if (d.getDay() === 3) {
            const schoolYearStart = new Date(2026, 8, 2);
            const schoolYearEnd = new Date(2027, 4, 19);
            const exclusions = ["2026-11-25", "2026-12-23", "2026-12-30", "2027-03-31"];
            if (d >= schoolYearStart && d <= schoolYearEnd && !exclusions.includes(dateStr)) {
                events.push({
                    id: `family-formation-${dateStr}`,
                    title: "Wednesday Night Family Formation",
                    date: new Date(year, month, day, 17, 30),
                    time: "5:30 PM - 7:30 PM",
                    location: "Parish Hall & Classrooms",
                    categories: ["parishEvents", "sacramental"],
                    linkedOpportunityId: "wednesday-night-supper"
                });
            }
        }
    }
    return events;
}

// final AUTO-SORT for all merged static files
staticEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
