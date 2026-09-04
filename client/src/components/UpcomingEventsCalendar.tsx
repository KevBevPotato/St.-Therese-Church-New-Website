import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, ExternalLink, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation, Link } from 'wouter';

import {
  CalendarEvent, EventCategory, TimeFilter, EVENT_COLORS,
  generateRecurringEventsForMonth, staticEvents,
} from './events';

import { EventCategoryPill } from './event-components';
import { CalendarView } from './CalendarView';
import { EventsListView } from './EventsListView';

type ExtendedTimeFilter = TimeFilter | 'thisWeek' | 'calendarMonth' | 'specificDay';

export default function UpcomingEventsCalendar() {
  const [location, navigate] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState<Set<EventCategory>>(new Set(Object.keys(EVENT_COLORS) as EventCategory[]));
  const [expandedDay, setExpandedDay] = useState<Date | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<ExtendedTimeFilter>('all');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const eventDetailId = location.startsWith('/events/') ? location.split('/events/')[1] : null;

  // 1. Data generation
  const allEvents = useMemo(() => {
    const events = [...staticEvents];
    const startMonth = currentDate.getMonth();
    const startYear = currentDate.getFullYear();
    for (let i = -1; i <= 12; i++) {
      const d = new Date(startYear, startMonth + i, 1);
      events.push(...generateRecurringEventsForMonth(d.getMonth(), d.getFullYear()));
    }
    return events;
  }, [currentDate]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => event.categories.some((cat) => selectedTypes.has(cat)));
  }, [allEvents, selectedTypes]);

  // 2. Time Filtering Logic
  const getTimeFilteredEvents = (eventsToFilter: CalendarEvent[]) => {
    if (timeFilter === 'all' || timeFilter === 'specificDay') return eventsToFilter;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const currentMonth = now.getMonth(); const currentYear = now.getFullYear();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    return eventsToFilter.filter((event) => {
      const eventDate = new Date(event.date); eventDate.setHours(0,0,0,0);
      const eventMonth = eventDate.getMonth(); const eventYear = eventDate.getFullYear();
      switch (timeFilter) {
        case 'thisWeek': {
          const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7);
          return eventDate.getTime() >= now.getTime() && eventDate.getTime() <= weekEnd.getTime();
        }
        case 'thisMonth': return eventMonth === currentMonth && eventYear === currentYear;
        case 'nextMonth': return eventMonth === nextMonth && eventYear === nextMonthYear;
        case 'twoPlus': {
          const twoMonthsFromNow = new Date(now); twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
          return eventDate.getTime() >= twoMonthsFromNow.getTime();
        }
        case 'calendarMonth': return eventMonth === currentDate.getMonth() && eventYear === currentDate.getFullYear();
        default: return true;
      }
    });
  };

  // 3. Chronological and Start-Date Sort
  const sortedUpcomingEvents = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let baseList = filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

    if (timeFilter === 'specificDay' && filterDate) {
      const normalizedFilterDate = new Date(filterDate); normalizedFilterDate.setHours(0,0,0,0);
      baseList = baseList.filter(e => {
        const eDate = new Date(e.date); eDate.setHours(0,0,0,0);
        return eDate.getTime() >= normalizedFilterDate.getTime();
      });
    } else {
      baseList = baseList.filter((e) => {
        if (timeFilter === 'calendarMonth') return true;
        const eDate = new Date(e.date); eDate.setHours(0, 0, 0, 0);
        return eDate.getTime() >= today.getTime();
      });
      baseList = getTimeFilteredEvents(baseList);
    }
    return baseList;
  }, [filteredEvents, timeFilter, currentDate, filterDate]);

  const getEventsForDay = (date: Date) => filteredEvents.filter((e) => {
    const eDate = new Date(e.date);
    return (eDate.getDate() === date.getDate() && eDate.getMonth() === date.getMonth() && eDate.getFullYear() === date.getFullYear());
  });

  const handleDayClick = (day: Date) => {
    const normalizedDay = new Date(day); normalizedDay.setHours(0,0,0,0);
    setExpandedDay(normalizedDay); setFilterDate(normalizedDay); setTimeFilter('specificDay');
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation(); setHighlightedEventId(event.id);
    const card = document.getElementById(`event-card-${event.id}`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetFilters = () => { setCurrentDate(new Date()); setTimeFilter('all'); setFilterDate(null); };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const monthDays = Array.from({ length: daysInMonth(currentDate) }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1));
  const emptyDaysBefore = Array.from({ length: firstDayOfMonth(currentDate) }, (_, i) => i);

  if (eventDetailId) {
    const event = allEvents.find((e) => e.id === eventDetailId);
    if (!event) return <div className="p-8 min-h-screen bg-[#fbfaf6] pt-[100px] text-center"><p className="text-xl font-bold text-primary mb-4">Event not found.</p><Link href="/events"><Button variant="outline">Back to All Events</Button></Link></div>;
    return (
      <div className="min-h-screen bg-[#fbfaf6] pt-[69px]">
        <div className="container mx-auto px-4 py-12">
          <Link href="/events"><Button variant="ghost" className="mb-8 text-primary hover:text-accent font-bold uppercase tracking-widest text-xs"><ChevronLeft className="mr-2" /> Back to All Events</Button></Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {event.categories.map((cat: EventCategory) => (<EventCategoryPill key={cat} category={cat} />))}
                </div>
                <h1 className="font-serif text-5xl font-bold text-primary leading-tight">{event.title}</h1>
              </div>
              <Card className="p-8 border-none shadow-xl bg-white rounded-3xl">
                <h2 className="font-serif text-2xl font-bold text-primary mb-4">About this Event</h2>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">{event.description || event.about || 'No additional information available for this event.'}</p>
                {event.signupLink && (<Button className="mt-8 bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest w-full sm:w-auto" asChild><a href={event.signupLink} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 size-5" /> Register / More Info</a></Button>)}
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="p-8 border-none shadow-lg bg-primary text-white rounded-[2rem]">
                <h3 className="font-serif text-2xl font-bold mb-6">Event Details</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4"><CalendarIcon className="size-6 text-accent shrink-0" /><div><p className="text-[10px] font-black uppercase tracking-widest text-white/40">Date</p><p className="font-bold">{event.date.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p></div></div>
                  <div className="flex items-start gap-4"><Clock className="size-6 text-accent shrink-0" /><div><p className="text-[10px] font-black uppercase tracking-widest text-white/40">Time</p><p className="font-bold">{event.time}</p></div></div>
                  <div className="flex items-start gap-4"><MapPin className="size-6 text-accent shrink-0" /><div><p className="text-[10px] font-black uppercase tracking-widest text-white/40">Location</p><p className="font-bold">{event.location}</p></div></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf6] py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center lg:text-left">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary">Parish Calendar</h2>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-2xl lg:mx-0 mx-auto">Browse upcoming events. Use the filters below to narrow by category.</p>
        </div>

        <div className="lg:hidden w-full">
          <EventsListView 
            sortedUpcomingEvents={sortedUpcomingEvents}
            timeFilter={timeFilter} setTimeFilter={setTimeFilter}
            highlightedEventId={highlightedEventId} navigate={navigate}
            onReset={resetFilters}
          />
        </div>

        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12 items-start w-full relative">
          <CalendarView 
            currentDate={currentDate} setCurrentDate={setCurrentDate}
            selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
            monthDays={monthDays} emptyDaysBefore={emptyDaysBefore}
            getEventsForDay={getEventsForDay} onDayClick={handleDayClick}
            onEventClick={handleEventClick} today={today}
          />
          <EventsListView 
            sortedUpcomingEvents={sortedUpcomingEvents}
            timeFilter={timeFilter} setTimeFilter={setTimeFilter}
            highlightedEventId={highlightedEventId} navigate={navigate}
            onReset={resetFilters}
          />
        </div>
      </div>

      {expandedDay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setExpandedDay(null)}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={() => { const next = new Date(expandedDay); next.setDate(expandedDay.getDate() - 1); setExpandedDay(next); }}><ChevronLeft /></Button>
                <div className="text-center">
                  <h3 className="font-serif text-2xl font-bold">{expandedDay.toLocaleDateString('default', { weekday: 'long' })}</h3>
                  <p className="text-xs text-white/70 uppercase tracking-widest">{expandedDay.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={() => { const next = new Date(expandedDay); next.setDate(expandedDay.getDate() + 1); setExpandedDay(next); }}><ChevronRight /></Button>
              </div>
              <button onClick={() => setExpandedDay(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar">
              {getEventsForDay(expandedDay).length === 0 ? (
                <p className="text-center py-10 text-muted-foreground font-bold uppercase tracking-widest text-xs">No events scheduled</p>
              ) : (
                getEventsForDay(expandedDay).map(event => (
                  <div key={event.id} onClick={() => { setExpandedDay(null); navigate(event.linkedOpportunityId ? `/get-involved/${event.linkedOpportunityId}` : `/events/${event.id}`); }} className="p-4 rounded-2xl border-2 border-primary/5 hover:border-primary/20 cursor-pointer transition-all flex justify-between items-center group">
                    <div>
                      <h5 className="font-bold text-primary group-hover:text-accent transition-colors">{event.title}</h5>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight mt-1">{event.time} • {event.location}</p>
                    </div>
                    <ChevronRight className="size-4 text-primary/20 group-hover:text-accent transition-colors" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
