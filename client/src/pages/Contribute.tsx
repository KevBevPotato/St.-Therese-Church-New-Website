import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Users } from 'lucide-react';
import { useInterestSignup } from '@/contexts/InterestSignupContext';
import getInvolvedData from '@/data/get-involved';

type ContributionAction =
  | 'wednesday_supper_signup'
  | 'lead_connect_group'
  | 'external_link'
  | 'none';

function isContributionAction(action: string): action is ContributionAction {
  return (
    action === 'wednesday_supper_signup' ||
    action === 'lead_connect_group' ||
    action === 'external_link' ||
    action === 'none'
  );
}

export default function Contribute() {
  const { openEngagement, openSignup } = useInterestSignup();
  const pageSettings = getInvolvedData.settings.parishLifePages?.contribute;
  const opportunities = pageSettings?.opportunities ?? [];

  const handleOpportunityAction = (action: ContributionAction, title: string) => {
    if (action === 'wednesday_supper_signup') {
      openEngagement('signup-supper', 'Wednesday Night Supper');
    } else if (action === 'lead_connect_group') {
      openSignup({ id: 'connect-groups', title, kind: 'join' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="container mx-auto flex-grow px-4 py-16">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">Parish Life</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-primary md:text-6xl">
            {pageSettings?.title ?? 'Looking for a way to contribute?'}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {pageSettings?.introduction ?? 'Share your time and gifts with the parish community through these opportunities.'}
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {opportunities.map((opportunity) => {
            const action = isContributionAction(opportunity.action)
              ? opportunity.action
              : 'none';
            const Icon =
              action === 'wednesday_supper_signup' ? Heart : Users;

            return (
              <Card key={opportunity.id} className="flex flex-col border-2 border-primary/10 bg-white p-7">
                <Icon className="size-9 text-accent" aria-hidden="true" />
                <h2 className="mt-4 font-serif text-2xl font-bold text-primary">
                  {opportunity.title}
                </h2>
                <p className="mt-3 flex-grow leading-relaxed text-muted-foreground">
                  {opportunity.description}
                </p>
                {action === 'external_link' && opportunity.url ? (
                  <a
                    href={opportunity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-fit"
                  >
                    <Button className="bg-primary px-5 font-bold uppercase tracking-widest text-white hover:bg-primary/90">
                      {opportunity.button}
                    </Button>
                  </a>
                ) : action !== 'none' ? (
                  <Button
                    onClick={() => handleOpportunityAction(action, opportunity.title)}
                    className="mt-6 w-fit bg-primary px-5 font-bold uppercase tracking-widest text-white hover:bg-primary/90"
                  >
                    {opportunity.button}
                  </Button>
                ) : null}
              </Card>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
