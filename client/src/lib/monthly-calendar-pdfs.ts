export type MonthlyCalendarPdf = {
  label: string;
  pdfUrl: string;
  startDate?: string;
  endDate?: string;
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

export function getActiveMonthlyCalendarPdfs(
  pdfs: readonly MonthlyCalendarPdf[] | undefined,
  today = new Date()
): MonthlyCalendarPdf[] {
  const todayKey = localDateKey(today);

  return (pdfs ?? [])
    .filter(({ label, pdfUrl, startDate, endDate }) => {
      if (!label?.trim() || !pdfUrl?.trim()) return false;
      if (!startDate || !endDate) return false;
      if (!isValidDate(startDate) || !isValidDate(endDate)) return false;
      if (startDate > endDate) return false;

      return todayKey >= startDate && todayKey <= endDate;
    })
    .slice(0, 2);
}
