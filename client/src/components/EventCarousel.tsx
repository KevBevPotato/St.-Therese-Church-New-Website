import React from 'react';

interface GalleryItem {
    photo: string;
    caption?: string;
}

interface EventCarouselProps {
    gallery: GalleryItem[];
    eventTitle: string;
}

export const EventCarousel: React.FC<EventCarouselProps> = ({ gallery, eventTitle }) => {
    if (!gallery || gallery.length === 0) return null;

    return (
        <div className="relative w-full">
            {/* The Slider Container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 pb-4 no-scrollbar">
                {gallery.map((item, idx) => (
                    <div
                        key={idx}
                        className="snap-center shrink-0 w-full md:w-1/2 lg:w-1/3 flex flex-col gap-3"
                    >
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lg bg-white">
                            <img
                                src={item.photo}
                                alt={`${eventTitle} flyer ${idx + 1}`}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        {item.caption && (
                            <p className="text-center text-sm font-medium text-muted-foreground italic">
                                {item.caption}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Subtle hint for users to scroll */}
            {gallery.length > 1 && (
                <div className="text-center mt-2 text-[10px] uppercase tracking-widest text-primary/40 font-bold">
                    ← Swipe to see more flyers →
                </div>
            )}
        </div>
    );
};
