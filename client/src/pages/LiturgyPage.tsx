import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { MessageSquare, UserPlus } from 'lucide-react';
import getInvolvedData from '@/data/get-involved';
import { useInterestSignup } from '@/contexts/InterestSignupContext';

const liturgyRoleIds = ['lector', 'usher', 'altar-server', 'music'];

export default function LiturgyPage() {
  const { openSignup, openEngagement } = useInterestSignup();
  const pageSettings = getInvolvedData.settings.parishLifePages?.liturgy;
  const roles = getInvolvedData.opportunities.filter((opportunity) =>
    liturgyRoleIds.includes(opportunity.id)
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="container mx-auto flex-grow px-4 py-16">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">Parish Life</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-primary md:text-6xl">
            {pageSettings?.title ?? 'Help with the Liturgy!'}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {pageSettings?.introduction ?? 'Help our parish celebrate the Mass through one of these liturgical ministries. Learn more about each role and sign up to serve.'}
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {roles.map((role) => (
            <Card key={role.id} className="flex flex-col border-2 border-primary/10 bg-white p-7">
              <h2 className="font-serif text-2xl font-bold text-primary">
                {role.title.replace(' Sign-up', '')}
              </h2>
              <p className="mt-3 flex-grow leading-relaxed text-muted-foreground">
                {role.description}
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <Button
                  onClick={() =>
                    openSignup({
                      id: role.id,
                      title: role.title,
                      kind: 'volunteer',
                    })
                  }
                  className="bg-primary font-bold uppercase tracking-widest text-white hover:bg-primary/90 sm:col-span-2"
                >
                  {pageSettings?.signUpButton ?? 'Sign Up to Help'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openEngagement('suggestion', role.title)}
                  className="gap-2 border-primary/15 text-xs font-bold uppercase tracking-widest"
                >
                  <MessageSquare size={14} /> {pageSettings?.suggestionButton ?? 'Suggestion'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openEngagement('referral', role.title)}
                  className="gap-2 border-primary/15 text-xs font-bold uppercase tracking-widest"
                >
                  <UserPlus size={14} /> {pageSettings?.referralButton ?? 'Refer'}
                </Button>
              </div>
              <Link
                href={`/get-involved/${role.id}`}
                className="mt-4 inline-flex w-fit items-center text-xs font-bold uppercase tracking-widest text-primary underline-offset-4 hover:text-accent hover:underline"
              >
                {pageSettings?.learnMoreButton ?? 'Learn More'}
              </Link>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
