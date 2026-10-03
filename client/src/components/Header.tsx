import { useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'wouter';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { staticEvents, generateRecurringEventsForMonth } from './eventfolders/events';
import { organizations } from '@/data/organizations';
import { staffMembers } from '../data/staff';
import { faithCategories } from '@/data/faith-formation';

interface HeaderProps {
  showMassTimes?: boolean;
}

interface SearchResult {
  title: string;
  type: string;
  href: string;
  searchableText: string;
}

const searchablePages: SearchResult[] = [
  { title: 'Home', type: 'Page', href: '/', searchableText: 'home saint therese church' },
  { title: 'About & Staff', type: 'Page', href: '/about', searchableText: 'about staff parish team' },
  { title: 'Bulletin', type: 'Page', href: '/bulletin', searchableText: 'bulletin weekly parish news' },
  { title: 'Previous Bulletins', type: 'Page', href: '/bulletin/previous', searchableText: 'previous bulletins archive' },
  { title: 'Next Week Bulletin', type: 'Page', href: '/bulletin/next', searchableText: 'next week bulletin' },
  { title: 'Sacraments', type: 'Page', href: '/sacraments', searchableText: 'sacraments baptism reconciliation marriage communion confirmation' },
  { title: 'Faith Formation', type: 'Page', href: '/faith-formation', searchableText: 'faith formation catechism religious education' },
  { title: 'Get Involved', type: 'Page', href: '/get-involved', searchableText: 'get involved ministries volunteer organizations lector usher altar server music ministry volunteer opportunities' },
  { title: 'Connect Groups', type: 'Page', href: '/get-involved/connect-groups', searchableText: 'connect groups parish life prayer fellowship scripture discussion small group community' },
  { title: 'Group Studies', type: 'Page', href: '/get-involved/group-studies', searchableText: 'group studies parish life bible study catholic teaching faith formation seasonal study groups' },
  { title: 'Parish Calendar', type: 'Page', href: '/events', searchableText: 'parish calendar events schedule' },
];

const searchableSacraments: SearchResult[] = [
  {
    title: 'Marriage Preparation',
    type: 'Sacrament',
    href: '/sacraments#marriage-preparation',
    searchableText: 'marriage preparation matrimony wedding pre-cana engaged encounter',
  },
  {
    title: 'Baptism Class',
    type: 'Sacrament',
    href: '/sacraments#baptism-class',
    searchableText: 'baptism class infant baptism godparents preparation',
  },
  {
    title: 'First Eucharist & First Reconciliation',
    type: 'Sacrament',
    href: '/sacraments#first-eucharist',
    searchableText: 'first eucharist first reconciliation communion confession second grade religious education',
  },
  {
    title: 'Confirmation',
    type: 'Sacrament',
    href: '/sacraments#confirmation',
    searchableText: 'confirmation sixth seventh grade holy spirit confirmation preparation ocia',
  },
  {
    title: 'OCIA (Becoming Catholic)',
    type: 'Sacrament',
    href: '/sacraments#ocia',
    searchableText: 'ocia becoming catholic rcia adult initiation classes september easter vigil',
  },
];

const searchableOpportunities: SearchResult[] = [
  {
    title: 'Lector Sign-up',
    type: 'Get Involved',
    href: '/get-involved/lector',
    searchableText: 'lector sign up liturgy ministry proclaim the scriptures prayers of the faithful training scheduling support',
  },
  {
    title: 'Usher Sign-up',
    type: 'Get Involved',
    href: '/get-involved/usher',
    searchableText: 'usher sign up liturgy ministry welcome parishioners help with pews offertory basket',
  },
  {
    title: 'Altar Server Sign-up',
    type: 'Get Involved',
    href: '/get-involved/altar-server',
    searchableText: 'altar server sign up liturgy ministry serve at the altar book of the gospels chalice sacred items',
  },
  {
    title: 'Music Ministry Sign-up',
    type: 'Get Involved',
    href: '/get-involved/music',
    searchableText: 'music ministry sign up choir instrumentalist cantor sung prayer',
  },
  {
    title: 'Wednesday Night Supper',
    type: 'Get Involved',
    href: '/get-involved/supper-week',
    searchableText: 'wednesday night supper sponsor volunteer grocery pick-up food prep serving cleanup parish hospitality',
  },
  {
    title: 'Nursery',
    type: 'Get Involved',
    href: '/get-involved/nursery',
    searchableText: 'nursery parish council side chapel mothers during mass donations volunteers',
  },
  {
    title: 'Youth Ministry Mentors',
    type: 'Get Involved',
    href: '/get-involved/youth-ministry-mentors',
    searchableText: 'youth ministry mentors faith formation guide high school students small-group leader',
  },
  {
    title: 'Connect Groups',
    type: 'Get Involved',
    href: '/get-involved/connect-groups',
    searchableText: 'connect groups parish life prayer fellowship scripture discussion small group community',
  },
  {
    title: 'Group Studies',
    type: 'Get Involved',
    href: '/get-involved/group-studies',
    searchableText: 'group studies parish life bible study catholic teaching faith formation seasonal study groups',
  },
  {
    title: 'St. Vincent de Paul Food Drive',
    type: 'Get Involved',
    href: '/get-involved/st-vincent-de-paul-food-drive',
    searchableText: 'st vincent de paul food drive sort and distribute food donations local families in need',
  },
  {
    title: 'Altar Society',
    type: 'Get Involved',
    href: '/get-involved/altar-society',
    searchableText: 'altar society women of the parish care for sacred linens altar vessels flowers decorations church service',
  },
  {
    title: 'Knights of Columbus',
    type: 'Get Involved',
    href: '/get-involved/knights-of-columbus',
    searchableText: 'knights of columbus catholic fraternal service organization charitable works faith formation support community fellowship',
  },
  {
    title: 'Catholic Daughters of the Americas',
    type: 'Get Involved',
    href: '/get-involved/catholic-daughters',
    searchableText: 'catholic daughters of the americas prayer fellowship charitable works',
  },
];

export default function Header({ showMassTimes = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(69);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        const h = headerRef.current.getBoundingClientRect().height;
        setHeaderHeight(h);
        document.documentElement.style.setProperty('--header-height', `${h}px`);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const primaryLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About & Staff' },
    { href: '/bulletin', label: 'Bulletin' },
  ];

  const parishLifeLinks: Array<{
    href: string;
    label: string;
    children?: Array<{ href: string; label: string }>;
  }> = [
    { href: '/sacraments', label: 'Sacraments' },
    { href: '/resources', label: 'Resources' },
    { href: '/faith-formation', label: 'Wednesday Faith Formation' },
    {
      href: '/get-involved',
      label: 'Get Involved',
      children: [
        { href: '/get-involved/connect-groups', label: 'Connect Groups' },
        { href: '/get-involved/group-studies', label: 'Group Studies' },
      ],
    },
  ];

  const externalLinks = [
    { href: 'https://gods-call.com/', label: 'Vocations' },
  ];

  const searchResults = useMemo<SearchResult[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) return [];

    const recurringEvents = Array.from({ length: 13 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() + index);
      return generateRecurringEventsForMonth(date.getMonth(), date.getFullYear());
    }).flat();

    const results = [
      ...searchablePages,
      ...searchableSacraments,
      ...searchableOpportunities,
      ...organizations.map((organization) => ({
        title: organization.name,
        type: 'Organization',
        href: `/get-involved/${organization.id}`,
        searchableText: `${organization.name} ${organization.tagline} ${organization.description}`,
      })),
      ...staffMembers.map((member) => ({
        title: member.name,
        type: member.titles[0] || 'Staff',
        href: `/staff/${member.slug}`,
        searchableText: `${member.name} ${member.titles.join(' ')}`,
      })),
      ...faithCategories.map((category) => ({
        title: category.title,
        type: 'Faith Formation',
        href: `/faith-formation/${category.id}`,
        searchableText: `${category.title} ${category.subtitle || ''} ${category.shortDescription} ${category.longDescription}`,
      })),
      ...[...staticEvents, ...recurringEvents]
        .filter((event) => event.title !== 'Daily Mass' && event.title !== 'Daily Rosary' && event.title !== 'Holy Hour')
        .map((event) => ({
          title: event.title,
          type: 'Event',
          href: event.linkedOpportunityId ? `/get-involved/${event.linkedOpportunityId}` : `/events/${event.id}`,
          searchableText: `${event.title} ${event.description || ''} ${event.location}`,
        })),
    ];

    return results
      .map((result) => {
        const title = result.title.toLowerCase();
        const searchableText = result.searchableText.toLowerCase();

        let score = 0;

        if (title.includes(query)) score += 100;
        if (title === query || title.startsWith(query)) score += 40;
        if (searchableText.includes(query)) score += 30;
        if (searchableText.startsWith(query)) score += 20;

        return { result, score };
      })
      .filter(({ result, score }) => score > 0 && result.searchableText.toLowerCase().includes(query))
      .filter(({ result, score }, index, allResults) => {
        const firstMatchIndex = allResults.findIndex((item) => item.result.title === result.title && item.result.href === result.href);
        return firstMatchIndex === index;
      })
      .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
      .map(({ result }) => result)
      .slice(0, 8);
  }, [searchQuery]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const searchResultsList = searchResults.length > 0 ? (
    <div className="absolute right-0 top-full z-[60] mt-2 w-80 overflow-hidden rounded-md border border-border bg-white shadow-xl">
      {searchResults.map((result) => (
        <Link
          key={`${result.type}-${result.href}-${result.title}`}
          href={result.href}
          onClick={closeSearch}
          className="block border-b border-border/60 px-4 py-3 last:border-0 hover:bg-secondary"
        >
          <span className="block text-sm font-semibold text-primary">{result.title}</span>
          <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{result.type}</span>
          <span className="mt-1 block text-[10px] text-muted-foreground/80">{result.href}</span>
        </Link>
      ))}
    </div>
  ) : searchQuery.trim().length >= 2 ? (
    <div className="absolute right-0 top-full z-[60] mt-2 w-80 rounded-md border border-border bg-white px-4 py-5 text-sm text-muted-foreground shadow-xl">
      No matching pages, people, opportunities, or events found.
    </div>
  ) : null;

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border shadow-sm"
    >
      {/* Increased py-3 to py-4 to restore height */}
      <div className="relative z-50 bg-white/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-4">
        
        {/* Logo - Restored to h-20 */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
          <img
            src="/Logo.webp"
            alt="Saint Thérèse Church logo"
            className="h-20 w-auto object-contain"
          />
          <span className="font-serif font-bold text-lg text-primary hidden xl:inline">
              Saint Thérèse · The Little Flower
          </span>
        </Link>

        {/* Desktop Navigation - Restored gaps to gap-4 lg:gap-6 xl:gap-8 */}
        <nav className="relative z-50 hidden items-center justify-end gap-4 lg:gap-6 xl:gap-8 md:flex md:flex-1">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors font-semibold whitespace-nowrap text-base"
            >
              {link.label}
            </Link>
          ))}

          {/* DROPDOWN: Parish Life */}
          <div 
            className="relative group" 
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-semibold whitespace-nowrap text-base"
            >
              Parish Life <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full z-[60] w-56 rounded-b-lg border border-border bg-white py-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                {parishLifeLinks.map((link) => {
                  const hasChildren = !!link.children?.length;

                  return (
                    <div key={link.href} className="relative group/submenu">
                      <Link
                        href={link.href}
                        className="flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
                      >
                        <span>{link.label}</span>
                        {hasChildren && <ChevronDown size={14} className="rotate-[-90deg]" />}
                      </Link>

                      {hasChildren && (
                        <div className="absolute left-full top-0 ml-1 min-w-[180px] rounded-md border border-border bg-white py-2 shadow-lg opacity-0 pointer-events-none group-hover/submenu:opacity-100 group-hover/submenu:pointer-events-auto transition-opacity duration-200">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {externalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors font-semibold whitespace-nowrap text-base"
            >
              {link.label}
            </a>
          ))}

          {/* Facebook Link - Restored to h-20 w-20 */}
          <a
            href="https://www.facebook.com/TheLittleFlowerRapidCity"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity shrink-0"
            aria-label="Facebook"
          >
            <img
              src="/fb.webp"
              alt="Facebook"
              className="h-20 w-20 object-contain"
            />
          </a>

          <a
            href="https://secure.myvanco.com/L-ZAYT/home"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white px-4 py-1 text-xs uppercase tracking-widest font-bold">
              Donate
            </Button>
          </a>

          <div className="relative flex items-center gap-2">
            {isSearchOpen && (
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search parish site"
                aria-label="Search parish site"
                className="h-9 w-56 rounded-md border border-border bg-white px-3 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen((open) => !open)}
              aria-label={isSearchOpen ? 'Close search' : 'Search parish site'}
              title={isSearchOpen ? 'Close search' : 'Search parish site'}
            >
              {isSearchOpen ? <X /> : <Search />}
            </Button>
            {isSearchOpen && searchResultsList}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </div>

      {showMassTimes && (
        <div className="relative z-0 bg-white/80 text-primary backdrop-blur-md">
          <div className="container mx-auto grid grid-cols-3 items-center gap-1 px-3 sm:gap-0 sm:px-4">
            <div className="min-w-0 py-2 sm:py-3 sm:pr-6">
              <p className="truncate text-[8px] font-bold uppercase tracking-[0.1em] text-[#9b762f] sm:text-[10px] sm:tracking-[0.18em]">Sunday Mass</p>
              <p className="mt-0.5 whitespace-nowrap font-serif text-[10px] font-bold sm:mt-1 sm:text-sm lg:text-base">
                9:00 AM · 5:30 PM <span className="hidden text-[10px] font-sans font-medium opacity-80 sm:inline sm:ml-2">| Confession starts 8 AM, 4:30 PM</span>
              </p>
            </div>
            <div className="min-w-0 py-2 sm:px-6 sm:py-3">
              <p className="truncate text-[8px] font-bold uppercase tracking-[0.1em] text-[#9b762f] sm:text-[10px] sm:tracking-[0.18em]">Saturday Vigil</p>
              <p className="mt-0.5 whitespace-nowrap font-serif text-[10px] font-bold sm:mt-1 sm:text-sm lg:text-base">
                4:30 PM <span className="hidden text-[10px] font-sans font-medium opacity-80 sm:inline sm:ml-2">| Confession starts 3 PM</span>
              </p>
            </div>
            <div className="min-w-0 py-2 sm:pl-6 sm:py-3">
              <p className="truncate text-[8px] font-bold uppercase tracking-[0.1em] text-[#9b762f] sm:text-[10px] sm:tracking-[0.18em]">Daily Mass</p>
              <p className="mt-0.5 whitespace-nowrap font-serif text-[10px] font-bold sm:mt-1 sm:text-sm lg:text-base">7:30 AM (Mon - Fri)</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <div className="relative">
              <div className="flex items-center gap-2">
                <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search parish site"
                  aria-label="Search parish site"
                  className="h-10 min-w-0 flex-1 border-b border-border bg-transparent px-1 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              {searchResultsList}
            </div>
            {[...primaryLinks, ...parishLifeLinks, ...externalLinks].map((link) => (
              link.href.startsWith('http') ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors font-medium py-2 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <a
                href="https://www.facebook.com/TheLittleFlowerRapidCity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium"
              >
                <img
                  src="/fb.webp"
                  alt="Facebook"
                  className="h-10 w-10 object-contain" // Slightly smaller than desktop but bigger than previous mobile
                />
                Facebook
              </a>
            </div>

            <a
              href="https://secure.myvanco.com/L-ZAYT/home"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="block"
            >
              <Button className="w-full bg-primary hover:bg-primary/90">
                Donate
              </Button>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
