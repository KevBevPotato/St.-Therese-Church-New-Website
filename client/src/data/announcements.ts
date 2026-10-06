import announcementsData from './announcements_data.json';

export interface Announcement {
  id: string;
  title: string;
  category?: string;
  description: string;
  launchDate: string;
  expirationDate: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
}

export interface AnnouncementSettings {
  title: string;
  description: string;
  cardColumns: number;
  cardImageAspect: string;
  heroLinkPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  heroLinkBackgroundColor: string;
  heroLinkTextColor: string;
  heroLinkOpacity: number;
}

const data = announcementsData as {
  settings: AnnouncementSettings;
  announcements: Announcement[];
};

function localDateStart(dateString: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) return undefined;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return undefined;
  }
  return date;
}

export function filterActiveAnnouncements(
  announcements: Announcement[],
  now = new Date(),
): Announcement[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return announcements
    .filter((announcement) => {
      const launch = localDateStart(announcement.launchDate);
      const expiration = localDateStart(announcement.expirationDate);
      if (!launch || !expiration || expiration < launch) return false;

      const dayAfterExpiration = new Date(
        expiration.getFullYear(),
        expiration.getMonth(),
        expiration.getDate() + 1,
      );
      return launch <= today && today < dayAfterExpiration;
    })
    .sort(
      (first, second) =>
        (localDateStart(second.launchDate)?.getTime() ?? 0) -
        (localDateStart(first.launchDate)?.getTime() ?? 0),
    );
}

export function getActiveAnnouncements(now = new Date()): Announcement[] {
  return filterActiveAnnouncements(data.announcements, now);
}

export const announcementSettings = data.settings;
