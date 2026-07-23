// Sacred Minimalism: a deep navy closing chapter with Little Flower details and practical parish paths.
import { Link } from 'wouter';
import { Flower2, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary py-14 text-primary-foreground">
      <Flower2 className="absolute -bottom-20 -right-14 size-72 rotate-12 text-white/[0.035]" aria-hidden="true" />
      <div className="container relative">
        <div className="grid gap-10 border-b border-primary-foreground/18 pb-10 md:grid-cols-[1.2fr_0.7fr_1fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <span className="relative flex size-12 items-center justify-center border border-white/20 bg-white/8">
                <img src="/manus-storage/church_logo_d5d3b2ed.png" alt="" className="size-9 object-contain brightness-0 invert" />
                <Flower2 className="absolute -bottom-1.5 -right-1.5 size-4 rounded-full bg-primary p-0.5 text-[#e0c27c]" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-serif text-xl font-bold">Saint Therese Church</h3>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#e0c27c]">The Little Flower · Rapid City</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-primary-foreground/75">A parish family rooted in the Eucharist, growing through prayer, and serving our community in the little way of love.</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e0c27c]">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/" className="block transition-colors hover:text-[#f0d99e]">Home</Link></li>
              <li><Link href="/about" className="block transition-colors hover:text-[#f0d99e]">About & Staff</Link></li>
              <li><a href="/#mass-schedule" className="block transition-colors hover:text-[#f0d99e]">Mass Schedule</a></li>
              <li><Link href="/resources" className="block transition-colors hover:text-[#f0d99e]">Catholic Resources</Link></li>
              <li><a href="https://secure.myvanco.com/L-ZAYT/home" target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-[#f0d99e]">Donate</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e0c27c]">Visit & Contact</h4>
            <div className="mt-4 space-y-4 text-sm text-primary-foreground/82">
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-[#e0c27c]" aria-hidden="true" /><span>532 Adams St.<br />Rapid City, SD 57701</span></div>
              <div className="flex items-center gap-3"><Phone className="size-4 shrink-0 text-[#e0c27c]" aria-hidden="true" /><a href="tel:+16053421556" className="transition-colors hover:text-white">(605) 342-1556</a></div>
              <div className="flex items-center gap-3"><Mail className="size-4 shrink-0 text-[#e0c27c]" aria-hidden="true" /><a href="mailto:sttherese@diorc.org" className="transition-colors hover:text-white">sttherese@diorc.org</a></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-7 text-xs text-primary-foreground/58 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Saint Therese Church. All rights reserved.</p>
          <p>Built to help our parish pray, belong, and serve.</p>
        </div>
      </div>
    </footer>
  );
}
