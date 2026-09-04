import { Button } from '@/components/ui/button';
import { CalendarEvent, ExtendedTimeFilter } from './events';
import { EventCard } from './event-components';

interface EventsListViewProps {
  sortedUpcomingEvents: CalendarEvent[];
  timeFilter: ExtendedTimeFilter;
  setTimeFilter: (filter: ExtendedTimeFilter) => void;
  highlightedEventId: string | null;
  navigate: (url: string) => void;
  onReset: () => void;
}

export function EventsListView({
  sortedUpcomingEvents, timeFilter, setTimeFilter, highlightedEventId, navigate, onReset
}: EventsListViewProps) {
  return (
    <div className="w-full min-w-0 space-y-6 lg:pt-0 pt-8 lg:sticky lg:top-20">
      <div className="flex items-center justify-between pb-4 border-b-2 border-primary/10">
        <h4 className="font-serif text-3xl font-bold text-primary tracking-tight">Upcoming Events</h4>
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
