import { useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'wouter';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { staticEvents, generateRecurringEventsForMonth } from './events';
import { organizations } from '@/data/organizations';
import { baseStaffMembers } from '@/data/staff';
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
  { title: 'Get Involved', type: 'Page', href: '/get-involved', searchableText: 'get involved ministries volunteer organizations' },
  { title: 'Parish Calendar', type: 'Page', href: '/events', searchableText: 'parish calendar events schedule' },
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

  const parishLifeLinks = [
    { href: '/sacraments', label: 'Sacraments' },
    { href: '/resources', label: 'Resources' },
    { href: '/faith-formation', label: 'Faith Formation' },
    { href: '/get-involved', label: 'Get Involved' },
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
      ...organizations.map((organization) => ({
        title: organization.name,
        type: 'Organization',
        href: `/get-involved/${organization.id}`,
        searchableText: `${organization.name} ${organization.tagline} ${organization.description}`,
      })),
      ...baseStaffMembers.map((member) => ({
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
      .filter((result) => result.searchableText.toLowerCase().includes(query))
      .filter((result, index, allResults) => allResults.findIndex((item) => item.title === result.title && item.href === result.href) === index)
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
        </Link>
      ))}
    </div>
  ) : searchQuery.trim().length >= 2 ? (
    <div className="absolute right-0 top-full z-[60] mt-2 w-80 rounded-md border border-border bg-white px-4 py-5 text-sm text-muted-foreground shadow-xl">
      No matching pages or events found.
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
            Saint Thérèse
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
              <div className="absolute left-0 top-full z-[60] w-48 rounded-b-lg border border-border bg-white py-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                {parishLifeLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
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
