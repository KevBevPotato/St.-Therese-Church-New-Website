import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  Filter,
  X,
  User,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation, Link } from 'wouter';

import {
  CalendarEvent,
  EventCategory,
  TimeFilter,
  EVENT_COLORS,
  generateRecurringEventsForMonth,
  staticEvents,
} from './events';

type ExtendedTimeFilter = TimeFilter | 'thisWeek' | 'calendarMonth' | 'specificDay';

// ---- 1. CATEGORY PILL (Shared) ----
function EventCategoryPill({ category }: { category: EventCategory }) {
  const colors = EVENT_COLORS[category] || EVENT_COLORS['parishEvents'];
  return (
    <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.labelColor} border border-black/5`}>
      {colors.label}
    </span>
  );
}

// ---- 2. CALENDAR CELL EVENT (RIGID & TRUNCATED) ----
// This component is ONLY for the grid. It forces a single line with ellipsis.
function CalendarCellEvent({ 
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
      /* 'truncate' is the key here: it forces 1 line and adds the ... ellipsis */
      className={`flex-1 block w-full rounded px-1 py-0.5 text-left truncate ${colors.bg} border-l-2 ${colors.border} ${colors.labelColor} hover:brightness-95 transition-all font-bold ${isPast ? 'opacity-30' : 'opacity-100'} leading-none ${fontSize}`}
      title={`${event.time}: ${event.title}`}
    >
      {event.title}
    </button>
  );
}

// ---- 3. EVENT LIST CARD (FLEXIBLE & WRAPPING) ----
// This component is ONLY for the right-side list. It grows naturally.
function EventCard({ 
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
      /* h-auto and min-h allow the card to grow as text wraps */
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
        {/* break-words and leading-snug allow professional wrapping for long titles */}
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

// ---- 4. CALENDAR DAY COMPONENT ----
function CalendarDay({
  date,
  today,
  events,
  onEventClick,
  onDayClick,
}: {
  date: Date;
  today: Date;
  events: CalendarEvent[];
  onEventClick: (e: React.MouseEvent, event: CalendarEvent) => void;
  onDayClick: (day: Date) => void;
}) {
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isPast = date < today && !isToday;

  const getFontSize = () => {
    const count = events.length;
    if (count <= 2) return 'text-[9px]';
    if (count <= 4) return 'text-[8px]';
    return 'text-[7px]';
  };

  return (
    <div
      onClick={() => onDayClick(date)}
      className={`aspect-square border-r-2 border-b-2 p-1.5 transition-colors border-primary/30 ${isToday ? 'bg-primary/5' : 'bg-white hover:bg-gray-50/50'
        } cursor-pointer flex flex-col overflow-hidden`}
    >
      <div className={`text-xs font-black mb-1 flex-shrink-0 ${isToday ? 'text-primary' : 'text-gray-400'}`}>
        {date.getDate()}
      </div>

      <div className="flex flex-col space-y-0.5 pointer-events-auto flex-1 min-h-0">
        {events.map((event) => (
          <CalendarCellEvent 
            key={event.id} 
            event={event} 
            isPast={isPast} 
            fontSize={getFontSize()} 
            onEventClick={onEventClick} 
          />
        ))}
      </div>
    </div>
  );
}

export default function UpcomingEventsCalendar() {
  const [location, navigate] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState<Set<EventCategory>>(
    new Set(Object.keys(EVENT_COLORS) as EventCategory[])
  );
  const [expandedDay, setExpandedDay] = useState<Date | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<ExtendedTimeFilter>('all');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const eventDetailId = location.startsWith('/events/') ? location.split('/events/')[1] : null;

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

  const toggleEventType = (type: EventCategory) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type); else next.add(type);
    setSelectedTypes(next);
  };

  const selectAll = () => setSelectedTypes(new Set(Object.keys(EVENT_COLORS) as EventCategory[]));
  const deselectAll = () => setSelectedTypes(new Set());

  const getTimeFilteredEvents = (eventsToFilter: CalendarEvent[]) => {
    if (timeFilter === 'all') return eventsToFilter;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    return eventsToFilter.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0,0,0,0);
      const eventMonth = eventDate.getMonth();
      const eventYear = eventDate.getFullYear();

      switch (timeFilter) {
        case 'thisWeek': {
          const weekEnd = new Date(now);
          weekEnd.setDate(now.getDate() + 7);
          return eventDate.getTime() >= now.getTime() && eventDate.getTime() <= weekEnd.getTime();
        }
        case 'thisMonth': return eventMonth === currentMonth && eventYear === currentYear;
        case 'nextMonth': return eventMonth === nextMonth && eventYear === nextMonthYear;
        case 'twoPlus': {
          const twoMonthsFromNow = new Date(now);
          twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
          return eventDate.getTime() >= twoMonthsFromNow.getTime();
        }
        case 'calendarMonth': return eventMonth === currentDate.getMonth() && eventYear === currentDate.getFullYear();
        case 'specificDay': if (!filterDate) return true; return eventDate.getTime() === filterDate.getTime();
        default: return true;
      }
    });
  };

  const sortedUpcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = filteredEvents
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter((e) => {
        if (timeFilter === 'calendarMonth' || timeFilter === 'specificDay') return true;
        const eDate = new Date(e.date);
        eDate.setHours(0, 0, 0, 0);
        return eDate.getTime() >= today.getTime();
      });
    return getTimeFilteredEvents(upcoming);
  }, [filteredEvents, timeFilter, currentDate, filterDate]);

  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter((e) => {
      const eDate = new Date(e.date);
      return (eDate.getDate() === date.getDate() && eDate.getMonth() === date.getMonth() && eDate.getFullYear() === date.getFullYear());
    });
  };

  const handlePrev = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNext = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const handleDayClick = (day: Date) => {
    const normalizedDay = new Date(day);
    normalizedDay.setHours(0,0,0,0);
    setExpandedDay(normalizedDay);
    setFilterDate(normalizedDay);
    setTimeFilter('specificDay');
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setHighlightedEventId(event.id);
    const card = document.getElementById(`event-card-${event.id}`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const monthDays = Array.from({ length: daysInMonth(currentDate) }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1));
  const emptyDaysBefore = Array.from({ length: firstDayOfMonth(currentDate) }, (_, i) => i);

  const renderCategoryFilter = () => (
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
          <button onClick={selectAll} className="text-[9px] font-black text-primary hover:underline uppercase">All</button>
          <button onClick={deselectAll} className="text-[9px] font-black text-muted-foreground hover:underline uppercase">None</button>
        </div>
      </div>
    </div>
  );

  const renderMonthHeader = () => (
    <div className="bg-primary p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={handlePrev}><ChevronLeft className="size-6" /></Button>
        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide min-w-[160px] text-center">{monthName}</h3>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={handleNext}><ChevronRight className="size-6" /></Button>
      </div>
    </div>
  );

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
              {event.faqItems && event.faqItems.length > 0 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-3xl font-bold text-primary">Frequently Asked Questions</h3>
                  <div className="grid gap-4">
                    {event.faqItems.map((faq, i) => (<Card key={i} className="p-6 border-2 border-primary/5 bg-white rounded-2xl"><h4 className="font-bold text-primary mb-2">{faq.question}</h4><p className="text-muted-foreground text-sm">{faq.answer}</p></Card>))}
                  </div>
                </div>
              )}
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
              {(event.contactPerson || event.contactEmail || event.contactPhone) && (
                <Card className="p-8 border-2 border-primary/10 bg-white rounded-[2rem]">
                  <h3 className="font-serif text-xl font-bold text-primary mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    {event.contactPerson && (<div className="flex items-center gap-3"><User size={18} className="text-accent" /><span className="text-sm font-bold text-primary">{event.contactPerson}</span></div>)}
                    {event.contactEmail && (<a href={`mailto:${event.contactEmail}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors"><Mail size={18} /> {event.contactEmail}</a>)}
                    {event.contactPhone && (<a href={`tel:${event.contactPhone.replace(/\D/g, '')}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors"><Phone size={18} /> {event.contactPhone}</a>)}
                  </div>
                </Card>
              )}
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

        <div className="lg:hidden space-y-4">
          <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-sm overflow-hidden">{renderCategoryFilter()}</div>
          <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-sm overflow-hidden">
            <div className="sticky top-0 z-10 bg-white border-b-2 border-primary/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-serif text-xl font-bold text-primary tracking-tight">Upcoming Events</h4>
                <Button variant="outline" size="sm" onClick={() => { setCurrentDate(new Date()); setTimeFilter('all'); }} className="rounded-full font-bold text-[10px] uppercase tracking-widest border-2 h-7 px-3">Reset</Button>
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                {(['all', 'thisWeek', 'thisMonth', 'nextMonth', 'twoPlus', 'calendarMonth'] as ExtendedTimeFilter[]).map(filter => (
                  <button key={filter} onClick={() => setTimeFilter(filter)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${timeFilter === filter ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {filter === 'all' ? 'All' : filter === 'thisWeek' ? 'This Week' : filter === 'thisMonth' ? 'This Month' : filter === 'nextMonth' ? 'Next Month' : filter === 'twoPlus' ? '2+ Months' : 'Calendar Month'}
                  </button>
                ))}
              </div>
            </div>
            <div id="events-scroll-container-mobile" className="flex flex-col gap-3 min-h-[600px] max-h-[80vh] overflow-y-auto p-4 pb-6 custom-scrollbar">
              {sortedUpcomingEvents.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-xl border-2 border-dashed border-primary/10"><CalendarIcon className="size-12 text-primary/10 mx-auto mb-4" /><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No events found</p></div>
              ) : (
                sortedUpcomingEvents.map(event => (<EventCard key={event.id} event={event} highlighted={highlightedEventId === event.id} navigate={navigate} />))
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col lg:flex-row gap-12 items-start w-full relative">
          <div className="w-full lg:w-7/12 flex-shrink-0 flex flex-col">
            <div className="bg-white rounded-t-2xl border-x-2 border-t-2 border-primary/30 shadow-sm overflow-hidden">
              {renderMonthHeader()}
              {renderCategoryFilter()}
            </div>
            <div className="grid grid-cols-7 bg-white shadow-xl rounded-b-2xl overflow-hidden border-l-2 border-t-2 border-primary/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="relative p-3 text-center text-[10px] font-black uppercase tracking-widest text-primary/60 bg-gray-100 border-r-2 border-b-2 border-primary/30">{day}</div>
              ))}
              {emptyDaysBefore.map(i => (<div key={`empty-${i}`} className="aspect-square border-r-2 border-b-2 border-primary/30 bg-gray-50/10" />))}
              {monthDays.map(date => (
                <CalendarDay key={date.toISOString()} date={date} today={today} events={getEventsForDay(date)} onEventClick={handleEventClick} onDayClick={handleDayClick} />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-5/12 space-y-6 lg:pt-0 pt-8 lg:sticky lg:top-20">
            <div className="flex items-center justify-between pb-4 border-b-2 border-primary/10">
              <h4 className="font-serif text-3xl font-bold text-primary tracking-tight">Upcoming Events</h4>
              <Button variant="outline" size="sm" onClick={() => { setCurrentDate(new Date()); setTimeFilter('all'); }} className="rounded-full font-bold text-xs uppercase tracking-widest border-2">Reset</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'thisWeek', 'thisMonth', 'nextMonth', 'twoPlus', 'calendarMonth'] as ExtendedTimeFilter[]).map(filter => (
                <button key={filter} onClick={() => setTimeFilter(filter)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${timeFilter === filter ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {filter === 'all' ? 'All' : filter === 'thisWeek' ? 'This Week' : filter === 'thisMonth' ? 'This Month' : filter === 'nextMonth' ? 'Next Month' : filter === 'twoPlus' ? '2+ Months' : 'Calendar Month'}
                </button>
              ))}
            </div>
            <div id="events-scroll-container" className="flex flex-col gap-4 lg:max-h-[calc(100vh-12rem)] overflow-y-auto pr-4 pb-8 custom-scrollbar">
              {sortedUpcomingEvents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-primary/10"><CalendarIcon className="size-12 text-primary/10 mx-auto mb-4" /><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No events found</p></div>
              ) : (
                sortedUpcomingEvents.map(event => (<EventCard key={event.id} event={event} highlighted={highlightedEventId === event.id} navigate={navigate} />))
              )}
            </div>
          </div>
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
