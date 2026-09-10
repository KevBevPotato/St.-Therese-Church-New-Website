/**
 * Bulletin data manifest.
 *
 * Each week we publish a bulletin, add ONE entry below mapping the
 * Saturday start date (YYYY-MM-DD) to the PDF filename in /public.
 *
 * Last updated: August 2026
 */

export const bulletinPdfManifest: Record<string, string> = {
    '2026-08-01': '/ParishBulletins/August1.1-8.8.26.pdf',
    '2026-08-08': '/ParishBulletins/August8.8-15.26.pdf',
    '2026-08-15': '/ParishBulletins/August15.8-22.26.pdf',
    '2026-08-22': '/ParishBulletins/August22.8-29.26.pdf',
    '2026-08-29': '/ParishBulletins/August8.29-September9.5.pdf',
    '2026-09-05': '/ParishBulletins/September+5+&+6,+2026.pdf',
};

/**
 * All weeks to display in the bulletin system, keyed by Saturday start date.
 * A week appears in the archive (under "All Previous Bulletins") once it has
 * rolled over (Saturday 00:00 of its end date).
 *
 * If a week is listed here but its PDF is NOT yet in bulletinPdfManifest,
 * it will appear as a "Coming soon" entry with no link.
 *
 * Add a new entry each Saturday so the system knows what week is next.
 */
export const bulletinWeekSchedule: Record<string, { startDate: Date; endDate: Date }> = {
    '2026-08-01': {
        startDate: new Date(2026, 7, 1),
        endDate: new Date(2026, 7, 8),
    },
    '2026-08-08': {
        startDate: new Date(2026, 7, 8),
        endDate: new Date(2026, 7, 15),
    },
    '2026-08-15': {
        startDate: new Date(2026, 7, 15),
        endDate: new Date(2026, 7, 22),
    },
    '2026-08-22': {
        startDate: new Date(2026, 7, 22),
        endDate: new Date(2026, 7, 29),
    },
};

export const BASE_SATURDAY = new Date(2026, 7, 1, 0, 0, 0, 0);
export const WEEK_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function formatDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function formatBulletinRange(startDate: Date, endDate: Date): string {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const sMonth = monthNames[startDate.getMonth()];
    const eMonth = monthNames[endDate.getMonth()];
    const sDay = startDate.getDate();
    const eDay = endDate.getDate();
    const year = startDate.getFullYear();

    if (sMonth === eMonth) {
        return `${sMonth} ${sDay}-${eDay}, ${year}`;
    }
    return `${sMonth} ${sDay} - ${eMonth} ${eDay}, ${year}`;
}

/**
 * Short format with periods: "8.8-8.15.26"
 */
export function formatShortDateRange(startDate: Date, endDate: Date): string {
    const start = `${startDate.getMonth() + 1}.${startDate.getDate()}`;
    const end = `${endDate.getMonth() + 1}.${endDate.getDate()}`;
    const year = String(startDate.getFullYear()).slice(-2);
    return `${start}-${end}.${year}`;
}

export function getMonthKey(date: Date): string {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
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

/**
 * Returns the bulletin that should be "current" right now.
 * Rule: a bulletin with endDate Sat is current from Sat 00:00 (of startDate)
 *       until Sat 00:00 (of endDate).
 */
export function getCurrentWeekRange(): { start: Date; end: Date } {
    const now = new Date();
    const currentStart = getWeekStart(now);
    const currentEnd = new Date(currentStart.getTime() + WEEK_DURATION_MS);
    return { start: currentStart, end: currentEnd };
}

/**
 * Returns the next upcoming bulletin week — the one that hasn't started yet.
 * Uses bulletinWeekSchedule first, falls back to "current + 7 days" if none listed.
 */
export function getNextWeekRange(): { start: Date; end: Date } {
    const { start: currentStart } = getCurrentWeekRange();

    // Find the latest entry in bulletinWeekSchedule whose startDate is strictly in the future
    const scheduleKeys = Object.keys(bulletinWeekSchedule).sort();
    for (const key of scheduleKeys) {
        const entry = bulletinWeekSchedule[key];
        if (entry.startDate.getTime() > currentStart.getTime()) {
            return {
                start: entry.startDate,
                end: entry.endDate,
            };
        }
    }

    // Fallback: just add 7 days to current
    const nextStart = new Date(currentStart.getTime() + WEEK_DURATION_MS);
    const nextEnd = new Date(nextStart.getTime() + WEEK_DURATION_MS);
    return { start: nextStart, end: nextEnd };
}

/**
 * Returns ALL weeks that have rolled past (i.e., end date is < now),
 * whether or not their PDF has been uploaded. Each entry includes
 * optional pdfUrl.
 *
 * Sorted newest-first.
 */
export function getArchivedBulletins(): Array<{
    start: Date;
    end: Date;
    pdfUrl?: string;
}> {
    const now = new Date();
    const archiveEntries: Array<{ start: Date; end: Date; pdfUrl?: string }> = [];

    // Collect from bulletinWeekSchedule (preferred — has explicit entry for each week)
    Object.values(bulletinWeekSchedule).forEach((entry) => {
        if (entry.endDate.getTime() <= now.getTime()) {
            archiveEntries.push({
                start: entry.startDate,
                end: entry.endDate,
                pdfUrl: getPdfUrlForWeek(entry.startDate),
            });
        }
    });

    // Also include any PDFs uploaded for weeks NOT in the schedule (legacy entries)
    Object.entries(bulletinPdfManifest).forEach(([dateKey, pdfUrl]) => {
        const start = new Date(dateKey + 'T00:00:00');
        const end = new Date(start.getTime() + WEEK_DURATION_MS);
        if (end.getTime() <= now.getTime()) {
            // Skip if already covered by schedule
            const exists = archiveEntries.some(e => e.start.getTime() === start.getTime());
            if (!exists) {
                archiveEntries.push({ start, end, pdfUrl });
            }
        }
    });

    // Sort newest-first
    archiveEntries.sort((a, b) => b.start.getTime() - a.start.getTime());

    return archiveEntries;
}

/**
 * Returns all weeks (current, future, archived) for the archive view.
 * Used for displaying the full schedule including future weeks with no PDF yet.
 */
export function getAllScheduledWeeks(): Array<{
    start: Date;
    end: Date;
    pdfUrl?: string;
}> {
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
