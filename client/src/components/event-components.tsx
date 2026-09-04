import { ChevronRight, Clock, MapPin } from 'lucide-react';
import { CalendarEvent, EventCategory, EVENT_COLORS } from './events';

// ---- 1. CATEGORY PILL ----
export function EventCategoryPill({ category }: { category: EventCategory }) {
  const colors = EVENT_COLORS[category] || EVENT_COLORS['parishEvents'];
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.labelColor} border border-black/5`}>
      {colors.label}
    </span>
  );
}

// ---- 2. CALENDAR CELL EVENT (Scrollable, Natural Height) ----
export function CalendarCellEvent({ 
  event, 
  isPast, 
  fontSize, 
  onEventClick 
}: { 
  event: CalendarEvent; 
  isPast: boolean; 
  fontSize: string; 
  onEventClick: (e: React.MouseEvent, event: CalendarEvent) => void; 
}) {
  const colors = EVENT_COLORS[event.categories[0] as EventCategory] || EVENT_COLORS['parishEvents'];
  return (
    <button
      onClick={(e) => onEventClick(e, event)}
      /* REMOVED 'flex-1' and ADDED 'h-fit' so it doesn't stretch to fill the day */
      className={`h-fit block w-full rounded px-1 py-0.5 text-left whitespace-normal break-words ${colors.bg} border-l-2 ${colors.border} ${colors.labelColor} hover:brightness-95 transition-all font-bold ${isPast ? 'opacity-30' : 'opacity-100'} leading-tight ${fontSize}`}
      title={`${event.time}: ${event.title}`}
    >
      {event.title}
    </button>
  );
}

function EventCategoryPills({ categories }: { categories: EventCategory[] }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => (
          <EventCategoryPill key={cat} category={cat} />
        ))}
      </div>
    </div>
  );
}

function EventCardMeta({ event }: { event: CalendarEvent }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-[10px] sm:grid-cols-2">
      <div className="flex min-w-0 items-start gap-1.5 font-bold uppercase tracking-tight text-gray-500">
        <Clock className="mt-0.5 size-3 shrink-0 text-primary/40" />
        <span className="break-words leading-snug">{event.time}</span>
      </div>
      <div className="flex min-w-0 items-start gap-1.5 font-bold uppercase tracking-tight text-gray-400">
        <MapPin className="mt-0.5 size-3 shrink-0 text-primary/30" />
        <span className="break-words leading-snug">{event.location}</span>
      </div>
    </div>
  );
}

// ---- 3. EVENT LIST CARD (Flexible, Wrapping) ----
export function EventCard({ 
  event, 
  highlighted, 
  navigate 
}: { 
  event: CalendarEvent; 
  highlighted: boolean; 
  navigate: (url: string) => void 
}) {
  return (
    <div
      id={`event-card-${event.id}`}
      className={`group relative self-start flex-none h-fit w-full flex flex-row items-stretch gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 shadow-sm cursor-pointer transition-all hover:shadow-lg ${highlighted ? 'border-accent ring-2 ring-accent/20 scale-[1.02]' : 'ring-1 ring-black/5'}`}
      onClick={() => navigate(event.linkedOpportunityId ? `/get-involved/${event.linkedOpportunityId}` : `/events/${event.id}`)}
    >
      <div className="w-16 sm:w-20 shrink-0 rounded-l-2xl border-r border-gray-100 bg-white px-2 py-3 flex flex-col items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-tighter text-primary/40">
          {event.date.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-2xl font-serif font-bold text-primary leading-none mt-1">
          {event.date.getDate()}
        </span>
        <span className="text-[10px] font-black uppercase tracking-tighter text-primary/50 mt-1">
          {event.date.toLocaleDateString('en-US', { weekday: 'short' })}
        </span>
      </div>

      <div className="self-center h-fit min-w-0 flex flex-1 flex-col justify-center gap-y-3 px-3 py-4 sm:px-6">
        <EventCategoryPills categories={event.categories as EventCategory[]} />

        <h5 className="font-serif font-bold text-lg text-primary group-hover:text-accent transition-colors text-left break-words leading-snug">
          {event.title}
        </h5>

        <EventCardMeta event={event} />
      </div>

      <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 md:flex">
        <ChevronRight className="size-5 text-primary/40" />
      </div>
    </div>
  );
}
