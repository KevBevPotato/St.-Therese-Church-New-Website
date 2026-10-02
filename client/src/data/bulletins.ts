import bulletinDataRaw from './bulletins_data.json';

// 1. Define exactly what a Bulletin looks like in the JSON
export interface BulletinCMS {
    title: string;
    startDate: string;
    endDate: string;
    pdfUrl: string;
    [key: string]: any;
}

// 2. Tell TypeScript to treat the JSON as an object containing a list of BulletinCMS
const bulletinData = (bulletinDataRaw as { bulletins: BulletinCMS[] }).bulletins;

function parseCMSDate(dateStr: string): Date {
    return new Date(`${dateStr}T00:00:00`);
}

export const WEEK_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function formatDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function formatBulletinRange(startDate: Date, endDate: Date): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const sMonth = monthNames[startDate.getMonth()];
    const eMonth = monthNames[endDate.getMonth()];
    const sDay = startDate.getDate();
    const eDay = endDate.getDate();
    const year = startDate.getFullYear();
    return sMonth === eMonth ? `${sMonth} ${sDay}-${eDay}, ${year}` : `${sMonth} ${sDay} - ${eMonth} ${eDay}, ${year}`;
}

export function formatShortDateRange(startDate: Date, endDate: Date): string {
    const start = `${startDate.getMonth() + 1}.${startDate.getDate()}`;
    const end = `${endDate.getMonth() + 1}.${endDate.getDate()}`;
    const year = String(startDate.getFullYear()).slice(-2);
    return `${start}-${end}.${year}`;
}

export function getMonthKey(date: Date): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function getPdfUrlForWeek(startDate: Date): string | undefined {
    const bulletin = bulletinData.find(b => parseCMSDate(b.startDate).getTime() === startDate.getTime());
    return bulletin?.pdfUrl;
}

export function getWeekStart(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    while (result.getDay() !== 6) {
        result.setDate(result.getDate() - 1);
    }
    return result;
}

export function getCurrentWeekRange(): { start: Date; end: Date } {
    const now = new Date();
    const currentStart = getWeekStart(now);
    const currentEnd = new Date(currentStart.getTime() + WEEK_DURATION_MS);
    return { start: currentStart, end: currentEnd };
}

export function getNextWeekRange(): { start: Date; end: Date } {
    const { start: currentStart } = getCurrentWeekRange();
    const nextBulletin = bulletinData
        .filter(b => parseCMSDate(b.startDate).getTime() > currentStart.getTime())
        .sort((a, b) => parseCMSDate(a.startDate).getTime() - parseCMSDate(b.startDate).getTime())[0];

    if (nextBulletin) {
        return {
            start: parseCMSDate(nextBulletin.startDate),
            end: parseCMSDate(nextBulletin.endDate)
        };
    }

    const nextStart = new Date(currentStart.getTime() + WEEK_DURATION_MS);
    const nextEnd = new Date(nextStart.getTime() + WEEK_DURATION_MS);
    return { start: nextStart, end: nextEnd };
}

export function getArchivedBulletins(): Array<{ start: Date; end: Date; pdfUrl?: string }> {
    const now = new Date();
    return bulletinData
        .filter(b => parseCMSDate(b.endDate).getTime() <= now.getTime())
        .map(b => ({
            start: parseCMSDate(b.startDate),
            end: parseCMSDate(b.endDate),
            pdfUrl: b.pdfUrl,
        }))
        .sort((a, b) => b.start.getTime() - a.start.getTime());
}

export function getAllScheduledWeeks(): Array<{ start: Date; end: Date; pdfUrl?: string }> {
    return bulletinData
        .map(b => ({
            start: parseCMSDate(b.startDate),
            end: parseCMSDate(b.endDate),
            pdfUrl: b.pdfUrl,
        }))
        .sort((a, b) => b.start.getTime() - a.start.getTime());
}

// --- CMS to UI Mapper ---
const CATEGORY_MAP = [
    { key: 'mass_times', label: 'Mass Times' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'new_parishioners', label: 'New Parishioners' },
    { key: 'mass_intentions', label: 'Mass Intentions' },
    { key: 'daily_scriptures', label: 'Daily Scriptures' },
    { key: 'lectors', label: 'Lectors' },
    { key: 'ushers', label: 'Ushers' },
    { key: 'altar_servers', label: 'Altar Servers' },
    { key: 'contributions', label: 'Contributions' },
    { key: 'prayer_list', label: 'Prayer List' },
    { key: 'a_little_laugh', label: 'A Little Laugh' },
    { key: 'needs', label: 'Needs' },
    { key: 'sponsors', label: 'Sponsors' },
];

export function buildBulletinForRange(start: Date, end: Date) {
    const data = bulletinData.find(b =>
        new Date(b.startDate + 'T00:00:00').getTime() === start.getTime()
    );

    const sections = CATEGORY_MAP
        .filter(cat => data?.[cat.key])
        .map(cat => ({
            id: cat.key,
            label: cat.label,
            content: String(data?.[cat.key] || ""),
        }));

    if (!data) {
        return {
            id: formatBulletinRange(start, end),
            week: formatBulletinRange(start, end),
            startDate: start,
            endDate: end,
            pdfUrl: undefined,
            sections: [],
            hasContent: false,
        };
    }

    return {
        id: formatBulletinRange(start, end),
        week: formatBulletinRange(start, end),
        startDate: start,
        endDate: end,
        pdfUrl: data.pdfUrl || getPdfUrlForWeek(start),
        sections: sections,
        hasContent: sections.length > 0,
    };
}
