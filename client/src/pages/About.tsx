import { Link } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Mail, Phone } from 'lucide-react';
import { staffMembers, StaffMember } from '../data/staff';

export default function About() {
  // ✅ WHITELIST REMOVED: We now use the full list from staff_data.json
  // This means anyone you add in the CMS will automatically appear here.
  const filteredStaff = staffMembers.filter(member => !member.isHidden);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
        <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
        <div className="container relative grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-end mx-auto px-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
              The people of the Little Flower
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
              The people behind our parish.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Meet the clergy and staff who accompany our parish family in prayer and service.
            </p>
          </div>
          <aside className="border-l-2 border-[#b8954f] pl-6 md:mb-1">
            <p className="font-serif text-2xl italic leading-snug text-primary">
              Faithfulness is often lived in small acts of love, offered quietly and together.
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f]">
              Our Little Way of Service
            </p>
          </aside>
        </div>
      </section>

      <section className="py-10 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-2 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStaff.map((member: StaffMember, idx: number) => (
                <Card
                  key={idx}
                  className="group overflow-hidden rounded-none border border-primary/12 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30"
                >
                  <Link href={`/staff/${member.slug}`} className="block">
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-primary/5 flex items-center justify-center">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={`${member.name} portrait`}
                          loading="lazy"
                          className={`h-full w-full ${member.photoFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                          style={{ objectPosition: member.photoPosition ?? 'center 25%' }}
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-primary p-6 text-center">
                          <p className="font-serif text-lg font-bold">Little Flower Team</p>
                        </div>
                      )}
                    </div>

                    <div className="p-2 sm:p-5">
                      <h3 className="break-words text-sm font-serif font-bold text-primary mb-1 sm:text-lg">{member.name}</h3>
                      <div className="mb-2 space-y-1 sm:mb-4">
                        {member.titles.map((title: string, titleIdx: number) => (
                          <p key={titleIdx} className="break-words text-[8px] font-bold text-accent uppercase tracking-wide sm:text-xs">
                            {title}
                          </p>
                        ))}
                      </div>

                      <div className="hidden space-y-2 border-t border-primary/5 pt-4 sm:block">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Mail className="size-3" /> {member.email}
                          </a>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="size-3" /> {member.phone}
                          </div>
                        )}
                        {member.officeRoom && (
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <span className="font-bold">Room:</span>
                            <span>{member.officeRoom}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
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
