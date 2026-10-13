import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import importedResourceData from '../data/resources_data.json';
import { visibleContent } from '../data/visible-content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    Calendar,
    Church,
    ExternalLink,
    FileText,
    GraduationCap,
    Heart,
    HelpCircle,
    Mail,
    Phone,
    Shield,
    Users,
} from 'lucide-react';

interface ImageSettings {
    scale?: 'scale-100' | 'scale-110' | 'scale-125' | 'scale-150';
    opacity?: 'opacity-10' | 'opacity-20' | 'opacity-30' | 'opacity-40' | 'opacity-60';
    blur?: 'backdrop-blur-none' | 'backdrop-blur-[2px]' | 'backdrop-blur-sm' | 'backdrop-blur-md' | 'backdrop-blur-lg';
    position?: 'object-center' | 'object-top' | 'object-bottom' | 'object-left' | 'object-right';
}

interface LogoSettings {
    scale?: 'size-8' | 'size-10' | 'size-12' | 'size-14' | 'size-16';
    rounded?: 'rounded-none' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
    border?: 'border-none' | 'border-primary/10' | 'border-white' | 'border-accent';
    opacity?: 'opacity-50' | 'opacity-80' | 'opacity-100';
}

interface ResourceLink {
    id: string;
    title: string;
    description: string;
    href?: string;
    external: boolean;
    icon: string;
    image?: string;
    iconImage?: string;
    imageSettings?: ImageSettings;
    logoSettings?: LogoSettings;
}

interface ResourceCategory {
    id: string;
    title: string;
    description: string;
    links: ResourceLink[];
}

const resourceIcons = { BookOpen, Calendar, Church, FileText, GraduationCap, Heart, HelpCircle, Phone, Shield, Users } as const;
const resourceData = visibleContent(importedResourceData);
const allCategories = resourceData.categories as ResourceCategory[];
const resourceSettings = resourceData.settings;

