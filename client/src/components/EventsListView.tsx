import { Button } from '@/components/ui/button';
import { CalendarEvent, EventCategory, EVENT_COLORS, ExtendedTimeFilter } from './events';
import { EventCard } from './event-components';
import { CalendarDays, Search } from 'lucide-react';
import { Link } from 'wouter';

interface EventsListViewProps {
  sortedUpcomingEvents: CalendarEvent[];
  timeFilter: ExtendedTimeFilter;
  setTimeFilter: (filter: ExtendedTimeFilter) => void;
  highlightedEventId: string | null;
  navigate: (url: string) => void;
  onReset: () => void;
  selectedTypes: Set<EventCategory>;
  setSelectedTypes: (types: Set<EventCategory>) => void;
  showCalendarLink?: boolean;
  eventSearchQuery: string;
  setEventSearchQuery: (query: string) => void;
}

export function EventsListView({
  sortedUpcomingEvents, timeFilter, setTimeFilter, highlightedEventId, navigate, onReset,
  selectedTypes, setSelectedTypes, showCalendarLink = false, eventSearchQuery, setEventSearchQuery
}: EventsListViewProps) {
  const toggleEventType = (type: EventCategory) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type); else next.add(type);
    setSelectedTypes(next);
  };

  return (
    <div className="w-full min-w-0 space-y-6 lg:pt-0 pt-8 lg:sticky lg:top-20">
      <div className="flex flex-wrap items-center gap-3 border-b-2 border-primary/10 pb-4">
        <h4 className="font-serif text-3xl font-bold tracking-tight text-primary">Upcoming Events</h4>
        <div className="relative min-w-[150px] flex-1 sm:max-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={eventSearchQuery}
            onChange={(event) => setEventSearchQuery(event.target.value)}
            placeholder="Search events"
            aria-label="Search upcoming events"
            className="h-9 w-full rounded-md border border-primary/15 bg-white pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="rounded-full font-bold text-xs uppercase tracking-widest border-2">Reset</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'thisWeek', 'thisMonth', 'nextMonth', 'twoPlus', 'calendarMonth'] as ExtendedTimeFilter[]).map(filter => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${timeFilter === filter ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {filter === 'all' ? 'All' : filter === 'thisWeek' ? 'This Week' : filter === 'thisMonth' ? 'This Month' : filter === 'nextMonth' ? 'Next Month' : filter === 'twoPlus' ? '2+ Months' : 'Calendar Month'}
          </button>
        ))}
      </div>

      <div className="lg:hidden border-y border-primary/10 py-4">
        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-primary/60">Filter by category</p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(EVENT_COLORS) as [EventCategory, typeof EVENT_COLORS[EventCategory]][]).map(([type, colors]) => (
            <button
              key={type}
              onClick={() => toggleEventType(type)}
              className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-[10px] font-bold transition-all ${selectedTypes.has(type) ? `${colors.bg} ${colors.border} ${colors.labelColor}` : 'border-gray-200 bg-white text-gray-400 opacity-60'}`}
            >
              <span className={`size-1.5 rounded-full ${colors.dot}`} />
              {colors.label}
            </button>
          ))}
        </div>
      </div>

      {showCalendarLink && (
        <Link href="/events?view=calendar" className="lg:hidden inline-flex items-center gap-2 text-sm font-bold text-primary underline decoration-primary/30 underline-offset-4 hover:text-accent">
          <CalendarDays className="size-4" />
          View full parish calendar
        </Link>
      )}

      <div id="events-scroll-container" className="flex flex-col items-start gap-4 lg:max-h-[calc(100vh-12rem)] overflow-y-auto pr-4 pb-8 custom-scrollbar">
        {sortedUpcomingEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-primary/10">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No events found</p>
          </div>
        ) : (
          sortedUpcomingEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              highlighted={highlightedEventId === event.id}
              navigate={navigate}
            />
          ))
        )}
      </div>
    </div>
  );
}
