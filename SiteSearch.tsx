// Sacred Minimalism: quiet navy structure, warm ivory surfaces, precise type, and restrained motion.
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import {
  BookOpen,
  CalendarDays,
  Church,
  Compass,
  MapPin,
  Search,
  Users,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

type SearchItem = {
  title: string;
  description: string;
  href: string;
  category: 'Visit' | 'Parish Life' | 'Learn & Grow';
  keywords: string;
  icon: typeof Church;
};

const searchItems: SearchItem[] = [
  {
    title: 'Home',
    description: 'Welcome, parish highlights, and ways to connect.',
    href: '/',
    category: 'Visit',
    keywords: 'saint therese church rapid city welcome homepage',
    icon: Church,
  },
  {
    title: 'Mass Schedule',
    description: 'Weekend, weekday, reconciliation, and adoration times.',
    href: '/#mass-schedule',
    category: 'Visit',
    keywords: 'mass times confession reconciliation adoration worship liturgy',
    icon: CalendarDays,
  },
  {
    title: 'Upcoming Events',
    description: 'See what is happening in parish life.',
    href: '/#upcoming-events',
    category: 'Parish Life',
    keywords: 'calendar activities gatherings parish events upcoming',
    icon: CalendarDays,
  },
  {
    title: 'About & Staff',
    description: 'Meet our clergy, deacons, staff, and ministry leaders.',
    href: '/about',
    category: 'Parish Life',
    keywords: 'personnel directory priest pastor deacon parish council staff contact',
    icon: Users,
  },
  {
    title: 'Contact & Directions',
    description: 'Office information, church address, and map directions.',
    href: '/#contact',
    category: 'Visit',
    keywords: 'address phone email office hours google maps apple maps directions location',
    icon: MapPin,
  },
  {
    title: 'Catholic Resources',
    description: 'Scripture, prayer, formation, podcasts, and trusted links.',
    href: '/resources',
    category: 'Learn & Grow',
    keywords: 'resources bible study prayer podcasts catechism catholic links formation',
    icon: BookOpen,
  },
  {
    title: 'Scripture & Bible Study',
    description: 'Daily readings and free Catholic Scripture study.',
    href: '/resources#scripture-study',
    category: 'Learn & Grow',
    keywords: 'usccb daily readings bible agape scripture study',
    icon: BookOpen,
  },
  {
    title: 'Podcasts & Audio',
    description: 'Catholic podcasts for Scripture, prayer, and formation.',
    href: '/resources#podcasts-audio',
    category: 'Learn & Grow',
    keywords: 'bible in a year catechism rosary ascension word on fire audio',
    icon: Compass,
  },
];

function navigateTo(href: string, setLocation: (to: string) => void) {
  if (href.includes('#')) {
    window.location.assign(href);
    return;
  }
  setLocation(href);
}

export default function SiteSearch({
  mobile = false,
  className,
}: {
  mobile?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const selectItem = (href: string) => {
    setOpen(false);
    navigateTo(href, setLocation);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'group flex items-center border border-primary/20 bg-white text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/45 hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35',
          mobile
            ? 'w-full justify-between rounded-md px-3 py-2.5 text-sm'
            : 'w-44 justify-start gap-2 rounded-full px-3.5 py-2 text-sm xl:w-52',
          className,
        )}
        aria-label="Search the Saint Therese website"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Search the site</span>
        </span>
        {!mobile && (
          <span className="ml-auto hidden rounded border border-border bg-secondary/70 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-muted-foreground xl:inline">
            Ctrl K
          </span>
        )}
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Saint Therese Church"
        description="Search pages, parish information, and Catholic resources."
        className="max-w-xl border-primary/15 bg-white shadow-2xl"
      >
        <CommandInput placeholder="Search Mass times, staff, resources…" autoFocus />
        <CommandList className="max-h-[420px] p-2">
          <CommandEmpty>No matching parish information found.</CommandEmpty>
          {(['Visit', 'Parish Life', 'Learn & Grow'] as const).map((category) => (
            <CommandGroup key={category} heading={category}>
              {searchItems
                .filter((item) => item.category === category)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={`${item.title}-${item.href}`}
                      value={`${item.title} ${item.description} ${item.keywords}`}
                      onSelect={() => selectItem(item.href)}
                      className="items-start gap-3 rounded-lg px-3 py-3"
                    >
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-foreground">{item.title}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                      <CommandShortcut>Open</CommandShortcut>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
