import { useEffect, useState, useRef } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Menu as MenuIcon, X as XIcon } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About & Staff' },
    { href: '/bulletin', label: 'Bulletin' },
    { href: '/sacraments', label: 'Sacraments' },
    { href: '/resources', label: 'Resources' },
    { href: '/faith-formation', label: 'Faith Formation' },
    { href: '/get-involved', label: 'Get Involved' },
    { href: 'https://gods-call.com/', label: 'Vocations' },
  ];

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Logo - shrink-0 prevents it from being squished */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
          <img
            src="/Logo.webp"
            alt="Saint Thérèse Church logo"
            className="h-16 w-auto object-contain"
          />
          <span className="font-serif font-bold text-lg text-primary hidden xl:inline">
            Saint Thérèse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-end flex-1 gap-x-3 lg:gap-x-4 xl:gap-x-6">
          {navLinks.map((link) => (
            link.href.startsWith('http') ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                // CLAMP FUNCTION: Font size scales between 13px and 16px based on screen width
                className="text-foreground hover:text-primary transition-colors font-semibold whitespace-nowrap"
                style={{ fontSize: 'clamp(0.8125rem, 0.8vw + 0.5rem, 1rem)' }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                // CLAMP FUNCTION: Font size scales between 13px and 16px based on screen width
                className="text-foreground hover:text-primary transition-colors font-semibold whitespace-nowrap"
                style={{ fontSize: 'clamp(0.8125rem, 0.8vw + 0.5rem, 1rem)' }}
              >
                {link.label}
              </Link>
            )
          ))}

          {/* Facebook Link - REDUCED SIZE from h-20 to h-6 */}
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
              className="h-6 w-6 object-contain"
            />
          </a>

          {/* Donate Button */}
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
            {navLinks.map((link) => (
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
                  className="h-6 w-6 object-contain"
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
