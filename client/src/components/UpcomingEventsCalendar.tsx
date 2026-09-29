import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation, useSearch, Link } from 'wouter';

import { CalendarEvent, EventCategory } from './eventfolders/types';
import { staticEvents, generateRecurringEventsForMonth, ExtendedTimeFilter, EVENT_COLORS } from './eventfolders/events';
import { EventCategoryPill } from './event-components';
import { CalendarView } from './CalendarView';
import { EventsListView } from './EventsListView';

type UpcomingEventsCalendarProps = {
  homeView?: boolean;
  params?: Record<number, string | undefined>;
};

export default function UpcomingEventsCalendar(props: UpcomingEventsCalendarProps) {
  const homeView = props.homeView === true;
  const [location, navigate] = useLocation();
  const search = useSearch();
  const calendarViewRequested = new URLSearchParams(search).get('view') === 'calendar';
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState<Set<EventCategory>>(new Set(Object.keys(EVENT_COLORS) as EventCategory[]));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<ExtendedTimeFilter>('all');
  const [eventSearchQuery, setEventSearchQuery] = useState('');

  const eventDetailId = location.startsWith('/events/') ? location.split('/events/')[1] : null;

  // 1. MERGE ALL DATA SOURCES
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

  // 2. SYNC LOGIC: The "Start Date" calculation
  const sortedUpcomingEvents = useMemo(() => {
    const today = new Date(); 
    today.setHours(0, 0, 0, 0);
    
    // Always maintain strict chronological order first
    let list = [...filteredEvents].sort((a, b) => a.date.getTime() - b.date.getTime());

    const anchorDate = selectedDate;

    if (anchorDate) {
      const anchorDayTime = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate()).getTime();
      list = list.filter(event => {
        const eventDayTime = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate()).getTime();
        return eventDayTime >= anchorDayTime;
      });
      list.sort((firstEvent, secondEvent) => {
        const firstEventDayTime = new Date(firstEvent.date.getFullYear(), firstEvent.date.getMonth(), firstEvent.date.getDate()).getTime();
        const secondEventDayTime = new Date(secondEvent.date.getFullYear(), secondEvent.date.getMonth(), secondEvent.date.getDate()).getTime();
        const firstIsAnchor = firstEventDayTime === anchorDayTime;
        const secondIsAnchor = secondEventDayTime === anchorDayTime;

        if (firstIsAnchor !== secondIsAnchor) {
          return firstIsAnchor ? -1 : 1;
        }

        return firstEvent.date.getTime() - secondEvent.date.getTime();
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
      if (timeFilter === 'calendarMonth') {
        list = list.filter(e => e.date.getFullYear() === currentDate.getFullYear() && e.date.getMonth() === currentDate.getMonth());
      }
    }

    const query = eventSearchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(event => [
        event.title,
        event.location,
        event.description,
        event.about,
        event.categories.join(' '),
      ].filter(Boolean).join(' ').toLowerCase().includes(query));
    }

    return list;
  }, [filteredEvents, timeFilter, currentDate, eventSearchQuery, selectedDate]);

  const getEventsForDay = (date: Date) => filteredEvents.filter((e) => {
    const eDate = new Date(e.date);
    return (eDate.getDate() === date.getDate() && eDate.getMonth() === date.getMonth() && eDate.getFullYear() === date.getFullYear());
  });

  const handleDayClick = (day: Date) => {
    const normalizedDay = new Date(day);
    normalizedDay.setHours(0, 0, 0, 0);

    setSelectedDate((currentSelectedDate) => {
      if (currentSelectedDate && currentSelectedDate.getTime() === normalizedDay.getTime()) {
        return null;
      }

      return normalizedDay;
    });
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
    setSelectedDate(null);
    setEventSearchQuery('');
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
          {calendarViewRequested && (
            <CalendarView currentDate={currentDate} setCurrentDate={setCurrentDate} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} monthDays={monthDays} emptyDaysBefore={emptyDaysBefore} getEventsForDay={getEventsForDay} onDayClick={handleDayClick} onDayHover={() => {}} onDayLeave={() => {}} onEventClick={handleEventClick} today={today} selectedDate={selectedDate} />
          )}
        </div>
        <div className={calendarViewRequested ? 'hidden' : 'lg:hidden w-full'}>
          <EventsListView sortedUpcomingEvents={sortedUpcomingEvents} timeFilter={timeFilter} setTimeFilter={setTimeFilter} highlightedEventId={highlightedEventId} navigate={navigate} onReset={resetFilters} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} showCalendarLink={homeView} eventSearchQuery={eventSearchQuery} setEventSearchQuery={setEventSearchQuery} />
        </div>
        <div className="hidden lg:grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start w-full relative">
          <CalendarView currentDate={currentDate} setCurrentDate={setCurrentDate} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} monthDays={monthDays} emptyDaysBefore={emptyDaysBefore} getEventsForDay={getEventsForDay} onDayClick={handleDayClick} onDayHover={() => {}} onDayLeave={() => {}} onEventClick={handleEventClick} today={today} selectedDate={selectedDate} />
          <EventsListView sortedUpcomingEvents={sortedUpcomingEvents} timeFilter={timeFilter} setTimeFilter={setTimeFilter} highlightedEventId={highlightedEventId} navigate={navigate} onReset={resetFilters} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} showCalendarLink={homeView} eventSearchQuery={eventSearchQuery} setEventSearchQuery={setEventSearchQuery} />
        </div>
      </div>
    </div>
  );
}
