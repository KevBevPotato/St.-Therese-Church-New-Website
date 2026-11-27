export type KnightsNewsletter = {
  title: string;
  pdfUrl: string;
  expiresOn: string;
};

function localDateKey(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

function isValidNewsletter(
  newsletter: KnightsNewsletter
): newsletter is KnightsNewsletter {
  return Boolean(
    newsletter.title?.trim() &&
    newsletter.pdfUrl?.trim() &&
    newsletter.expiresOn &&
    isValidDate(newsletter.expiresOn)
  );
}

export function getCurrentKnightsNewsletters(
  newsletters: readonly KnightsNewsletter[] | undefined,
  today = new Date()
): KnightsNewsletter[] {
  const todayKey = localDateKey(today);

  return (newsletters ?? [])
    .filter(isValidNewsletter)
    .filter(({ expiresOn }) => expiresOn >= todayKey)
    .slice(0, 2);
}

export function getArchivedKnightsNewsletters(
  newsletters: readonly KnightsNewsletter[] | undefined,
  today = new Date()
): KnightsNewsletter[] {
  const todayKey = localDateKey(today);

  return (newsletters ?? [])
    .filter(isValidNewsletter)
    .filter(({ expiresOn }) => expiresOn < todayKey)
    .sort((first, second) => second.expiresOn.localeCompare(first.expiresOn));
}
