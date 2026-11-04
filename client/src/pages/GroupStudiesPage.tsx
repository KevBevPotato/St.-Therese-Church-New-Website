import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarClock, Compass } from 'lucide-react';
import { Link } from 'wouter';
import getInvolvedData from '@/data/get-involved';
import { useInterestSignup } from '@/contexts/InterestSignupContext';
import CmsMarkdown from '@/components/CmsMarkdown';

type ContentBlock = {
  heading?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  linkLabel?: string;
  linkUrl?: string;
};

export default function GroupStudiesPage() {
  const { openSignup } = useInterestSignup();
  const configuredPages = getInvolvedData.opportunities as Array<{
    id: string;
    landingPageTitle?: string;
    landingPageDescription?: string;
    contentBlocks?: ContentBlock[];
    contactEmail?: string;
    signUpLinks?: Array<{ label: string; url: string }>;
  }>;
  const page = configuredPages.find((item) => item.id === 'group-studies');
  const title = page?.landingPageTitle ?? 'Group Studies';
  const contentBlocks = page?.contentBlocks ?? [];

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

            <CmsMarkdown className="text-lg leading-relaxed text-muted-foreground">
              {page?.landingPageDescription}
            </CmsMarkdown>

            <div className="grid gap-4 md:grid-cols-2">
              {contentBlocks.slice(0, 2).map((block, index) => (
                <Card key={`${block.heading ?? 'block'}-${index}`} className="p-6 border-2 border-primary/10 bg-white">
                  {block.image && <img src={block.image} alt={block.imageAlt ?? ''} className="mb-4 aspect-video w-full rounded-xl object-cover" />}
                  <CmsMarkdown className="font-serif text-2xl font-bold text-primary mb-2">{block.heading}</CmsMarkdown>
                  <CmsMarkdown className="text-muted-foreground">{block.body}</CmsMarkdown>
                  {block.linkUrl && block.linkLabel && <a href={block.linkUrl} className="mt-4 inline-block font-bold text-primary underline">{block.linkLabel}</a>}
                </Card>
              ))}
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

        {contentBlocks.slice(2).map((block, index) => (
          <Card key={`${block.heading ?? 'block'}-${index}`} className="mt-10 border-2 border-primary/10 bg-white p-8 md:p-10">
            {block.image && <img src={block.image} alt={block.imageAlt ?? ''} className="mb-6 aspect-video w-full rounded-xl object-cover" />}
            <div className="flex items-center gap-3 mb-4 text-primary"><Compass size={20} /><CmsMarkdown className="font-serif text-2xl font-bold">{block.heading}</CmsMarkdown></div>
            <CmsMarkdown className="text-muted-foreground leading-relaxed">{block.body}</CmsMarkdown>
            {block.linkUrl && block.linkLabel && <a href={block.linkUrl} className="mt-4 inline-block font-bold text-primary underline">{block.linkLabel}</a>}
          </Card>
        ))}
      </main>

      <Footer />
    </div>
  );
}
