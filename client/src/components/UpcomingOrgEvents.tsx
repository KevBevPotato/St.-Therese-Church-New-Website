// --- File: client/src/components/UpcomingOrgEvents.tsx ---
import { Link } from 'wouter';
import { Calendar, ArrowRight, MapPin, Clock } from 'lucide-react';
import { EVENT_COLORS, type CalendarEvent, type EventCategory } from './events';

interface UpcomingOrgEventsProps {
    events: CalendarEvent[];
    orgName: string;
    emptyMessage?: string;
}

export default function UpcomingOrgEvents({
    events,
    orgName,
    emptyMessage,
}: UpcomingOrgEventsProps) {
    if (events.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-primary/15">
                <Calendar className="size-10 text-primary/20 mx-auto mb-3" />
                <p className="text-muted-foreground font-bold">
                    {emptyMessage ?? `No upcoming ${orgName} events at this time.`}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Check back soon for the latest updates.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {events.map(event => {
                const primaryCategory = event.categories[0];
                const colors = EVENT_COLORS[primaryCategory];

                return (
                    <Link key={event.id} href={`/events/${event.id}`}>
                        <a className="block group">
                            <div className="bg-white rounded-2xl border-2 border-primary/10 hover:border-primary/30 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                                <div className="flex items-start gap-4">
                                    {/* Date pill */}
                                    <div className="shrink-0 w-16 text-center">
                                        <div className={`text-[10px] font-bold uppercase tracking-widest ${colors.labelColor}`}>
                                            {event.date.toLocaleString('default', { month: 'short' })}
                                        </div>
                                        <div className="text-3xl font-serif font-bold text-primary leading-none mt-1">
                                            {event.date.getDate()}
                                        </div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                            {event.date.toLocaleString('default', { weekday: 'short' })}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {event.categories.map((cat: EventCategory) => {
                                                const c = EVENT_COLORS[cat];
                                                return (
                                                    <span
                                                        key={cat}
                                                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${c.bg} ${c.labelColor} rounded-full border ${c.border}/30`}
                                                    >
                                                        {c.label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <h4 className="text-base font-serif font-bold text-primary leading-tight group-hover:text-accent transition-colors mb-2">
                                            {event.title}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock size={11} className="text-primary/50" /> {event.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={11} className="text-primary/50" /> {event.location}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="shrink-0 self-center">
                                        <ArrowRight className="text-primary/30 group-hover:text-accent group-hover:translate-x-1 transition-all" size={20} />
                                    </div>
                                </div>
                            </div>
                        </a>
                    </Link>
                );
            })}
        </div>
    );
}
