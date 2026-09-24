import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Heart, Users, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export default function ConnectGroupsPage() {
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
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary leading-tight">Connect Groups</h1>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              Connect Groups are small communities where parishioners gather for prayer, fellowship, and faith-filled conversation.
              They help us grow in friendship, support one another, and bring the Gospel into everyday life.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6 border-2 border-primary/10 bg-white">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users size={20} />
                </div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-2">Faith & Friendship</h2>
                <p className="text-muted-foreground">Meet with a welcoming group for Scripture discussion, prayer, and encouragement.</p>
              </Card>

              <Card className="p-6 border-2 border-primary/10 bg-white">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles size={20} />
                </div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-2">Life Together</h2>
                <p className="text-muted-foreground">Build meaningful relationships and share your faith walk in a supportive community.</p>
              </Card>
            </div>
          </div>

          <Card className="p-8 border-2 border-primary/10 bg-white shadow-xl rounded-[2rem]">
            <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Heart size={22} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">Who it’s for</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Adults and families seeking a welcoming faith community</li>
              <li>• New parishioners looking to connect and build friendships</li>
              <li>• Anyone interested in prayerful small-group discussion</li>
              <li>• Catholics who want to grow in discipleship and community</li>
            </ul>
            <div className="mt-8">
              <a href="mailto:office@sttherese.org?subject=Connect%20Groups%20Interest" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 py-6 uppercase tracking-widest font-bold">
                  Get Connected
                </Button>
              </a>
            </div>
          </Card>
        </div>

        <Card className="mt-10 border-2 border-primary/10 bg-white p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <BookOpen size={20} />
            <h2 className="font-serif text-2xl font-bold">What to expect</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Each Connect Group is rooted in prayer, scripture, and pastoral care. Groups meet regularly to learn together, pray together,
            and support one another in living out the faith in daily life.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
