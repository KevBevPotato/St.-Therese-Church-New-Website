import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { announcementSettings, getActiveAnnouncements } from '@/data/announcements';
import ReactMarkdown from 'react-markdown';
import { buildBulletinForRange, getCurrentWeekRange } from '@/data/bulletins';

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Announcements() {
  const announcements = getActiveAnnouncements();
  const currentWeek = getCurrentWeekRange();
  const currentBulletin = buildBulletinForRange(currentWeek.start, currentWeek.end);
  const bulletinAnnouncements = currentBulletin.sections.find(
    (section) => section.id === 'announcements',
  )?.content;
  const columns = announcementSettings.cardColumns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3';
  const aspectRatio = announcementSettings.cardImageAspect.replace('/', ' / ');

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="container mx-auto flex-grow px-4 py-16">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
            Stay Informed
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-primary md:text-6xl">
            {announcementSettings.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {announcementSettings.description}
          </p>
        </header>

        <section className="mb-12 max-w-4xl">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
              This Week’s Bulletin
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-primary">
              Bulletin Announcements
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{currentBulletin.week}</p>
          </div>
          {bulletinAnnouncements ? (
            <Card className="p-6 leading-relaxed text-muted-foreground shadow-sm md:p-8">
              <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-primary prose-strong:text-primary">
                <ReactMarkdown>{bulletinAnnouncements}</ReactMarkdown>
              </div>
            </Card>
          ) : (
            <div className="rounded-xl border border-dashed border-primary/20 bg-white p-8 text-center">
              <p className="font-serif text-xl font-bold text-primary">
                No bulletin announcements available
              </p>
              <p className="mt-2 text-muted-foreground">
                Please check back when this week’s bulletin has been updated.
              </p>
            </div>
          )}
        </section>

        {announcements.length ? (
          <div className={`grid grid-cols-1 gap-6 ${columns}`}>
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className="overflow-hidden rounded-xl border border-primary/12 bg-white shadow-sm"
              >
                <div
                  className="w-full overflow-hidden bg-primary/5"
                  style={{ aspectRatio }}
                >
                  <img
                    src={announcement.image}
                    alt={announcement.imageAlt || ''}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: announcement.imagePosition || 'center' }}
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  {announcement.category && (
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b762f]">
                      {announcement.category}
                    </p>
                  )}
                  <h2 className="font-serif text-2xl font-bold text-primary">
                    {announcement.title}
                  </h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                    {announcement.description}
                  </p>
                  <p className="mt-5 border-t border-primary/10 pt-4 text-xs text-muted-foreground">
                    {formatDate(announcement.launchDate)} – {formatDate(announcement.expirationDate)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-primary/20 bg-white p-10 text-center">
            <AlertTriangle className="mx-auto size-8 text-[#9b762f]" aria-hidden="true" />
            <p className="mt-4 font-serif text-xl font-bold text-primary">
              No current announcements
            </p>
            <p className="mt-2 text-muted-foreground">
              Please check back for timely parish updates.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