export default function Resources() {
    const [activeCategory, setActiveCategory] = useState(allCategories[0]?.id ?? '');

    useEffect(() => {
        const sections = allCategories
            .map((category) => document.getElementById(`resource-section-${category.id}`))
            .filter((section): section is HTMLElement => Boolean(section));

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visibleSections[0]) {
                    setActiveCategory(visibleSections[0].target.id.replace('resource-section-', ''));
                }
            },
            { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="pt-[var(--header-height)]" />

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
                <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
                <div className="container relative grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-end mx-auto px-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                            <BookOpen className="size-4" aria-hidden="true" />                             {resourceSettings.eyebrow}
                        </p>
                        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                            {resourceSettings.title}
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            {resourceSettings.introduction}
                        </p>
                    </div>
                    <aside className="border-l-2 border-[#b8954f] pl-6 md:mb-1">
                        <p className="font-serif text-2xl italic leading-snug text-primary">
                            {resourceSettings.quote}
                        </p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f]">
                            {resourceSettings.quoteAttribution}
                        </p>
                    </aside>
                </div>
            </section>

            {/* Resources by Category */}
            <main className="flex-grow bg-secondary/20 py-16 md:py-20">
                <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
                    <aside className="hidden lg:block">
                        <nav className="sticky top-[calc(var(--header-height)+2rem)] max-h-[calc(100vh-var(--header-height)-4rem)] overflow-y-auto pr-2" aria-label="Resources outline">
                            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-primary/50">On this page</p>
                            <div className="space-y-1 border-l border-primary/10">
                                {allCategories.map((category) => {
                                    const isActive = activeCategory === category.id;
                                    return (
                                        <a
                                            key={category.id}
                                            href={`#resource-section-${category.id}`}
                                            className={`block border-l-2 py-2 pl-4 text-sm font-semibold transition-all ${isActive ? 'border-accent text-primary' : 'border-transparent text-primary/40 hover:border-primary/30 hover:text-primary/75'}`}
                                        >
                                            {category.title}
                                        </a>
                                    );
                                })}
                            </div>
                        </nav>
                    </aside>

                    <div className="space-y-16">
                        {allCategories.map((category) => (
                            <section key={category.id} id={`resource-section-${category.id}`} className="scroll-mt-[calc(var(--header-height)+2rem)]">
                                <div className="mb-8">
                                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
                                        {category.title}
                                    </h2>
                                    <p className="text-muted-foreground text-lg">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {category.links.map((link) => {
                                        const cardClassName = `group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-primary/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg`;

                                        // --- Dynamic Styles Logic ---
                                        // Background Image Defaults
                                        const bgScale = link.imageSettings?.scale ?? 'scale-100';
                                        const bgOpacity = link.imageSettings?.opacity ?? 'opacity-40';
                                        const bgBlur = link.imageSettings?.blur ?? 'backdrop-blur-[2px]';
                                        const bgPosition = link.imageSettings?.position ?? 'object-center';

                                        // Logo Defaults
                                        const logoScale = link.logoSettings?.scale ?? 'size-12';
                                        const logoRounded = link.logoSettings?.rounded ?? 'rounded-xl';
                                        const logoBorder = link.logoSettings?.border ?? 'border-primary/10';
                                        const logoOpacity = link.logoSettings?.opacity ?? 'opacity-100';
                                        const Icon = resourceIcons[link.icon as keyof typeof resourceIcons] ?? BookOpen;

                                        const content = (
                                            <>
                                                {link.image && (
                                                    <img
                                                        src={link.image}
                                                        alt=""
                                                        aria-hidden="true"
                                                        className={`absolute inset-0 size-full object-cover transition-opacity group-hover:opacity-70 ${bgScale} ${bgOpacity} ${bgPosition}`}
                                                    />
                                                )}
                                                <div className={`absolute inset-0 bg-white/80 ${bgBlur}`} aria-hidden="true" />
                                                <div className="relative z-10 flex h-full flex-col">
                                                    <div className="flex justify-between items-start">
                                                        <div className={`mb-4 flex items-center justify-center transition-colors ${link.iconImage ? 'bg-transparent' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'} ${logoScale}`}>
                                                            {link.iconImage ? (
                                                                <img
                                                                    src={link.iconImage}
                                                                    alt=""
                                                                    className={`size-full object-cover shadow-sm border ${logoRounded} ${logoBorder} ${logoOpacity}`}
                                                                />
                                                            ) : (
                                                                <Icon size={20} />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <h3 className="mb-2 font-serif text-xl font-bold text-primary transition-colors group-hover:text-accent">
                                                        {link.title}
                                                        {link.external && (
                                                            <ExternalLink
                                                                size={12}
                                                                className="ml-1.5 inline-block -mt-0.5 text-primary/50 group-hover:text-accent"
                                                            />
                                                        )}
                                                    </h3>
                                                    <p className="flex-grow text-sm leading-relaxed text-muted-foreground">
                                                        {link.description}
                                                    </p>
                                                </div>
                                            </>
                                        );

                                        if (link.external) {
                                            return (
                                                <a
                                                    key={link.id}
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={cardClassName}
                                                >
                                                    {content}
                                                </a>
                                            );
                                        }

                                        if (link.href) {
                                            return (
                                                <Link key={link.id} href={link.href}>
                                                    <a className={cardClassName}>{content}</a>
                                                </Link>
                                            );
                                        }

                                        return <div key={link.id} className={cardClassName}>{content}</div>;
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>

            {/* Help Box */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Card className="p-8 md:p-10 border-2 border-primary/10 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0">
                                <HelpCircle size={28} />
                            </div>
                            <div>
                                <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                                    Looking for something specific?
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    If you can't find what you need here, our parish office is happy to point you in the right direction. We're here to help.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="tel:6053421556"
                                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-md"
                                    >
                                        <Phone size={12} /> (605) 342-1556
                                    </a>
                                    <a
                                        href="mailto:connie.heeren@strcstaff.org"
                                        className="inline-flex items-center gap-2 bg-white border border-primary/20 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        <Mail size={12} /> Email Office
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <Footer />
        </div>
    );
}
