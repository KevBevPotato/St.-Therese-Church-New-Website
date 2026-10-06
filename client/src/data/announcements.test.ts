import { describe, expect, it } from 'vitest';
import { filterActiveAnnouncements, type Announcement } from './announcements';

const announcement = (
  id: string,
  launchDate: string,
  expirationDate: string,
): Announcement => ({
  id,
  title: id,
  description: '',
  launchDate,
  expirationDate,
  image: '/notice.jpg',
  imageAlt: '',
});

describe('filterActiveAnnouncements', () => {
  it('includes launch and expiration dates and sorts newest first', () => {
    const active = filterActiveAnnouncements(
      [
        announcement('older', '2026-10-01', '2026-10-05'),
        announcement('newest', '2026-10-05', '2026-10-05'),
      ],
      new Date(2026, 9, 5, 23, 59),
    );

    expect(active.map(({ id }) => id)).toEqual(['newest', 'older']);
  });

  it('excludes announcements outside their date range and invalid dates', () => {
    const active = filterActiveAnnouncements(
      [
        announcement('future', '2026-10-06', '2026-10-08'),
        announcement('expired', '2026-10-01', '2026-10-04'),
        announcement('invalid', '2026-02-30', '2026-10-10'),
      ],
      new Date(2026, 9, 5, 12),
    );

    expect(active).toEqual([]);
  });
});
