import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: 'Sunday Mass',
    date: 'July 27, 2026',
    time: '9:00 AM & 5:30 PM',
    location: 'Church Sanctuary',
    description: 'Weekly Sunday Mass - All are welcome to join us in worship.',
  },
  {
    id: 2,
    title: 'Eucharistic Adoration',
    date: 'July 31, 2026',
    time: '8:00 AM - 9:00 AM',
    location: 'Church Chapel',
    description: 'Come spend time in prayer before the Blessed Sacrament.',
  },
  {
    id: 3,
    title: 'Reconciliation',
    date: 'August 2, 2026',
    time: '3:00 PM - 4:00 PM',
    location: 'Confessional',
    description: 'Sacrament of Reconciliation - Prepare your heart for grace.',
  },
  {
    id: 4,
    title: 'Parish Council Meeting',
    date: 'August 5, 2026',
    time: '7:00 PM',
    location: 'Parish Hall',
    description: 'Monthly meeting of the Parish Council. All members welcome.',
  },
  {
    id: 5,
    title: 'Youth Group Meeting',
    date: 'August 8, 2026',
    time: '6:30 PM',
    location: 'Church Hall',
    description: 'Join us for fellowship, games, and spiritual growth.',
  },
  {
    id: 6,
    title: 'Baptism Class',
    date: 'August 10, 2026',
    time: '10:00 AM',
    location: 'Parish Office',
    description: 'Preparation class for parents seeking Baptism for their children.',
  },
  {
    id: 7,
    title: 'First Communion Preparation',
    date: 'August 15, 2026',
    time: '2:00 PM',
    location: 'Church Hall',
    description: 'Classes for children preparing to receive First Holy Communion.',
  },
  {
    id: 8,
    title: 'Confirmation Ceremony',
    date: 'August 22, 2026',
    time: '3:00 PM',
    location: 'Church Sanctuary',
    description: 'Sacrament of Confirmation - A milestone in faith journey.',
  },
  {
    id: 9,
    title: 'Community Potluck',
    date: 'August 29, 2026',
    time: '6:00 PM',
    location: 'Parish Hall',
    description: 'Join us for food, fellowship, and community building.',
  },
  {
    id: 10,
    title: 'Rosary Prayer Group',
    date: 'September 5, 2026',
    time: '7:00 PM',
    location: 'Church Chapel',
    description: 'Monthly Rosary prayer group - All devotions welcome.',
  },
];

export default function EventsCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 text-center">
            Upcoming Events
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Stay connected with our parish community
          </p>

          {/* Carousel Container */}
          <div className="relative">
            {/* Scroll Buttons */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors shadow-lg"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors shadow-lg"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Events Scroll Container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="flex-shrink-0 w-80 p-6 border-2 border-border hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-serif font-bold text-primary mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <Calendar size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <Clock size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-primary text-primary hover:bg-primary/5"
                  >
                    Learn More
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Event Count Indicator */}
          <div className="text-center mt-8 text-muted-foreground">
            <p className="text-sm">Showing {upcomingEvents.length} upcoming events</p>
          </div>
        </div>
      </div>
    </section>
  );
}
