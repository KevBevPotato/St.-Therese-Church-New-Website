import { CalendarEvent, EventCategory, EventOrganizationTag, TimeFilter } from './types';
import { oneTimeEvents } from './oneTimeEvents';
import { visibleContent } from '../../data/visible-content';

const recurringRules = Object.entries(
    import.meta.glob<Record<string, any>>('./recurring-events/*.json', {
        eager: true,
        import: 'default',
    })
).filter(([, rule]) => !rule.isHidden).map(([path, rule]) => ({
    ...visibleContent(rule),
    id: rule.id || path.split('/').at(-1)?.replace(/\.json$/, '') || 'recurring-event',
}));

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

function eventDateTime(dateString: string, timeString: string): Date {
    const date = normalizeDate(dateString) ?? new Date(dateString);
    const times = Array.from(
        timeString.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi)
    );
    const time = times[0];
    if (!time || Number.isNaN(date.getTime())) return date;

    const meridiem = (time[3] || times.find(match => match[3])?.[3])?.toLowerCase();
    let hours = Number(time[1]);
    const minutes = Number(time[2] ?? 0);
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
    if (hours > 23 || minutes > 59) return date;

    date.setHours(hours, minutes, 0, 0);
    return date;
}

export function recurringEventForDate(
    rule: any,
    dateString: string,
    override: any = {},
    scheduleKey = ''
): CalendarEvent | null {
    if (override.action === 'skip') return null;

    const appliedOverride = Object.fromEntries(
        Object.entries(override).filter(([key, value]) => {
            if (key === 'action') return false;
            if (key === 'date') return typeof value === 'string';
            return value !== undefined &&
                value !== null &&
                value !== '' &&
                (!Array.isArray(value) || value.length > 0);
        })
    );
    if (override.action === 'cancelled' && !appliedOverride.title) {
        appliedOverride.title = 'Canceled';
    }
    const merged = { ...rule, ...appliedOverride };
    const { schedule, oneTimeOccurrences, additionalSchedules, ...eventFields } = merged;
    return {
        ...eventFields,
        id: `${rule.id}${scheduleKey ? `-${scheduleKey}` : ''}-${dateString}`,
        title: merged.title,
        date: eventDateTime(dateString, merged.time ?? ''),
        time: merged.time ?? '',
        location: merged.location ?? '',
        categories: (merged.categories ?? []).map((category: any) =>
            category.category || category
        ),
        organizationTags: merged.organizationTags ?? [],
    } as CalendarEvent;
}

export function recurringEventsForDate(
    rule: any,
    dateString: string
): CalendarEvent[] {
    const date = normalizeDate(dateString);
    if (!date || Number.isNaN(date.getTime())) return [];

    const scheduleSets = [
        {
            schedule: rule.schedule ?? rule,
            time: rule.time,
            key: '',
            isPrimary: true,
        },
        ...(Array.isArray(rule.additionalSchedules)
            ? rule.additionalSchedules.map((additional: any, index: number) => ({
                schedule: additional.schedule ?? additional,
                time: additional.time ?? rule.time,
                key: `schedule-${index + 1}`,
                isPrimary: false,
            }))
            : []),
    ];

    const events: CalendarEvent[] = [];
    for (const { schedule, time, key, isPrimary } of scheduleSets) {
        const oneTimeOverride =
            schedule.occurrenceOverrides?.find(
                (occurrence: any) => occurrence.date === dateString
            ) ??
            (isPrimary
                ? rule.oneTimeOccurrences?.find(
                    (occurrence: any) => occurrence.date === dateString
                )
                : undefined);
        const eventRule = time === rule.time ? rule : { ...rule, time };
        if (oneTimeOverride) {
            const event = recurringEventForDate(
                eventRule,
                dateString,
                oneTimeOverride,
                key
            );
            if (event) events.push(event);
            continue;
        }

        const ruleStartDate = normalizeDate(schedule.startDate) || new Date(0);
        const ruleEndDate = normalizeDate(schedule.endDate) || new Date(2100, 0, 1);
        const exclusions = Array.isArray(schedule.exclusions)
            ? schedule.exclusions.map((ex: any) => typeof ex === 'string' ? ex : ex.date)
            : (schedule.exclusions ? schedule.exclusions.split(',').map((d: string) => d.trim()) : []);

        const scheduledDays = Array.isArray(schedule.daysOfWeek)
            ? schedule.daysOfWeek
            : [schedule.dayOfWeek];
        const ruleDays = scheduledDays
            .map((day: string | number) => typeof day === 'string' ? DAY_MAP[day] : day)
            .filter((day: number | undefined): day is number => day !== undefined);
        const ruleDay = typeof schedule.dayOfWeek === 'string'
            ? DAY_MAP[schedule.dayOfWeek]
            : schedule.dayOfWeek;

        if (date < ruleStartDate || date > ruleEndDate || exclusions.includes(dateString)) {
            continue;
        }

        let shouldShow = false;
        if (schedule.recurrenceType === 'daily') {
            shouldShow = true;
        } else if (schedule.recurrenceType === 'weekly') {
            shouldShow = ruleDays.includes(date.getDay());
        } else if (schedule.recurrenceType === 'monthly') {
            const currentOrdinal = Math.ceil(date.getDate() / 7);
            shouldShow = date.getDay() === ruleDay &&
                currentOrdinal === parseInt(schedule.ordinalWeek || "1");
        } else if (schedule.recurrenceType === 'last_of_month') {
            const nextWeek = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 7
            );
            shouldShow = date.getDay() === ruleDay &&
                nextWeek.getMonth() !== date.getMonth();
        }

        if (shouldShow) {
            const event = recurringEventForDate(eventRule, dateString, {}, key);
            if (event) events.push(event);
        }
    }

    return events;
}

export const staticEvents: CalendarEvent[] = [
    ...oneTimeEvents,
];

export function generateRecurringEventsForMonth(month: number, year: number): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        recurringRules.forEach((rule: any) => {
            events.push(...recurringEventsForDate(rule, dateStr));
        });
    }
    return events;
}

export function getLatestRecurringScheduleEndDate(
    organizationTag: EventOrganizationTag
): Date | null {
    const matchingRules = recurringRules.filter((rule: any) =>
        rule.organizationTags?.includes(organizationTag)
    );
    const endDates = matchingRules
        .flatMap((rule: any) => [
            normalizeDate((rule.schedule ?? rule).endDate),
            ...(Array.isArray(rule.additionalSchedules)
                ? rule.additionalSchedules.map((additional: any) =>
                    normalizeDate((additional.schedule ?? additional).endDate)
                )
                : []),
        ])
        .filter((date: Date | null): date is Date => date !== null);
    if (endDates.length === 0) return null;
    return endDates.reduce((latest, date) => date > latest ? date : latest);
}

staticEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
