import { useEffect, useState, useRef } from 'react';
import { Link } from 'wouter';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
    >
      {/* Increased py-3 to py-4 to restore height */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-6">
        
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
        <nav className="hidden md:flex items-center justify-end flex-1 gap-4 lg:gap-6 xl:gap-8">
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
              <div className="absolute left-0 top-full w-48 bg-white border border-border shadow-lg rounded-b-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
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

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
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
