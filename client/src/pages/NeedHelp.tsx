import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HandHeart } from 'lucide-react';
import { useInterestSignup } from '@/contexts/InterestSignupContext';
import getInvolvedData from '@/data/get-involved';

export default function NeedHelp() {
  const { openEngagement } = useInterestSignup();
  const pageSettings = getInvolvedData.settings.parishLifePages?.needHelp;

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="container mx-auto flex flex-grow items-center px-4 py-16">
        <Card className="mx-auto w-full max-w-3xl border-2 border-primary/10 bg-white p-8 text-center shadow-sm md:p-12">
          <HandHeart className="mx-auto size-12 text-accent" aria-hidden="true" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">Parish Life</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-primary md:text-6xl">
            {pageSettings?.title ?? 'Need Help?'}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {pageSettings?.introduction ?? 'Share a little about the help you are looking for. Parish staff will follow up with you.'}
          </p>
          <Button
            onClick={() => openEngagement('request-help')}
            className="mt-8 bg-primary px-8 py-6 font-bold uppercase tracking-widest text-white hover:bg-primary/90"
          >
            {pageSettings?.requestButton ?? 'Request Help'}
          </Button>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
