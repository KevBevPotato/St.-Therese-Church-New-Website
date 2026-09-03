import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found Page - Sacred Minimalism Design
 * Three-column layout: Text (Left), Image (Center), Buttons (Right)
 */

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfaf6] px-6 py-12 overflow-hidden">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">

        {/* Left Column: Text & Quote */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 order-2 lg:order-1">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary tracking-tight">
            Lost?
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
            It seems the page you are looking for has moved or no longer exists. Let us help you find your way back.
          </p>
          <div className="pt-6 border-t border-primary/10 mt-2">
            <p className="font-serif italic text-primary/50 text-[11px] max-w-[250px] leading-relaxed">
              "I will seek that which was lost, and bring again that which was driven away." <br />— Ezekiel 34:16
            </p>
          </div>
        </div>

        {/* Center Column: The Image */}
        <div className="flex-shrink-0 w-full max-w-2xl lg:max-w-xl xl:max-w-1.75xl relative order-1 lg:order-2">
          <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] -rotate-1 scale-105" />
          <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl shadow-primary/10 bg-white">
            <img
              src="/404pagenotfound.jpg"
              alt="404 Page Not Found - Saint Thérèse Church"
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Decorative Gold Element */}
          <div className="absolute -bottom-8 -right-8 size-32 border-b-2 border-r-2 border-accent rounded-br-[3rem] opacity-30" />
        </div>

        {/* Right Column: Navigation Buttons */}
        <div className="flex-1 flex flex-col sm:flex-row lg:flex-col items-center lg:items-start justify-center gap-4 w-full sm:w-auto order-3">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto lg:w-48 bg-primary hover:bg-primary/90 px-6 gap-2 font-bold uppercase tracking-widest text-[10px] h-12 shadow-lg shadow-primary/10">
              <Home size={14} /> Return Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto lg:w-48 border-2 border-primary/10 text-primary hover:bg-primary/5 px-6 gap-2 font-bold uppercase tracking-widest text-[10px] h-12 bg-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={14} /> Go Back
          </Button>
        </div>

      </div>
    </div>
  );
}