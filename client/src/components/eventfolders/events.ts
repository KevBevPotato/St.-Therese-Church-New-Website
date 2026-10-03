import { CalendarEvent, EventCategory, EventOrganizationTag, TimeFilter } from './types';
import { oneTimeEvents } from './oneTimeEvents';
import recurringData from './recurringRules.json';

export type { CalendarEvent, EventCategory, EventOrganizationTag, TimeFilter };
export type ExtendedTimeFilter = TimeFilter | 'thisWeek' | 'calendarMonth' | 'specificDay';

export const EVENT_COLORS: Record<EventCategory, { bg: string; border: string; dot: string; label: string; labelColor: string }> = {
    sacramental: { bg: 'bg-amber-50', border: 'border-amber-400', dot: 'bg-amber-500', label: 'Sacramental Life', labelColor: 'text-amber-700' },
    parishEvents: { bg: 'bg-emerald-50', border: 'border-emerald-400', dot: 'bg-emerald-500', label: 'Parish Events', labelColor: 'text-emerald-700' },
    meeting: { bg: 'bg-slate-50', border: 'border-slate-400', dot: 'bg-slate-500', label: 'Meeting', labelColor: 'text-slate-700' },
    vocations: { bg: 'bg-purple-50', border: 'border-purple-400', dot: 'bg-purple-500', label: 'Vocations', labelColor: 'text-purple-700' },
    diocesan: { bg: 'bg-blue-50', border: 'border-blue-400', dot: 'bg-blue-500', label: 'Diocesan', labelColor: 'text-blue-700' },
};

const DAY_MAP: Record<string, number> = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6
};

// Helper function to prevent timezone shift (YYYY-MM-DD -> Local Date)
const normalizeDate = (dStr: string) => {
    if (!dStr) return null;
    return dStr.length === 10 ? new Date(`${dStr}T00:00:00`) : new Date(dStr);
};

export const staticEvents: CalendarEvent[] = [
    ...oneTimeEvents,
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
            const ruleStartDate = normalizeDate(rule.startDate) || new Date(0);
            const ruleEndDate = normalizeDate(rule.endDate) || new Date(2100, 0, 1);
            const exclusions = Array.isArray(rule.exclusions)
                ? rule.exclusions.map((ex: any) => ex.date)
                : (rule.exclusions ? rule.exclusions.split(',').map((d: string) => d.trim()) : []);

            const ruleDay = typeof rule.dayOfWeek === 'string'
                ? DAY_MAP[rule.dayOfWeek]
                : rule.dayOfWeek;

            if (d >= ruleStartDate && d <= ruleEndDate && !exclusions.includes(dateStr)) {
                let shouldShow = false;

                if (rule.recurrenceType === 'daily') {
                    // DAILY: Just show up every day
                    shouldShow = true;
                } else if (rule.recurrenceType === 'weekly') {
                    // WEEKLY: Must be the correct day of the week
                    if (d.getDay() === ruleDay) {
                        shouldShow = true;
                    }
                } else if (rule.recurrenceType === 'monthly') {
                    // MONTHLY: Must be the correct day of the week AND the correct week of the month
                    const currentOrdinal = Math.ceil(day / 7);
                    if (d.getDay() === ruleDay && currentOrdinal === parseInt(rule.ordinalWeek || "0")) {
                        shouldShow = true;
                    }
                } else if (rule.recurrenceType === 'last_of_month') {
                    // LAST OF MONTH: Must be the correct day of the week AND adding 7 days must be in the next month
                    if (d.getDay() === ruleDay) {
                        const nextWeek = new Date(year, month, day + 7);
                        if (nextWeek.getMonth() !== month) {
                            shouldShow = true;
                        }
                    }
                }

                if (shouldShow) {
                    events.push({
                        id: `${rule.id}-${dateStr}`,
                        title: rule.title,
                        date: new Date(year, month, day, 18, 0),
                        time: rule.time,
                        location: rule.location,
                        categories: rule.categories.map((c: any) => c.category || c),
                        organizationTags: rule.organizationTags ?? [],
                        description: rule.description,
                    });
                }
            }
        });
    } // <--- FIXED: This closes the for loop
    return events; // <--- FIXED: Now the function returns the events array
}

staticEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
