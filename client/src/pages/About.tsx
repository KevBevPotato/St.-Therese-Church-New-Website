// Sacred Minimalism: dignified editorial hierarchy, warm ivory space, and portrait-led community storytelling.
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Flower2, Mail, Phone } from 'lucide-react';

/**
 * About/Staff Page - Diocese Personnel Layout with Photos
 * Features: Staff directory with photos, organized by category
 * Now supports multiple categories and titles per person
 */

interface StaffMember {
  name: string;
  titles: string[]; // Now an array to support multiple titles
  email?: string;
  phone?: string;
  categories: Array<'clergy' | 'staff' | 'catechist' | 'council' | 'music' | 'ministries'>; // Now an array
  photo?: string;
  photoPosition?: string;
  photoFit?: 'cover' | 'contain';
  duties?: string;
  bio?: string;
}

const baseStaffMembers: Array<Omit<StaffMember, 'duties' | 'bio'>> = [
  // CLERGY (Priests & Deacons)
  {
    name: 'Fr. Mark McCormick',
    titles: ['Pastor'],
    email: 'mmccormick@diorc.org',
    phone: '',
    categories: ['clergy'],
    photo: '/FrMark.jpg',
    photoPosition: 'center 24%',
    photoFit: 'cover',
  },
  {
    name: 'Fr. Todd VanderMay',
    titles: ['Associate Pastor'],
    email: 'tvandermay@diorc.org',
    phone: '',
    categories: ['clergy'],
    photo: '/FrToddVanderMay.jpg',
    photoPosition: 'center 22%',
    photoFit: 'cover',
  },
  {
    name: 'Deacon Chuck Rausch',
    titles: ['Retired Deacon'],
    email: 'crausch@diorc.org',
    phone: '',
    categories: ['clergy'],
    photo: '/DcnChuck.png',
    photoPosition: 'center 28%',
    photoFit: 'cover',
  },
  {
    name: 'Deacon Don Moore',
    titles: ['Deacon'],
    email: 'dmoore@diorc.org',
    phone: '',
    categories: ['clergy'],
    photo: '/DcnDon.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  // STAFF
  {
    name: 'Bobby Myers',
    titles: ['Director of Religious Education'],
    email: 'bmyers@diorc.org',
    phone: '',
    categories: ['staff'],
    photo: '/BobbyMeyers.png',
    photoPosition: 'center 24%',
    photoFit: 'cover',
  },
  {
    name: 'Connie Heeren',
    titles: ['Staff'],
    email: 'cheeren@diorc.org',
    phone: '',
    categories: ['staff'],
    photo: '/ConnieHeeran.png',
    photoPosition: 'center 21%',
    photoFit: 'cover',
  },
  {
    name: 'Melanie Karp',
    titles: ['Staff'],
    email: 'mkarp@diorc.org',
    phone: '',
    categories: ['staff'],
    photo: '/MelanieKarp.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Elaine Duncan',
    titles: ['Staff'],
    phone: '',
    categories: ['staff'],
    photo: '/ElaineDuncan.png',
    photoPosition: 'center 24%',
    photoFit: 'cover',
  },
  {
    name: 'Faye Clough',
    titles: ['Staff'],
    phone: '',
    categories: ['staff'],
    photo: '/FayeClough.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Lorinda Collings',
    titles: ['Staff'],
    email: 'lorinda.collings@ojbh.org',
    phone: '',
    categories: ['staff'],
    photo: '/LorindaCollings.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Anthony Flores',
    titles: ['OCIA Coordinator'],
    phone: '',
    categories: ['staff'],
    photo: '/AnthonyFlores.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  // CATECHISTS
  {
    name: 'Kevin Baltzer',
    titles: ['Adult & Family Catechist'],
    email: 'kbaltzer@diorc.org',
    phone: '',
    categories: ['catechist', 'staff'],
    photo: '/Kevin-Baltzer.png',
    photoPosition: 'center 35%',
    photoFit: 'cover',
  },
  // PARISH COUNCIL
  {
    name: 'Chad Carroll',
    titles: ['President', 'Buildings & Grounds'],
    phone: '',
    categories: ['council'],
    photo: './ChadCarroll.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Neil Whartman',
    titles: ['Vice-President', 'Faith Formation'],
    phone: '',
    categories: ['council'],
    photo: './NeilWhartman.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Carman Timmerman',
    titles: ['Secretary'],
    phone: '',
    categories: ['council'],
    photo: './CarmanTimmerman.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Jean French',
    titles: ['Stewardship'],
    phone: '',
    categories: ['council'],
    photo: './JeanFrench.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Alex Whitney',
    titles: ['Member'],
    categories: ['council'],
    photo: './AlexWhitney.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  // MUSIC MINISTRY
  {
    name: 'Sue Englin',
    titles: ['Music Ministry'],
    email: 'insback40@gmail.com',
    phone: '',
    categories: ['music'],
    photo: '/SueEnglin.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Jeanne Schneider',
    titles: ['Music Ministry'],
    email: 'Jeanne@KTLLP.com',
    phone: '',
    categories: ['music'],
    photo: '/JeanneSchneider.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Jolene Click',
    titles: ['Music Ministry'],
    email: 'misterpallet@msn.com',
    phone: '',
    categories: ['music'],
    photo: undefined,
  },
  {
    name: 'Mary Boydston',
    titles: ['New Underwood Music Ministry'],
    email: 'mary.boydston@yahoo.com',
    phone: '',
    categories: ['music'],
    photo: undefined,
  },
  // OTHER MINISTRIES
  {
    name: 'Doug Keyser',
    titles: ['Knights of Columbus Grand Knight'],
    phone: '',
    categories: ['ministries'],
    photo: '/DougKeyser.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Elaine Kocher',
    titles: ['Altar Society President'],
    phone: '',
    categories: ['ministries'],
    photo: '/ElaineKocher.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Bob Case',
    titles: ['Lector Training'],
    email: 'bobcaserhc@rushmore.com',
    phone: '',
    categories: ['ministries'],
    photo: '/BobCase.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Dick Cuka',
    titles: ['Usher Training (4:30 pm)'],
    phone: '',
    categories: ['ministries'],
    photo: '/DickCuka.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Al Solano',
    titles: ['Usher Training (9 am)'],
    phone: '',
    categories: ['ministries'],
    photo: '/AlSolano.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Dave VanCleave',
    titles: ['Usher Training (5:30 pm)'],
    phone: '',
    categories: ['ministries'],
    photo: '/DaveVanCleave.png',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  {
    name: 'Toni Weber',
    titles: ['Catholic Daughters'],
    phone: '',
    categories: ['ministries'],
    photo: '/ToniWeber.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
];

const staffMembers: StaffMember[] = baseStaffMembers.map((member) => ({
  ...member,
  duties: 'Serving the parish community with care and dedication.',
  bio: 'More information about this ministry role will be shared soon.',
}));

const categories = [
  { id: 'all', label: 'All Personnel' },
  { id: 'clergy', label: 'Clergy' },
  { id: 'staff', label: 'Staff' },
  { id: 'catechist', label: 'Catechists' },
  { id: 'council', label: 'Parish Council' },
  { id: 'music', label: 'Music Ministry' },
  { id: 'ministries', label: 'Other Ministries' },
];

export default function About() {
  const [selectedCategory, setSelectedCategory] = useState<'clergy' | 'staff' | 'catechist' | 'council' | 'music' | 'ministries' | 'all'>('all');

  const filteredStaff = selectedCategory === 'all'
    ? staffMembers
    : staffMembers.filter(member => member.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="pt-[69px]" />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
        <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
        <div className="container relative grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-end mx-auto px-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]"><Flower2 className="size-4" aria-hidden="true" /> The people of the Little Flower</p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">The people behind our parish.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Meet the clergy, staff, catechists, council members, and ministry leaders who accompany our parish family in prayer and service.</p>
          </div>
          <aside className="border-l-2 border-[#b8954f] pl-6 md:mb-1">
            <p className="font-serif text-2xl italic leading-snug text-primary">Faithfulness is often lived in small acts of love, offered quietly and together.</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f]">Our Little Way of Service</p>
          </aside>
        </div>
      </section>

      {/* Personnel Directory Section */}
      <section className="py-10 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Tabs */}
            <div className="mb-12 flex flex-wrap justify-start gap-x-5 gap-y-2 border-b border-primary/12">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`border-b-2 px-1 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-colors md:text-sm ${selectedCategory === cat.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-primary/35 hover:text-primary'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Personnel Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStaff.map((member, idx) => (
                <Card
                  key={idx}
                  className="overflow-hidden rounded-none border border-primary/12 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-primary/5 flex items-center justify-center">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={`${member.name} portrait`}
                        className={`h-full w-full ${member.photoFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                        style={{ objectPosition: member.photoPosition ?? 'center 25%' }}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-primary p-6 text-center">
                        <Flower2 className="size-12 text-primary/10 mb-4" />
                        <p className="font-serif text-lg font-bold">Little Flower Team</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-2">Portrait forthcoming</p>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-serif font-bold text-primary mb-1">{member.name}</h3>

                    {/* Display all titles */}
                    <div className="mb-4 space-y-1">
                      {member.titles.map((title, titleIdx) => (
                        <p key={titleIdx} className="text-xs font-bold text-accent uppercase tracking-wide">
                          {title}
                        </p>
                      ))}
                    </div>

                    {/* Display all categories as badges */}
                    <div className="mb-4 flex flex-wrap gap-1">
                      {member.categories.map((cat) => {
                        const categoryLabel = categories.find(c => c.id === cat)?.label || cat;
                        return (
                          <span
                            key={cat}
                            className="inline-block bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                          >
                            {categoryLabel}
                          </span>
                        );
                      })}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-primary/5">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                          <Mail className="size-3" /> {member.email}
                        </a>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="size-3" /> {member.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}