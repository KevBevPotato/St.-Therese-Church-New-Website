// Sacred Minimalism: dignified editorial hierarchy, warm ivory space, and portrait-led community storytelling.
import { useState } from 'react';
import Header from '@/components/Header';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Flower2, Mail, Phone } from 'lucide-react';

/**
 * About/Staff Page - Diocese Personnel Layout with Photos
 * Features: Staff directory with photos, organized by category
 * Similar to: https://www.rapidcitydiocese.org/about-us/personnel/
 * Color Scheme: Deep Stone Blue primary, Warm Cream secondary, Gold accents
 */

interface StaffMember {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  category: 'clergy' | 'deacon' | 'council' | 'music' | 'staff' | 'ministries';
  photo?: string;
  photoPosition?: string;
  photoFit?: 'cover' | 'contain';
}

const staffMembers: StaffMember[] = [
  // CLERGY
  {
    name: 'Fr. Mark McCormick',
    title: 'Pastor',
    email: 'mmccormick@diorc.org',
    phone: '(605) 484-2161',
    category: 'clergy',
    photo: '/manus-storage/FrMarkMcCormick_b22a925a.jpg',
    photoPosition: 'center 24%',
    photoFit: 'cover',
  },
  {
    name: 'Fr. Todd VanderMay',
    title: 'Associate Pastor',
    email: 'tvandermay@diorc.org',
    phone: '(605) 407-1120',
    category: 'clergy',
    photo: '/manus-storage/FrToddVanderMay_f0105a20.jpg',
    photoPosition: 'center 22%',
    photoFit: 'cover',
  },
  // DEACONS
  {
    name: 'Deacon Chuck Rausch',
    title: 'Retired Deacon',
    email: 'crausch@diorc.org',
    phone: '(605) 391-7556',
    category: 'deacon',
    photo: '/manus-storage/DeaconChuckRausch_4593dada.jpg',
    photoPosition: 'center 28%',
    photoFit: 'cover',
  },
  {
    name: 'Deacon Don Moore',
    title: 'Deacon',
    email: 'dmoore@diorc.org',
    phone: '(972) 955-7853',
    category: 'deacon',
    photo: '/manus-storage/DeaconDonMoore_67766497.jpg',
    photoPosition: 'center 25%',
    photoFit: 'cover',
  },
  // PARISH COUNCIL
  {
    name: 'Bobby Myers',
    title: 'Parish Council President',
    email: 'bmyers@diorc.org',
    phone: '(605) 381-0053',
    category: 'council',
    photo: '/manus-storage/BobbyMyers_v2_3e01ace2.jpg',
    photoPosition: 'center 24%',
    photoFit: 'cover',
  },
  // STAFF
  {
    name: 'Connie Heeren',
    title: 'Staff',
    email: 'cheeren@diorc.org',
    phone: '(605) 484-6278',
    category: 'staff',
    photo: '/manus-storage/ConnieHeeren_477eefd0.png',
    photoPosition: 'center 21%',
    photoFit: 'cover',
  },
  {
    name: 'Melanie Karp',
    title: 'Staff',
    email: 'mkarp@diorc.org',
    phone: '(605) 430-0459',
    category: 'staff',
    photo: undefined,
  },
  {
    name: 'Kevin Baltzer',
    title: 'Staff',
    email: 'kbaltzer@diorc.org',
    phone: '(605) 354-2952',
    category: 'staff',
    photo: '/manus-storage/KevinBaltzer_v2_11dab1a2.webp',
    photoPosition: 'center 35%',
    photoFit: 'cover',
  },
  {
    name: 'Lorinda Collings',
    title: 'Staff',
    email: 'lorinda.collings@ojbh.org',
    phone: '(605) 391-2788',
    category: 'staff',
    photo: undefined,
  },
  {
    name: 'Elaine Duncan',
    title: 'Staff',
    phone: '(605) 348-6808',
    category: 'staff',
    photo: '/manus-storage/ElaineDuncan_3c2041f4.jpg',
    photoPosition: 'center 24%',
    photoFit: 'cover',
  },
  {
    name: 'Faye Clough',
    title: 'Staff',
    phone: '(605) 381-1613',
    category: 'staff',
    photo: undefined,
  },
  {
    name: 'Anthony Flores',
    title: 'OCIA Coordinator',
    phone: '(605) 484-3190',
    category: 'staff',
    photo: undefined,
  },
  // MUSIC MINISTRY
  {
    name: 'Sue Englin',
    title: 'Music Ministry',
    email: 'insback40@gmail.com',
    phone: '(605) 391-8455',
    category: 'music',
    photo: undefined,
  },
  {
    name: 'Jeanne Schneider',
    title: 'Music Ministry',
    email: 'Jeanne@KTLLP.com',
    phone: '(605) 484-4657',
    category: 'music',
    photo: undefined,
  },
  {
    name: 'Jolene Click',
    title: 'Music Ministry',
    email: 'misterpallet@msn.com',
    phone: '(605) 923-7926',
    category: 'music',
    photo: undefined,
  },
  {
    name: 'Mary Boydston',
    title: 'New Underwood Music Ministry',
    email: 'mary.boydston@yahoo.com',
    phone: '(605) 574-6906',
    category: 'music',
    photo: undefined,
  },
  // OTHER MINISTRIES
  {
    name: 'Doug Keyser',
    title: 'Knights of Columbus Grand Knight',
    phone: '(605) 863-9280',
    category: 'ministries',
    photo: undefined,
  },
  {
    name: 'Elaine Kocher',
    title: 'Altar Society President',
    phone: '(605) 430-1921',
    category: 'ministries',
    photo: undefined,
  },
  {
    name: 'Bob Case',
    title: 'Lector Training',
    email: 'bobcaserhc@rushmore.com',
    phone: '(605) 390-2357',
    category: 'ministries',
    photo: undefined,
  },
  {
    name: 'Dick Cuka',
    title: 'Usher Training (4:30 pm)',
    phone: '(605) 209-4691',
    category: 'ministries',
    photo: undefined,
  },
  {
    name: 'Al Solano',
    title: 'Usher Training (9 am)',
    phone: '(605) 342-8974',
    category: 'ministries',
    photo: undefined,
  },
  {
    name: 'Dave VanCleave',
    title: 'Usher Training (5:30 pm)',
    phone: '(605) 381-9329',
    category: 'ministries',
    photo: undefined,
  },
  {
    name: 'Toni Weber',
    title: 'Catholic Daughters',
    phone: '(605) 430-7884',
    category: 'ministries',
    photo: '/manus-storage/ToniWeber_352c4841.jpg',
    photoPosition: 'center 28%',
    photoFit: 'cover',
  },
];

