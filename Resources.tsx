// Sacred Minimalism: an editorial resource library with warm paper tones, navy structure, and gold wayfinding.
import { ArrowUpRight, BookOpen, Church, Headphones, Heart, Landmark, LibraryBig } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';

const resourceGroups = [
  {
    id: 'scripture-study',
    eyebrow: 'Read & Understand',
    title: 'Scripture & Bible Study',
    description: 'Begin with the daily readings, explore the full Bible, or follow a guided Catholic study at your own pace.',
    icon: BookOpen,
    resources: [
      {
        title: 'USCCB Daily Readings',
        description: 'The official daily Mass readings, calendar, audio, and video from the United States Conference of Catholic Bishops.',
        href: 'https://bible.usccb.org/',
        note: 'Official · Free',
      },
      {
        title: 'Books of the Bible',
        description: 'Read Scripture online and explore introductions to the books of the Old and New Testaments.',
        href: 'https://bible.usccb.org/bible',
        note: 'USCCB · Free',
      },
      {
        title: 'Agape Bible Study',
        description: 'In-depth Catholic studies with historical context, charts, maps, and Catechism references.',
        href: 'https://www.agapebiblestudy.com/',
        note: 'Self-paced · Free',
      },
      {
        title: 'Institute of Catholic Culture',
        description: 'Free Catholic adult-formation classes and lectures in Scripture, theology, history, and philosophy.',
        href: 'https://instituteofcatholicculture.org/',
        note: 'Courses · Free',
      },
    ],
  },
  {
    id: 'prayer-worship',
    eyebrow: 'Pray Each Day',
    title: 'Prayer & Worship',
    description: 'Simple, trustworthy companions for daily prayer, the Rosary, and a deeper participation in the Church’s worship.',
    icon: Heart,
    resources: [
      {
        title: 'Basic Catholic Prayers',
        description: 'A trusted collection of essential prayers, creeds, acts of faith, and devotional prayers.',
        href: 'https://www.usccb.org/prayer-and-worship/prayers-and-devotions/prayers/basic-prayers',
        note: 'USCCB · Free',
      },
      {
        title: 'The Rosary in a Year',
        description: 'A guided audio journey with Fr. Mark-Mary Ames, CFR, designed to deepen the way you pray the Rosary.',
        href: 'https://app.ascensionpress.com/podcasts/f050d01d-da47-4d3d-bb68-b22339db672a',
        note: 'Podcast · Free',
      },
      {
        title: 'Word on Fire Rosary',
        description: 'Pray the mysteries of the Rosary with sacred art and guided video reflections.',
        href: 'https://www.wordonfire.org/videos/rosary/',
        note: 'Video · Free',
      },
    ],
  },
  {
    id: 'podcasts-audio',
    eyebrow: 'Listen & Reflect',
    title: 'Podcasts & Audio',
    description: 'Faithful Catholic voices for the commute, a quiet morning, or a small-group conversation.',
    icon: Headphones,
    resources: [
      {
        title: 'The Bible in a Year',
        description: 'Fr. Mike Schmitz reads through the Bible with prayer, commentary, and a clear daily plan.',
        href: 'https://app.ascensionpress.com/podcasts/bible',
        note: '365 episodes · Free',
      },
      {
        title: 'The Catechism in a Year',
        description: 'A daily guided journey through the Catechism of the Catholic Church with Fr. Mike Schmitz.',
        href: 'https://app.ascensionpress.com/podcasts/catechism',
        note: '365 episodes · Free',
      },
      {
        title: 'Word on Fire',
        description: 'Sunday sermons, Gospel reflections, interviews, and conversations about faith and culture.',
        href: 'https://www.wordonfire.org/videos/wordonfire-show/',
        note: 'Podcast & video',
      },
      {
        title: 'Catholic Answers Audio',
        description: 'Catholic Answers Live, apologetics podcasts, Scripture discussions, and answers to common questions.',
        href: 'https://www.catholic.com/audio',
        note: 'Apologetics · Free',
      },
    ],
  },
  {
    id: 'teaching-local',
    eyebrow: 'Stay Connected',
    title: 'Catholic Teaching & Local Church',
    description: 'Go to the source for Church teaching and remain connected to Catholic life across western South Dakota.',
    icon: Landmark,
    resources: [
      {
        title: 'Catechism of the Catholic Church',
        description: 'The complete official Catechism available online through the Holy See.',
        href: 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM',
        note: 'Official text',
      },
      {
        title: 'Catholic Answers',
        description: 'Searchable articles, Q&A, tracts, videos, and a Catholic encyclopedia for questions about the faith.',
        href: 'https://www.catholic.com/',
        note: 'Faith questions',
      },
      {
        title: 'Diocese of Rapid City',
        description: 'Diocesan news, ministries, events, offices, vocations, and official local Church information.',
        href: 'https://www.rapidcitydiocese.org/',
        note: 'Our diocese',
      },
      {
        title: 'West River Catholic',
        description: 'News, stories, and reflections from the Catholic community of western South Dakota.',
        href: 'https://www.rapidcitydiocese.org/wrc/',
        note: 'Local Catholic news',
      },
    ],
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-[#fbfaf6] text-foreground">
      <Header />
      <div className="pt-[69px]">
        <PageBreadcrumbs items={[{ label: 'Resources' }]} />
      </div>

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-white">
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
          <div className="container grid gap-10 py-16 md:grid-cols-[1.25fr_0.75fr] md:items-end md:py-20">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b8954f]/30 bg-[#b8954f]/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6829]">
                <LibraryBig className="size-4" aria-hidden="true" />
                Grow in faith
              </div>
              <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                Trusted resources for the journey.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                A thoughtfully selected library for Scripture, prayer, Catholic teaching, podcasts, and life in our local Church.
              </p>
            </div>
            <aside className="border-l-2 border-[#b8954f] pl-6 text-base leading-relaxed text-muted-foreground md:mb-2">
              <p className="font-serif text-2xl italic leading-snug text-primary">
                “The world is thy ship and not thy home.”
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6829]">Saint Thérèse of Lisieux</p>
            </aside>
          </div>
        </section>

        <nav className="sticky top-[69px] z-30 border-b border-primary/10 bg-[#fbfaf6]/95 backdrop-blur" aria-label="Resource categories">
          <div className="container flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
            {resourceGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="whitespace-nowrap rounded-full border border-primary/15 bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm transition-colors hover:border-primary/35 hover:bg-primary hover:text-primary-foreground"
              >
                {group.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="container py-14 md:py-20">
          <div className="space-y-20">
            {resourceGroups.map((group, groupIndex) => {
              const GroupIcon = group.icon;
              return (
                <section key={group.id} id={group.id} className="scroll-mt-36">
                  <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
                    <div className="lg:sticky lg:top-36 lg:self-start">
                      <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                        <GroupIcon className="size-5" aria-hidden="true" />
                      </span>
                      <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#9b762f]">{group.eyebrow}</p>
                      <h2 className="mt-2 font-serif text-3xl font-bold text-primary md:text-4xl">{group.title}</h2>
                      <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{group.description}</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {group.resources.map((resource, resourceIndex) => (
                        <a
                          key={resource.title}
                          href={resource.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex min-h-56 flex-col overflow-hidden border border-primary/12 bg-white p-6 shadow-[0_12px_35px_rgba(26,55,89,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_45px_rgba(26,55,89,0.12)]"
                        >
                          <span className="absolute right-0 top-0 h-16 w-16 bg-gradient-to-bl from-[#b8954f]/12 to-transparent" aria-hidden="true" />
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9b762f]">{resource.note}</span>
                            <ArrowUpRight className="size-5 text-primary/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
                          </div>
                          <h3 className="mt-8 font-serif text-2xl font-bold leading-tight text-primary">{resource.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                          <span className="mt-auto pt-5 text-sm font-semibold text-primary">Visit resource</span>
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  {groupIndex < resourceGroups.length - 1 && <div className="mt-20 h-px bg-primary/10" />}
                </section>
              );
            })}
          </div>
        </div>

        <section className="border-y border-primary/10 bg-primary text-primary-foreground">
          <div className="container grid gap-6 py-12 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/10">
              <Church className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-serif text-3xl font-bold">Not sure where to begin?</h2>
              <p className="mt-2 max-w-2xl text-primary-foreground/75">
                Start with the daily readings, then choose one study or podcast that fits naturally into your week.
              </p>
            </div>
            <a
              href="https://bible.usccb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-primary transition-colors hover:bg-[#f2ead8]"
            >
              Read today’s readings <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
