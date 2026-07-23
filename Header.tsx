// Sacred Minimalism: a calm ivory navigation bar, deep navy hierarchy, and compact purposeful controls.
import { useState } from 'react';
import { Link } from 'wouter';
import { Flower2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteSearch from '@/components/SiteSearch';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About & Staff' },
  { href: '/#mass-schedule', label: 'Mass Schedule' },
  { href: '/resources', label: 'Resources' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-primary/10 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-85" aria-label="Saint Therese Church home">
          <span className="relative flex size-11 items-center justify-center border border-primary/15 bg-[#fbfaf6]">
            <img
              src="/manus-storage/church_logo_d5d3b2ed.png"
              alt=""
              className="size-9 object-contain"
            />
            <Flower2 className="absolute -bottom-1.5 -right-1.5 size-4 rounded-full bg-white p-0.5 text-[#9b762f]" aria-hidden="true" />
          </span>
          <span className="hidden sm:block">
            <span className="flex items-center gap-2 font-serif text-lg font-bold leading-none text-primary">
              Saint Therese
              <span className="h-px w-5 bg-[#b8954f] transition-all group-hover:w-7" aria-hidden="true" />
            </span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Little Flower · Rapid City</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <SiteSearch />
          <a
            href="https://secure.myvanco.com/L-ZAYT/home"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="bg-primary shadow-sm hover:bg-primary/90">
              Donate
            </Button>
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="rounded-lg p-2 text-primary transition-colors hover:bg-secondary lg:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-primary/10 bg-white lg:hidden" aria-label="Mobile navigation">
          <div className="container flex flex-col gap-2 py-4">
            <SiteSearch mobile className="mb-2" />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-2 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://secure.myvanco.com/L-ZAYT/home"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 block"
            >
              <Button className="w-full bg-primary hover:bg-primary/90">Donate</Button>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
