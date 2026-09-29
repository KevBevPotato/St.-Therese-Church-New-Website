import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { EventCategory, EVENT_COLORS, CalendarEvent } from './eventfolders/events';
import { CalendarCellEvent } from './event-components';

interface CalendarViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedTypes: Set<EventCategory>;
  setSelectedTypes: (types: Set<EventCategory>) => void;
  monthDays: Date[];
  emptyDaysBefore: number[];
  getEventsForDay: (date: Date) => CalendarEvent[];
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date) => void;
  onDayLeave: () => void;
  onEventClick: (e: React.MouseEvent, event: CalendarEvent) => void;
  today: Date;
  selectedDate?: Date | null;
}

export function CalendarView({
  currentDate, setCurrentDate, selectedTypes, setSelectedTypes,
  monthDays, emptyDaysBefore, getEventsForDay, onDayClick, onDayHover, onDayLeave, onEventClick, today, selectedDate
}: CalendarViewProps) {
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [popupDate, setPopupDate] = useState<Date | null>(null);

  const toggleEventType = (type: EventCategory) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type); else next.add(type);
    setSelectedTypes(next);
  };

  return (
    <div className="w-full flex-shrink-0 flex flex-col relative">
      <div className="bg-white rounded-t-2xl border-x-2 border-t-2 border-primary/30 shadow-sm overflow-hidden">
        <div className="bg-primary p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
              <ChevronLeft className="size-6" />
            </Button>
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide min-w-[160px] text-center">{monthName}</h3>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
              <ChevronRight className="size-6" />
            </Button>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-gray-50/50 border-b-2 border-primary/20">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 mr-1 sm:mr-2 shrink-0">
              <Filter className="size-3.5 text-primary/60" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Filter</span>
            </div>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {(Object.entries(EVENT_COLORS) as [EventCategory, any][]).map(([type, colors]) => (
                <button
                  key={type}
                  onClick={() => toggleEventType(type)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-[10px] font-bold transition-all border-2 ${selectedTypes.has(type) ? `${colors.bg} ${colors.border} ${colors.labelColor} shadow-sm` : 'bg-white border-gray-200 text-gray-400 opacity-60'}`}
                >
                  <span className={`size-1.5 rounded-full ${colors.dot}`} />
                  {colors.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 ml-auto shrink-0">
              <button onClick={() => setSelectedTypes(new Set(Object.keys(EVENT_COLORS) as EventCategory[]))} className="text-[9px] font-black text-primary hover:underline uppercase">All</button>
              <button onClick={() => setSelectedTypes(new Set())} className="text-[9px] font-black text-muted-foreground hover:underline uppercase">None</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-white shadow-xl rounded-b-2xl overflow-hidden border-l-2 border-t-2 border-primary/30">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="relative p-3 text-center text-[10px] font-black uppercase tracking-widest text-primary/60 bg-gray-100 border-r-2 border-b-2 border-primary/30">{day}</div>
        ))}
        {emptyDaysBefore.map(i => (<div key={`empty-${i}`} className="aspect-square border-r-2 border-b-2 border-primary/30 bg-gray-50/10" />))}
        {monthDays.map(date => {
          const events = getEventsForDay(date);
          const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
          const isSelected = selectedDate && date.getFullYear() === selectedDate.getFullYear() && date.getMonth() === selectedDate.getMonth() && date.getDate() === selectedDate.getDate();
          const isHovered = hoveredDate && date.getFullYear() === hoveredDate.getFullYear() && date.getMonth() === hoveredDate.getMonth() && date.getDate() === hoveredDate.getDate();
          const isPast = date < today && !isToday;
          const fontSize = events.length <= 2 ? 'text-[9px]' : events.length <= 4 ? 'text-[8px]' : 'text-[7px]';

          return (
            <div
              key={date.toISOString()}
              onClick={() => onDayClick(date)}
              onMouseEnter={() => {
                setHoveredDate(date);
                onDayHover(date);
              }}
              onMouseLeave={() => {
                setHoveredDate(null);
                onDayLeave();
              }}
              className={`relative aspect-square border-r-2 border-b-2 p-1.5 transition-colors border-primary/30 ${isSelected ? 'bg-accent/10 border-accent' : isToday ? 'bg-primary/5' : 'bg-white hover:bg-gray-50/50'} cursor-pointer flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden`}
            >
              <div className="mb-1 flex items-start justify-between gap-1">
                <div className={`text-xs font-black flex-shrink-0 ${isToday ? 'text-primary' : 'text-gray-400'}`}>{date.getDate()}</div>
                {isHovered && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setPopupDate(date);
                    }}
                    className="inline-flex items-center justify-center text-[10px] font-black uppercase tracking-[0.14em] text-primary/60 hover:text-accent"
                    title="Open day details"
                    aria-label={`Open day details for ${date.toDateString()}`}
                  >
                    ↗
                  </button>
                )}
              </div>
              <div className="flex flex-col space-y-0.5 pointer-events-auto">
                {events.map(event => (
                  <CalendarCellEvent key={event.id} event={event} isPast={isPast} fontSize={fontSize} onEventClick={onEventClick} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {popupDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#fbfaf6]/80 p-4 backdrop-blur-sm"
          onClick={() => setPopupDate(null)}
        >
          <div
            className="w-full max-w-2xl rounded-[2rem] border-2 border-primary/20 bg-white p-5 shadow-2xl ring-1 ring-black/5 max-h-[85vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/40">Day details</p>
                <h3 className="font-serif text-3xl font-bold text-primary">
                  {popupDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDayClick(popupDate)}
                  className="text-[10px] font-black uppercase tracking-[0.16em] text-accent hover:text-accent/80"
                >
                  Select day
                </button>
                <button
                  type="button"
                  onClick={() => setPopupDate(null)}
                  className="text-[10px] font-black uppercase tracking-[0.18em] text-primary hover:text-accent"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {getEventsForDay(popupDate).length > 0 ? (
                getEventsForDay(popupDate).map((event) => {
                  const eventHref = event.linkedOpportunityId ? `/get-involved/${event.linkedOpportunityId}` : `/events/${event.id}`;

                  return (
                    <Link
                      key={event.id}
                      href={eventHref}
                      className="block rounded-[1.5rem] border border-primary/10 bg-primary/5 p-4 transition-all hover:border-accent hover:bg-accent/5 hover:shadow-md"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {event.categories.map((category) => (
                          <span
                            key={`${event.id}-${category}`}
                            className="rounded-full border border-primary/20 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary/70"
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      <h4 className="font-serif text-2xl font-bold text-primary">{event.title}</h4>

                      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <p><strong className="text-primary">Time:</strong> {event.time}</p>
                        <p><strong className="text-primary">Location:</strong> {event.location}</p>
                        <p className="whitespace-pre-line"><strong className="text-primary">About:</strong> {event.description || event.about || 'No additional information available.'}</p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-primary/20 bg-gray-50/60 p-6 text-center">
                  <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
