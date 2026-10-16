import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { announcementSettings } from '@/data/announcements';
import ReactMarkdown from 'react-markdown';
import { buildBulletinForRange, getCurrentWeekRange } from '@/data/bulletins';

export default function Announcements() {
  const currentWeek = getCurrentWeekRange();
  const currentBulletin = buildBulletinForRange(currentWeek.start, currentWeek.end);
  const bulletinAnnouncements = currentBulletin.sections.find(
    (section) => section.id === 'announcements',
  )?.content;
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

      </main>

      <Footer />
    </div>
  );
}
