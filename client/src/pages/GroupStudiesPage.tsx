import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Brain, CalendarClock, Compass } from 'lucide-react';
import { Link } from 'wouter';
import getInvolvedData from '@/data/get-involved';
import { useInterestSignup } from '@/contexts/InterestSignupContext';

export default function GroupStudiesPage() {
  const { openSignup } = useInterestSignup();
  const configuredPages = getInvolvedData.opportunities as Array<{
    id: string;
    landingPageTitle?: string;
    landingPageDescription?: string;
    contactEmail?: string;
    signUpLinks?: Array<{ label: string; url: string }>;
  }>;
  const page = configuredPages.find((item) => item.id === 'group-studies');
  const title = page?.landingPageTitle ?? 'Group Studies';

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <Link href="/get-involved">
          <button className="flex items-center gap-2 text-primary/60 hover:text-accent transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
            <ArrowLeft size={16} /> Back to Get Involved
          </button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3">Parish Life</p>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary leading-tight">{title}</h1>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {page?.landingPageDescription ?? 'Group Studies invite parishioners to explore Scripture, Catholic teaching, and spiritual formation in a prayerful, reflective setting. These seasonal studies help us deepen our relationship with Christ and one another.'}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6 border-2 border-primary/10 bg-white">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BookOpen size={20} />
                </div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-2">Scripture & Catechesis</h2>
                <p className="text-muted-foreground">Study the Bible and the Catholic faith with thoughtful teaching and discussion.</p>
              </Card>

              <Card className="p-6 border-2 border-primary/10 bg-white">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Brain size={20} />
                </div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-2">Spiritual Growth</h2>
                <p className="text-muted-foreground">Reflect on prayer, discipleship, and how faith shapes everyday life.</p>
              </Card>
            </div>
          </div>

          <Card className="p-8 border-2 border-primary/10 bg-white shadow-xl rounded-[2rem]">
            <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <CalendarClock size={22} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">Study Format</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Small groups centered on prayer and discussion</li>
              <li>• Seasonal themes tied to the Church calendar</li>
              <li>• Open to adults seeking deeper formation</li>
              <li>• Flexible participation based on group schedule</li>
            </ul>
            <div className="mt-8">
              <Button
                onClick={() =>
                  openSignup({
                    id: "group-studies",
                    title,
                    kind: "join",
                  })
                }
                className="w-full bg-primary hover:bg-primary/90 py-6 uppercase tracking-widest font-bold"
              >
                Join a Study
              </Button>
            </div>
            {page?.signUpLinks?.map((link) => (
              <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className="mt-3 block">
                <Button variant="outline" className="w-full uppercase tracking-widest font-bold">
                  {link.label}
                </Button>
              </a>
            ))}
          </Card>
        </div>

        <Card className="mt-10 border-2 border-primary/10 bg-white p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <Compass size={20} />
            <h2 className="font-serif text-2xl font-bold">Our aim</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            These studies help parishioners encounter the richness of the Catholic faith while growing in communion with one another.
            Whether you are looking for a first step in faith formation or a deeper dive into Scripture and doctrine, there is a place for you.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
