export type MonthlyCalendarPdf = {
  label: string;
  pdfUrl: string;
  startDate?: string;
  endDate?: string;
};

type ScheduledMonthlyCalendarPdf = MonthlyCalendarPdf & {
  startDate: string;
  endDate: string;
};

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function localDateKey(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidMonthlyCalendarPdf(
  pdf: MonthlyCalendarPdf
): pdf is ScheduledMonthlyCalendarPdf {
  const { label, pdfUrl, startDate, endDate } = pdf;
  return Boolean(
    label?.trim() &&
      pdfUrl?.trim() &&
      startDate &&
      endDate &&
      isValidDate(startDate) &&
      isValidDate(endDate) &&
      startDate <= endDate
  );
}

export function getUpcomingMonthlyCalendarPdfs(
  pdfs: readonly MonthlyCalendarPdf[] | undefined,
  today = new Date()
): ScheduledMonthlyCalendarPdf[] {
  const todayKey = localDateKey(today);

  return (pdfs ?? [])
    .filter(isValidMonthlyCalendarPdf)
    .filter(({ endDate }) => endDate >= todayKey)
    .slice(0, 2);
}

export function getAllMonthlyCalendarPdfs(
  pdfs: readonly MonthlyCalendarPdf[] | undefined
): ScheduledMonthlyCalendarPdf[] {
  return (pdfs ?? [])
    .filter(isValidMonthlyCalendarPdf)
    .sort((first, second) => second.startDate.localeCompare(first.startDate));
}