const categories = [
  { id: 'all', label: 'All Personnel' },
  { id: 'clergy', label: 'Clergy' },
  { id: 'deacon', label: 'Deacons' },
  { id: 'council', label: 'Parish Council' },
  { id: 'staff', label: 'Staff' },
  { id: 'music', label: 'Music Ministry' },
  { id: 'ministries', label: 'Other Ministries' },
];

export default function About() {
  const [selectedCategory, setSelectedCategory] = useState<'clergy' | 'deacon' | 'council' | 'music' | 'staff' | 'ministries' | 'all'>('all');

  const filteredStaff = selectedCategory === 'all'
    ? staffMembers
    : staffMembers.filter(member => member.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="pt-[69px]">
        <PageBreadcrumbs items={[{ label: 'About & Staff' }]} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
        <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
        <div className="container relative grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]"><Flower2 className="size-4" aria-hidden="true" /> The people of the Little Flower</p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">The people behind our parish.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Meet the clergy, deacons, staff, council members, and ministry leaders who accompany our parish family in prayer and service.</p>
          </div>
          <aside className="border-l-2 border-[#b8954f] pl-6 md:mb-1">
            <p className="font-serif text-2xl italic leading-snug text-primary">Faithfulness is often lived in small acts of love, offered quietly and together.</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f]">Our Little Way of Service</p>
          </aside>
        </div>
      </section>

      {/* About Section */}
      <section className="border-b border-primary/10 bg-white py-14 md:py-16">
        <div className="container grid gap-8 md:grid-cols-[0.58fr_1.42fr] md:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b762f]">Saint Therese in Rapid City</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-primary md:text-4xl">A parish shaped by worship, welcome, and service.</h2>
          </div>
          <div className="grid gap-5 text-base leading-relaxed text-muted-foreground md:grid-cols-2 md:text-lg">
            <p>The Church of St. Therese the Little Flower has served generations of Rapid City Catholics through sacramental life, spiritual guidance, education, and pastoral care.</p>
            <p>Our team works together so every person who arrives—longtime parishioner or first-time visitor—can find a place to pray, belong, grow, and serve.</p>
          </div>
        </div>
      </section>

      {/* Personnel Directory Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 grid gap-5 md:grid-cols-[0.72fr_1.28fr] md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b762f]">Who can we help you find?</p>
                <h2 className="mt-2 font-serif text-4xl font-bold text-primary md:text-5xl">Personnel Directory</h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:justify-self-end">Our parish team is here to help with sacramental preparation, ministry life, parish questions, and the everyday needs of our community.</p>
            </div>

            {/* Category Tabs - Scrollable on mobile */}
            <div className="mb-12 flex flex-wrap justify-start gap-x-5 gap-y-2 border-b border-primary/12">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`border-b-2 px-1 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-colors md:text-sm ${
                    selectedCategory === cat.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:border-primary/35 hover:text-primary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Personnel Grid with Photos */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((member, idx) => (
                  <Card
                    key={idx}
                    className="overflow-hidden rounded-none border border-primary/12 bg-white shadow-[0_10px_30px_rgba(26,55,89,0.05)] transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_40px_rgba(26,55,89,0.11)]"
                  >
                    {/* Photo Section */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      {member.photo ? (
                        <>
                          <img
                            src={member.photo}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-25"
                            style={{ objectPosition: member.photoPosition ?? 'center 25%' }}
                          />
                          <img
                            src={member.photo}
                            alt={`${member.name} portrait`}
                            className={`relative z-10 h-full w-full ${member.photoFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                            style={{ objectPosition: member.photoPosition ?? 'center 25%' }}
                          />
                        </>
                      ) : (
                        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#f3eddf] px-6 text-center text-primary">
                          <div className="absolute inset-5 border border-[#b8954f]/22" aria-hidden="true" />
                          <Flower2 className="absolute right-7 top-7 size-16 rotate-12 text-[#b8954f]/12" aria-hidden="true" />
                          <img src="/manus-storage/church_logo_d5d3b2ed.png" alt="" className="relative size-16 object-contain opacity-45" />
                          <p className="relative mt-5 font-serif text-xl font-bold">Little Flower Parish Team</p>
                          <p className="relative mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b762f]">Portrait forthcoming</p>
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-serif font-bold text-primary mb-1 break-words">
                            {member.name}
                          </h3>
                          <p className="text-xs font-medium text-accent uppercase tracking-wide break-words">
                            {member.title}
                          </p>
                        </div>
                        <span className="inline-block border-l border-[#b8954f] pl-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a6829] whitespace-nowrap flex-shrink-0">
                          {member.category === 'clergy' && 'Clergy'}
                          {member.category === 'deacon' && 'Deacon'}
                          {member.category === 'council' && 'Council'}
                          {member.category === 'staff' && 'Staff'}
                          {member.category === 'music' && 'Music'}
                          {member.category === 'ministries' && 'Ministry'}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 pt-4 border-t border-border/50">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                          >
                            <Mail size={14} className="flex-shrink-0" />
                            <span className="break-all">{member.email}</span>
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                            className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Phone size={14} className="flex-shrink-0" />
                            {member.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No personnel in this category.
                  </p>
                </div>
              )}
            </div>

            {/* Staff Count */}
            <div className="text-center mt-8 text-muted-foreground">
              <p className="text-sm">
                {selectedCategory === 'all' 
                  ? `Total: ${staffMembers.length} staff members` 
                  : `Showing ${filteredStaff.length} ${categories.find(c => c.id === selectedCategory)?.label.toLowerCase()}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Parish Office */}
              <div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">
                  Parish Office
                </h3>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p>532 Adams St.</p>
                    <p>Rapid City, SD 57701</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a href="tel:+16053421556" className="text-primary hover:text-primary/80 transition-colors">
                      (605) 342-1556
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a href="mailto:sttherese@diorc.org" className="text-primary hover:text-primary/80 transition-colors">
                      sttherese@diorc.org
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Office Hours</p>
                    <p>Monday - Friday</p>
                    <p>8 AM - 12 PM, 1 PM - 3 PM</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="/" className="text-primary hover:text-primary/80 transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/#mass-schedule" className="text-primary hover:text-primary/80 transition-colors">
                      Mass Schedule
                    </a>
                  </li>
                  <li>
                    <a href="https://secure.myvanco.com/L-ZAYT/home" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                      Donate
                    </a>
                  </li>
                  <li>
                    <a href="https://www.google.com/maps/dir//532+Adams+St,+Rapid+City,+SD+57701/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                      Directions
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
