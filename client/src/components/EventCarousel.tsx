import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
    photo: string;
    caption?: string;
}

interface EventCarouselProps {
    gallery: GalleryItem[];
    eventTitle: string;
}

export const EventCarousel: React.FC<EventCarouselProps> = ({ gallery, eventTitle }) => {
    const isLooping = gallery.length > 3;

    // 1. Determine how many items are visible based on screen size
    const [visibleItems, setVisibleItems] = useState(3);

    useEffect(() => {
        if (!isLooping) return;

        const updateVisibleItems = () => {
            if (window.innerWidth > 1024) setVisibleItems(3);
            else if (window.innerWidth > 768) setVisibleItems(2);
            else setVisibleItems(1);
        };
        updateVisibleItems();
        window.addEventListener('resize', updateVisibleItems);
        return () => window.removeEventListener('resize', updateVisibleItems);
    }, [isLooping]);

    // 2. Create the Infinite Loop Gallery: [Clones of End] + [Originals] + [Clones of Start]
    // We take the last 'visibleItems' and put them at the start, and first 'visibleItems' at the end.
    const clonesStart = gallery.slice(-visibleItems);
    const clonesEnd = gallery.slice(0, visibleItems);
    const extendedGallery = [...clonesStart, ...gallery, ...clonesEnd];

    // Start the index at the first "real" image (skipping the clones at the start)
    const [currentIndex, setCurrentIndex] = useState(visibleItems);
    const [isTransitioning, setIsTransitioning] = useState(true);

    if (!gallery || gallery.length === 0) return null;

    const handleNext = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handlePrev = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    };

    // 3. The "Teleport" Logic
    useEffect(() => {
        if (!isLooping) return;

        // If we've slid into the clones at the end, teleport back to the start
        if (currentIndex >= gallery.length + visibleItems) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(visibleItems);
            }, 500);
            return () => clearTimeout(timer);
        }

        // If we've slid into the clones at the beginning, teleport back to the end
        if (currentIndex < 0) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(gallery.length);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, gallery.length, isLooping, visibleItems]);

    if (!isLooping) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {gallery.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lg bg-white border border-black/5">
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
        );
    }

    return (
        <div className="relative group w-full overflow-hidden">
            {/* Left Arrow */}
            <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-xl hover:bg-accent hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            >
                <ChevronLeft size={24} />
            </button>

            {/* The Carousel Wrapper */}
            <div
                className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                style={{
                    transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
                }}
            >
                {extendedGallery.map((item, idx) => (
                    <div
                        key={idx}
                        className="shrink-0 w-full md:w-1/2 lg:w-1/3 px-2 flex flex-col gap-3"
                    >
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lg bg-white border border-black/5">
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

            {/* Right Arrow */}
            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-xl hover:bg-accent hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};
