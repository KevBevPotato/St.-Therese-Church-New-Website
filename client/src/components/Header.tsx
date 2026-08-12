import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About & Staff' },
    { href: '/bulletin', label: 'Bulletin' },
    { href: '/get-involved', label: 'Get Involved' },
    { href: '/faith-formation', label: 'Faith Formation' },
    { href: 'https://gods-call.com/', label: 'Vocations' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/Logo.webp"
            alt="Saint Therese Church logo"
            className="h-20 w-auto object-contain"
          />
          <span className="font-serif font-bold text-lg text-primary hidden sm:inline">
            Saint Therese
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            link.href.startsWith('http') ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors font-medium text-sm"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            )
          ))}

          {/* Facebook Link */}
          <a
            href="https://www.facebook.com/TheLittleFlowerRapidCity"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            aria-label="Facebook"
          >
            <img 
              src="/fb.webp" 
              alt="Facebook" 
              className="h-15 w-15 object-contain" 
            />
          </a>

          {/* Donate Button */}
          <a
            href="https://secure.myvanco.com/L-ZAYT/home"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Donate
            </Button>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
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
                  className="h-5 w-5 object-contain" 
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