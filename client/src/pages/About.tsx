// About.tsx
import { Link } from 'wouter';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Flower2, Mail, Phone } from 'lucide-react';
import { staffMembers, staffCategories, StaffMember } from '@/data/staff';

type CategoryId = (typeof staffCategories)[number]['id'];

export default function About() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  // ✅ DYNAMIC FILTERING: This replaces the "visibleStaffSlugs" whitelist
  const filteredStaff = useMemo(() => {
    if (selectedCategory === 'all') return staffMembers;
    return staffMembers.filter((m) =>
      m.categories.includes(selectedCategory as Exclude<CategoryId, 'all'>)
    );
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="pt-[var(--header-height)]" />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
        <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
        <div className="container relative grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-end mx-auto px-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
              <Flower2 className="size-4" aria-hidden="true" /> The people of the Little Flower
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
              The people behind our parish.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Meet the clergy, staff, catechists, council members, and ministry leaders who accompany our parish family in prayer and service.
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

      {/* Personnel Directory Section */}
      <section className="py-10 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* ✅ Category Tabs: Now restored and functional */}
            {/* <div className="mb-12 flex flex-wrap justify-start gap-x-5 gap-y-2 border-b border-primary/12">
              {staffCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`border-b-2 px-1 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-colors md:text-sm ${
                    selectedCategory === cat.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:border-primary/35 hover:text-primary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div> */}

            {/* Personnel Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStaff.map((member: StaffMember, idx: number) => (
                <Card
                  key={idx}
                  className="group overflow-hidden rounded-none border border-primary/12 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30"
                >
                  {/* ✅ Link Wrapper: Now "unlocks" the StaffDetail page */}
                  <Link href={`/staff/${member.slug}`} className="block">
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-primary/5 flex items-center justify-center">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={`${member.name} portrait`}
                          loading="lazy"
                          decoding="async"
                          width={600}
                          height={900}
                          className={`h-full w-full ${
                            member.photoFit === 'cover' ? 'object-cover' : 'object-contain'
                          } transition-transform duration-700 group-hover:scale-105`}
                          style={{ objectPosition: member.photoPosition ?? 'center 25%' }}
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-primary p-6 text-center">
                          <Flower2 className="size-12 text-primary/10 mb-4" />
                          <p className="font-serif text-lg font-bold">Little Flower Team</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-2">
                            Portrait forthcoming
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-serif font-bold text-primary mb-1">{member.name}</h3>

                      <div className="mb-4 space-y-1">
                        {member.titles.map((title, titleIdx) => (
                          <p key={titleIdx} className="text-xs font-bold text-accent uppercase tracking-wide">
                            {title}
                          </p>
                        ))}
                      </div>

                      <div className="mb-4 flex flex-wrap gap-1">
                        {member.categories.map((cat) => {
                          const categoryLabel = staffCategories.find((c) => c.id === cat)?.label || cat;
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
                          <a
                            href={`mailto:${member.email}`}
                            onClick={(e) => e.stopPropagation()} // Prevents Link from firing when clicking email
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
                      </div>

                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 group-hover:text-primary/60 transition-colors">
                        Read More →
                      </p>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
            
            {filteredStaff.length === 0 && (
              <div className="text-center py-20 text-muted-foreground font-serif italic">
                No personnel found in this category.
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
