import React, { useState } from 'react';
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
    const [currentIndex, setCurrentIndex] = useState(0);

    // If there's no gallery or it's empty, don't render anything
    if (!gallery || gallery.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-xl group bg-black">
            {/* Image Display */}
            <div className="relative h-64 md:h-96 w-full overflow-hidden">
                <img
                    src={gallery[currentIndex].photo}
                    alt={`${eventTitle} - ${gallery[currentIndex].caption || 'Event Image'}`}
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                />

                {/* Caption Overlay - appears at the bottom of the image */}
                {gallery[currentIndex].caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 text-sm text-center backdrop-blur-sm transition-opacity duration-300">
                        {gallery[currentIndex].caption}
                    </div>
                )}
            </div>

            {/* Navigation Arrows - Only show if there is more than one image */}
            {gallery.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Previous Image"
                    >
                        <ChevronLeft size={24} className="text-gray-800" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Next Image"
                    >
                        <ChevronRight size={24} className="text-gray-800" />
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
                {gallery.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all ${idx === currentIndex
                                ? 'bg-white w-6'
                                : 'bg-white/50 w-2 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
