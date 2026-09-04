import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, ExternalLink, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation, Link } from 'wouter';

// DIRECT IMPORTS - Bypassing events.ts as requested
import { CalendarEvent, EventCategory, TimeFilter, EVENT_COLORS } from './eventfolders/types'; import { oneTimeEvents } from './eventfolders/oneTimeEvents';
import { irregularEvents } from './eventfolders/irregularEvents';
import { EventCategoryPill } from './event-components'; 
import { CalendarView } from './CalendarView';
import { EventsListView } from './EventsListView';

type ExtendedTimeFilter = TimeFilter | 'thisWeek' | 'calendarMonth' | 'specificDay';

// Recurring logic kept inside the Brain for independence from events.ts
function generateRecurringEventsForMonth(month: number, year: number): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (d.getDay() >= 1 && d.getDay() <= 5) {
            events.push({ id: `mass-daily-${dateStr}`, title: 'Daily Mass', date: new Date(year, month, day, 7, 30), time: '7:30 AM', location: 'Main Sanctuary', categories: ['sacramental'], description: 'Daily Mass' });
            events.push({ id: `rosary-daily-${dateStr}`, title: "Daily Rosary", date: new Date(year, month, day, 7, 0), time: "7:00 AM", location: "Main Sanctuary", categories: ["sacramental"] });
        }
        if (d.getDay() === 6) {
            events.push({ id: `mass-saturday-${dateStr}`, title: 'Saturday Vigil Mass', date: new Date(year, month, day, 16, 30), time: '4:30 PM', location: 'Main Sanctuary', categories: ['sacramental'] });
        }
        if (d.getDay() === 0) {
            events.push({ id: `mass-sunday-am-${dateStr}`, title: 'Sunday Mass (9:00 AM)', date: new Date(year, month, day, 9, 0), time: '9:00 AM', location: 'Main Sanctuary', categories: ['sacramental'] });
            events.push({ id: `mass-sunday-pm-${dateStr}`, title: 'Sunday Mass (5:30 PM)', date: new Date(year, month, day, 17, 30), time: '5:30 PM', location: 'Main Sanctuary', categories: ['sacramental'] });
            events.push({ id: `rosary-sun-${dateStr}`, title: "Family Rosary", date: new Date(year, month, day, 19, 0), time: "7:00 PM", location: "Main Sanctuary", categories: ["sacramental", "parishEvents"] });
        }
        if (d.getDay() === 5) {
            events.push({ id: `holyhour-${dateStr}`, title: "Holy Hour", date: new Date(year, month, day, 8, 0), time: "8:00 AM - 9:00 AM", location: 'Main Sanctuary', categories: ['sacramental'] });
        }
    }
    return events;
}

export default function UpcomingEventsCalendar() {
  const [location, navigate] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState<Set<EventCategory>>(new Set(Object.keys(EVENT_COLORS) as EventCategory[]));
  const [expandedDay, setExpandedDay] = useState<Date | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<ExtendedTimeFilter>('all');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const eventDetailId = location.startsWith('/events/') ? location.split('/events/')[1] : null;

  // 1. MERGE ALL DATA SOURCES
  const allEvents = useMemo(() => {
    const events = [...oneTimeEvents, ...irregularEvents];
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

  // 2. SYNC LOGIC: The "Start Date" calculation
  const sortedUpcomingEvents = useMemo(() => {
    const today = new Date(); 
    today.setHours(0, 0, 0, 0);
    
    // Always maintain strict chronological order first
    let list = [...filteredEvents].sort((a, b) => a.date.getTime() - b.date.getTime());

    if (timeFilter === 'specificDay' && filterDate) {
      // SYNC: Filter out everything BEFORE the clicked date
      const startLimit = new Date(filterDate);
      startLimit.setHours(0,0,0,0);
      
      list = list.filter(e => {
        const eDate = new Date(e.date);
        eDate.setHours(0,0,0,0);
        return eDate.getTime() >= startLimit.getTime();
      });
    } else {
      // Standard view: Only show events today and in the future
      list = list.filter(e => {
        const eDate = new Date(e.date);
        eDate.setHours(0,0,0,0);
        return eDate.getTime() >= today.getTime();
      });

      // Apply additional time filters if active (This Week, etc)
      if (timeFilter === 'thisWeek') {
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        list = list.filter(e => new Date(e.date).getTime() <= weekEnd.getTime());
      }
      // Note: 'thisMonth' etc. can be added here similarly
    }
    return list;
  }, [filteredEvents, timeFilter, filterDate]);

  const getEventsForDay = (date: Date) => filteredEvents.filter((e) => {
    const eDate = new Date(e.date);
    return (eDate.getDate() === date.getDate() && eDate.getMonth() === date.getMonth() && eDate.getFullYear() === date.getFullYear());
  });

  const handleDayClick = (day: Date) => {
    const normalizedDay = new Date(day); 
    normalizedDay.setHours(0,0,0,0);
    setExpandedDay(normalizedDay); 
    setFilterDate(normalizedDay); 
    setTimeFilter('specificDay'); // This triggers the list update
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation(); 
    setHighlightedEventId(event.id);
    const card = document.getElementById(`event-card-${event.id}`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetFilters = () => { 
    setCurrentDate(new Date()); 
    setTimeFilter('all'); 
    setFilterDate(null); 
  };

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
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">{event.description || event.about || 'No additional information available.'}</p>
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
          <EventsListView sortedUpcomingEvents={sortedUpcomingEvents} timeFilter={timeFilter} setTimeFilter={setTimeFilter} highlightedEventId={highlightedEventId} navigate={navigate} onReset={resetFilters} />
        </div>
        <div className="hidden lg:grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start w-full relative">
          <CalendarView currentDate={currentDate} setCurrentDate={setCurrentDate} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} monthDays={monthDays} emptyDaysBefore={emptyDaysBefore} getEventsForDay={getEventsForDay} onDayClick={handleDayClick} onEventClick={handleEventClick} today={today} />
          <EventsListView sortedUpcomingEvents={sortedUpcomingEvents} timeFilter={timeFilter} setTimeFilter={setTimeFilter} highlightedEventId={highlightedEventId} navigate={navigate} onReset={resetFilters} />
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
// blah blah blah
