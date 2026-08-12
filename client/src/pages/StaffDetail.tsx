import { useParams, Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getStaffBySlug, staffMembers, staffCategories, StaffMember } from '@/data/staff';
import { Flower2, Mail, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StaffDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const member = slug ? getStaffBySlug(slug) : undefined;

  // Find other people in the same primary category for the "You may also like" rail
  const relatedMembers = member
    ? staffMembers
        .filter((m) => m.slug !== member.slug && m.categories.some((c) => member.categories.includes(c)))
        .slice(0, 4)
    : [];

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="pt-[69px]" />
        <section className="container mx-auto px-4 py-24 text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-4">
            <Flower2 className="size-4" /> Not Found
          </p>
          <h1 className="font-serif text-4xl font-bold text-primary mb-4 md:text-5xl">
            We couldn't find that person.
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The link may be out of date, or this team member may no longer be with our parish.
          </p>
          <Link href="/about">
            <Button variant="outline" className="rounded-none border-primary/30 text-primary hover:bg-primary/5">
              <ArrowLeft className="mr-2 size-4" /> Back to all personnel
            </Button>
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  const primaryCategory = member.categories[0];
  const categoryLabel = staffCategories.find((c) => c.id === primaryCategory)?.label ?? 'Team Member';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="pt-[69px]" />

      {/* Breadcrumb back link */}
      <section className="container mx-auto px-4 pt-8 md:pt-10">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f] hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" /> All Personnel
        </Link>
      </section>

      {/* Main detail */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-14 max-w-6xl">
          {/* Portrait */}
          <div className="aspect-[2/3] w-full overflow-hidden bg-primary/5 border border-primary/12">
            {member.photo ? (
              <img
                src={member.photo}
                alt={`${member.name} portrait`}
                loading="eager"
                decoding="async"
                width={600}
                height={900}
                className={`h-full w-full ${
                  member.photoFit === 'cover' ? 'object-cover' : 'object-contain'
                }`}
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

          {/* Content */}
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
              <Flower2 className="size-4" /> {categoryLabel}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.05] text-primary md:text-5xl">
              {member.name}
            </h1>

            <div className="mt-4 space-y-1">
              {member.titles.map((title, i) => (
                <p key={i} className="text-sm font-bold text-accent uppercase tracking-wide">
                  {title}
                </p>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-8 border-t border-primary/10 pt-6 space-y-3">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Mail className="size-4 text-[#9b762f]" />
                  <span>{member.email}</span>
                </a>
              )}
              {member.phone && member.phone.trim() !== '' && (
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <Phone className="size-4 text-[#9b762f]" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>

            {/* Duties */}
            <div className="mt-10">
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                Duties & Ministry
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {member.duties}
              </p>
            </div>

            {/* Bio */}
            <div className="mt-8">
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                About
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {member.bio}
              </p>
            </div>

            {/* Category badges */}
            {member.categories.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-primary/10">
                {member.categories.map((cat) => {
                  const label = staffCategories.find((c) => c.id === cat)?.label ?? cat;
                  return (
                    <span
                      key={cat}
                      className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related personnel */}
      {relatedMembers.length > 0 && (
        <section className="border-t border-primary/10 bg-secondary/20 py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f] mb-3">
                <Flower2 className="size-4" /> Continue exploring
              </p>
              <h2 className="font-serif text-3xl font-bold text-primary mb-8 md:text-4xl">
                You may also like to meet
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {relatedMembers.map((other: StaffMember) => (
                  <Link
                    key={other.slug}
                    href={`/staff/${other.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden bg-primary/5 border border-primary/12">
                      {other.photo ? (
                        <img
                          src={other.photo}
                          alt={`${other.name} portrait`}
                          loading="lazy"
                          decoding="async"
                          width={600}
                          height={900}
                          className={`h-full w-full ${
                            other.photoFit === 'cover' ? 'object-cover' : 'object-contain'
                          } transition-transform duration-700 group-hover:scale-105`}
                          style={{ objectPosition: other.photoPosition ?? 'center 25%' }}
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-primary p-4 text-center">
                          <Flower2 className="size-8 text-primary/10 mb-2" />
                          <p className="font-serif text-sm font-bold">Little Flower Team</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="font-serif text-sm font-bold leading-tight text-primary group-hover:text-[#9b762f] transition-colors">
                        {other.name}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#9b762f]">
                        {other.titles[0]}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
