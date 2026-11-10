import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import getInvolvedData from '@/data/get-involved';
import { useInterestSignup } from '@/contexts/InterestSignupContext';
import CmsMarkdown from '@/components/CmsMarkdown';
import { EventMedia } from '@/components/EventMedia';

type ContentBlock = {
  isHidden?: boolean;
  layout?: 'card' | 'full';
  heading?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  linkLabel?: string;
  linkUrl?: string;
};

type GalleryItem = {
  photo: string;
  caption?: string;
  linkUrl?: string;
  showInCarousel?: boolean;
};

export default function ConnectGroupsPage() {
  const { openSignup } = useInterestSignup();
  const configuredPages = getInvolvedData.opportunities as Array<{
    id: string;
    landingPageTitle?: string;
    landingPageDescription?: string;
    description?: string;
    landingPageImage?: string;
    contentBlocks?: ContentBlock[];
    audienceHeading?: string;
    audienceItems?: string[];
    gallery?: GalleryItem[];
    contactEmail?: string;
    signUpLinks?: Array<{ label: string; url: string }>;
  }>;
  const page = configuredPages.find((item) => item.id === 'connect-groups');
  const title = page?.landingPageTitle ?? 'Connect Groups';
  const contentBlocks = (page?.contentBlocks ?? []).filter(block => !block.isHidden);
  const audienceItems = page?.audienceItems ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <Link href="/contribute">
          <button className="flex items-center gap-2 text-primary/60 hover:text-accent transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
            <ArrowLeft size={16} /> Back to Ways to Contribute
          </button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3">Parish Life</p>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary leading-tight">{title}</h1>
            </div>

            <CmsMarkdown className="text-lg leading-relaxed text-muted-foreground">
              {page?.description ?? page?.landingPageDescription}
            </CmsMarkdown>

            <div className="grid gap-4 md:grid-cols-2">
              {contentBlocks.map((block, index) => {
                const isFullWidth = block.layout === 'full';
                return (
                  <Card
                    key={`${block.heading ?? 'block'}-${index}`}
                    className={`border-2 border-primary/10 bg-white ${
                      isFullWidth ? 'md:col-span-2 p-8 md:p-10' : 'p-6'
                    }`}
                  >
                    {block.image && (
                      <img
                        src={block.image}
                        alt={block.imageAlt ?? ''}
                        className={`mb-4 w-full rounded-xl object-cover ${
                          isFullWidth ? 'max-h-96' : 'aspect-video'
                        }`}
                      />
                    )}
                    <CmsMarkdown className="font-serif text-2xl font-bold text-primary mb-2">
                      {block.heading}
                    </CmsMarkdown>
                    <CmsMarkdown className="text-muted-foreground">
                      {block.body}
                    </CmsMarkdown>
                    {block.linkUrl && block.linkLabel && (
                      <a
                        href={block.linkUrl}
                        target={/^https?:\/\//i.test(block.linkUrl) ? '_blank' : undefined}
                        rel={/^https?:\/\//i.test(block.linkUrl) ? 'noopener noreferrer' : undefined}
                        className="mt-4 inline-block font-bold text-primary underline"
                      >
                        {block.linkLabel}
                      </a>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="p-8 border-2 border-primary/10 bg-white shadow-xl rounded-[2rem]">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              {page?.audienceHeading ?? 'Who it’s for'}
            </h2>
            {audienceItems.length > 0 && (
              <ul className="space-y-3 text-muted-foreground">
                {audienceItems.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}
              </ul>
            )}
            <div className="mt-8">
              <Button
                onClick={() =>
                  openSignup({
                    id: "connect-groups",
                    title,
                    kind: "join",
                  })
                }
                className="w-full bg-primary hover:bg-primary/90 py-6 uppercase tracking-widest font-bold"
              >
                Get Connected
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

        {page?.gallery && page.gallery.length > 0 && (
          <div className="mt-10">
            <EventMedia
              event={{ title, image: undefined, photos: [], gallery: page.gallery }}
              galleryTitle="Connect Groups Gallery"
            />
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
