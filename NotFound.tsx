// Sacred Minimalism: reverent wit, illustrated storytelling, and calm paths back into parish life.
import { ArrowRight, BookOpen, Home, Users } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SiteSearch from '@/components/SiteSearch';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f3e9] text-foreground">
      <Header />
      <main className="relative overflow-hidden pt-[69px]">
        <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_1px_1px,rgba(29,58,92,0.12)_1px,transparent_0)] [background-size:24px_24px]" aria-hidden="true" />
        <section className="container relative grid min-h-[calc(100vh-69px)] gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-5 -rotate-2 bg-[#b8954f]/10" aria-hidden="true" />
            <figure className="relative overflow-hidden border border-primary/15 bg-white p-2 shadow-[0_24px_70px_rgba(26,55,89,0.16)]">
              <img
                src="/manus-storage/saints-searching-404_5a0ccb18.png"
                alt="Saint Therese of Lisieux searching among books while Saint Anthony of Padua offers a sympathetic shrug"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="grid gap-2 border-t border-primary/10 bg-white px-4 py-4 text-sm sm:grid-cols-2">
                <p className="font-serif italic text-primary">St. Thérèse: “I’ve looked among the roses…”</p>
                <p className="font-serif italic text-primary sm:text-right">St. Anthony: “Not even I could find this page.”</p>
              </figcaption>
            </figure>
          </div>

          <div className="order-1 lg:order-2 lg:pl-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b762f]">Error 404 · Page not found</p>
            <h1 className="mt-4 max-w-xl font-serif text-5xl font-bold leading-[0.98] text-primary sm:text-6xl lg:text-7xl">
              This page has wandered off.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              The address may have changed, or the page may no longer be here. Try searching the site or choose a familiar path below.
            </p>

            <div className="mt-7 max-w-md">
              <SiteSearch mobile className="border-primary/25 bg-white py-3 shadow-md" />
            </div>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              <Link
                href="/"
                className="group flex items-center justify-between border border-primary/15 bg-white px-4 py-3.5 font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
              >
                <span className="flex items-center gap-2"><Home className="size-4" aria-hidden="true" /> Home</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className="group flex items-center justify-between border border-primary/15 bg-white px-4 py-3.5 font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
              >
                <span className="flex items-center gap-2"><Users className="size-4" aria-hidden="true" /> Staff</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/resources"
                className="group flex items-center justify-between border border-primary/15 bg-white px-4 py-3.5 font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
              >
                <span className="flex items-center gap-2"><BookOpen className="size-4" aria-hidden="true" /> Resources</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
