import { ChevronRight, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CalendarEvent, EventCategory, EVENT_COLORS } from './events';

// ---- 1. CATEGORY PILL ----
export function EventCategoryPill({ category }: { category: EventCategory }) {
  const colors = EVENT_COLORS[category] || EVENT_COLORS['parishEvents'];
  return (
    <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.labelColor} border border-black/5`}>
      {colors.label}
    </span>
  );
}

// ---- 2. CALENDAR CELL EVENT (Rigid, Truncated, Fixed Height) ----
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
      className={`h-fit block w-full rounded px-1 py-0.5 text-left truncate ${colors.bg} border-l-2 ${colors.border} ${colors.labelColor} hover:brightness-95 transition-all font-bold ${isPast ? 'opacity-30' : 'opacity-100'} leading-none ${fontSize}`}
      title={`${event.time}: ${event.title}`}
    >
      {event.title}
    </button>
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
    <Card
      id={`event-card-${event.id}`}
      className={`group flex flex-row items-stretch overflow-hidden cursor-pointer transition-all hover:shadow-lg bg-white min-h-[140px] h-auto ${highlighted ? 'border-accent ring-2 ring-accent/20 scale-[1.02]' : 'border-none ring-1 ring-black/5'}`}
      onClick={() => navigate(event.linkedOpportunityId ? `/get-involved/${event.linkedOpportunityId}` : `/events/${event.id}`)}
    >
      <div className="w-16 sm:w-20 flex flex-col items-center justify-center border-r border-gray-100 bg-white shrink-0 px-2 py-3">
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

      <div className="flex-1 px-3 sm:px-6 py-4 flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-5">
          {event.categories.map((cat: EventCategory) => (
            <EventCategoryPill key={cat} category={cat} />
          ))}
        </div>
        <h5 className="font-serif font-bold text-lg text-primary group-hover:text-accent transition-colors text-left mb-2 break-words leading-snug">
          {event.title}
        </h5>
        <div className="flex gap-4 text-[10px] mt-auto">
          <div className="flex items-center gap-1.5 font-bold text-gray-500 uppercase tracking-tight flex-1 min-w-0">
            <Clock className="size-3 text-primary/40 flex-shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-gray-400 uppercase tracking-tight flex-1 min-w-0">
            <MapPin className="size-3 text-primary/30 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
      <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center">
        <ChevronRight className="size-5 text-primary/40" />
      </div>
    </Card>
  );
}
