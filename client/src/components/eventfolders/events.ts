import { CalendarEvent, EventCategory, TimeFilter } from './types';
import { oneTimeEvents } from './oneTimeEvents';
import { irregularEvents } from './irregularEvents';
import recurringData from './recurringRules.json';

export type { CalendarEvent, EventCategory, TimeFilter };
export type ExtendedTimeFilter = TimeFilter | 'thisWeek' | 'calendarMonth' | 'specificDay';

export const EVENT_COLORS: Record<EventCategory, { bg: string; border: string; dot: string; label: string; labelColor: string }> = {
    sacramental: { bg: 'bg-amber-50', border: 'border-amber-400', dot: 'bg-amber-500', label: 'Sacramental Life', labelColor: 'text-amber-700' },
    parishEvents: { bg: 'bg-emerald-50', border: 'border-emerald-400', dot: 'bg-emerald-500', label: 'Parish Events', labelColor: 'text-emerald-700' },
    meeting: { bg: 'bg-slate-50', border: 'border-slate-400', dot: 'bg-slate-500', label: 'Meeting', labelColor: 'text-slate-700' },
    vocations: { bg: 'bg-purple-50', border: 'border-purple-400', dot: 'bg-purple-500', label: 'Vocations', labelColor: 'text-purple-700' },
    diocesan: { bg: 'bg-blue-50', border: 'border-blue-400', dot: 'bg-blue-500', label: 'Diocesan', labelColor: 'text-blue-700' },
};

export const staticEvents: CalendarEvent[] = [
    ...oneTimeEvents,
    ...irregularEvents,
];

export function generateRecurringEventsForMonth(month: number, year: number): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // --- PERPETUAL RECURRING (Hard-coded for Mass) ---
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

        // --- CMS-DRIVEN RECURRING RULES ---
        (recurringData as any).rules.forEach((rule: any) => {
            // FIX 1: Handle the date popup format (YYYY-MM-DD) to prevent timezone shift
            const normalizeDate = (dStr: string) => {
                if (!dStr) return null;
                // If the date is only 10 chars (YYYY-MM-DD), append T00:00:00 for local time
                return dStr.length === 10 ? new Date(`${dStr}T00:00:00`) : new Date(dStr);
            };

            const ruleStartDate = normalizeDate(rule.startDate) || new Date(0);
            const ruleEndDate = normalizeDate(rule.endDate) || new Date(2100, 0, 1);

            // FIX 2: Handle Exclusions as a list of objects instead of a comma-string
            // We map the array of objects [{date: '...'}, {date: '...'}] into a simple array of strings
            const exclusions = Array.isArray(rule.exclusions)
                ? rule.exclusions.map((ex: any) => ex.date)
                : [];

            // Basic check: Is it the right day of the week and within the date range?
            if (d.getDay() === rule.dayOfWeek && d >= ruleStartDate && d <= ruleEndDate && !exclusions.includes(dateStr)) {

                let shouldShow = false;

                if (rule.recurrenceType === 'monthly') {
                    // Monthly: Check if it's the 1st, 2nd, 3rd, etc. week
                    const currentOrdinal = Math.ceil(day / 7);
                    if (currentOrdinal === parseInt(rule.ordinalWeek || "0")) {
                        shouldShow = true;
                    }
                } else {
                    // Weekly: Just show every time it hits that day of the week
                    shouldShow = true;
                }

                if (shouldShow) {
                    events.push({
                        id: `${rule.id}-${dateStr}`,
                        title: rule.title,
                        date: new Date(year, month, day, 18, 0),
                        time: rule.time,
                        location: rule.location,
                        categories: rule.categories.map((c: any) => c.category || c),
                        description: rule.description,
                    });
                }
            }
        });
    }
    return events;
}

staticEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
