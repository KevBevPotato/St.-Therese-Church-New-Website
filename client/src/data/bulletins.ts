/**
 * Bulletin data manifest.
 */
export const bulletinPdfManifest: Record<string, string> = {
    '2026-08-08': '/ParishBulletins/August8.8-15.26.pdf',
    '2026-08-15': '/ParishBulletins/August15.8-22.26.pdf',
    '2026-08-22': '/ParishBulletins/August22.8-29.26.pdf',
    '2026-08-29': '/ParishBulletins/August8.29-September9.5.pdf',
    '2026-09-05': '/ParishBulletins/September+5+&+6,+2026.pdf',
    '2026-09-12': '/ParishBulletins/September+12+&+13,+2026.pdf',
    '2026-09-19': '/ParishBulletins/September+19+&+20,+2026.pdf',
    '2026-09-26': '/ParishBulletins/September 26 & 27, 2026.pdf',
};

export const bulletinWeekSchedule: Record<string, { startDate: Date; endDate: Date }> = {
    '2026-08-08': { startDate: new Date(2026, 7, 8), endDate: new Date(2026, 7, 15) },
    '2026-08-15': { startDate: new Date(2026, 7, 15), endDate: new Date(2026, 7, 22) },
    '2026-08-22': { startDate: new Date(2026, 7, 22), endDate: new Date(2026, 7, 29) },
    '2026-09-19': { startDate: new Date(2026, 8, 19), endDate: new Date(2026, 8, 26) },
    '2026-09-26': { startDate: new Date(2026, 8, 26), endDate: new Date(2026, 9, 3) },
    '2026-10-03': { startDate: new Date(2026, 9, 3), endDate: new Date(2026, 9, 10) },
};

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
    return bulletinPdfManifest[formatDateKey(startDate)];
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
    const scheduleKeys = Object.keys(bulletinWeekSchedule).sort();
    for (const key of scheduleKeys) {
        const entry = bulletinWeekSchedule[key];
        if (entry.startDate.getTime() > currentStart.getTime()) {
            return { start: entry.startDate, end: entry.endDate };
        }
    }
    const nextStart = new Date(currentStart.getTime() + WEEK_DURATION_MS);
    const nextEnd = new Date(nextStart.getTime() + WEEK_DURATION_MS);
    return { start: nextStart, end: nextEnd };
}

export function getArchivedBulletins(): Array<{ start: Date; end: Date; pdfUrl?: string }> {
    const now = new Date();
    const archiveEntries: Array<{ start: Date; end: Date; pdfUrl?: string }> = [];

    Object.values(bulletinWeekSchedule).forEach((entry) => {
        if (entry.endDate.getTime() <= now.getTime()) {
            archiveEntries.push({
                start: entry.startDate,
                end: entry.endDate,
                pdfUrl: getPdfUrlForWeek(entry.startDate),
            });
        }
    });

    Object.entries(bulletinPdfManifest).forEach(([dateKey, pdfUrl]) => {
        const start = new Date(dateKey + 'T00:00:00');
        const end = new Date(start.getTime() + WEEK_DURATION_MS);
        if (end.getTime() <= now.getTime()) {
            const exists = archiveEntries.some(e => e.start.getTime() === start.getTime());
            if (!exists) {
                archiveEntries.push({ start, end, pdfUrl });
            }
        }
    });

    return archiveEntries.sort((a, b) => b.start.getTime() - a.start.getTime());
}

export function getAllScheduledWeeks(): Array<{ start: Date; end: Date; pdfUrl?: string }> {
    const entries: Array<{ start: Date; end: Date; pdfUrl?: string }> = [];

    Object.values(bulletinWeekSchedule).forEach((entry) => {
        entries.push({
            start: entry.startDate,
            end: entry.endDate,
            pdfUrl: getPdfUrlForWeek(entry.startDate),
        });
    });

    Object.entries(bulletinPdfManifest).forEach(([dateKey, pdfUrl]) => {
        const start = new Date(dateKey + 'T00:00:00');
        const end = new Date(start.getTime() + WEEK_DURATION_MS);
        const exists = entries.some(e => e.start.getTime() === start.getTime());
        if (!exists) {
            entries.push({ start, end, pdfUrl });
        }
    });

    return entries.sort((a, b) => b.start.getTime() - a.start.getTime());
}
