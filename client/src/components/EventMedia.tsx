import { Image as ImageIcon } from "lucide-react";
import { EventCarousel } from "@/components/EventCarousel";
import type { CalendarEvent } from "@/components/eventfolders/types";

interface EventMediaProps {
  event: Pick<CalendarEvent, "title" | "image" | "photos" | "gallery">;
}

export function EventMedia({ event }: EventMediaProps) {
  const { title, image, photos, gallery } = event;
  const mediaByPhoto = new Map<
    string,
    NonNullable<CalendarEvent["gallery"]>[number]
  >();

  for (const photo of [image, ...(photos ?? [])]) {
    if (typeof photo === "string" && photo.trim()) {
      mediaByPhoto.set(photo, { photo });
    }
  }

  for (const item of gallery ?? []) {
    if (typeof item?.photo === "string" && item.photo.trim()) {
      mediaByPhoto.set(item.photo, item);
    }
  }

  const media = Array.from(mediaByPhoto.values());
  const carouselPhotos = media.filter(item => item.showInCarousel !== false);
  const archivedPhotos = media.filter(item => item.showInCarousel === false);

  if (media.length === 0) return null;

  return (
    <div className="space-y-8">
      {carouselPhotos.length > 0 && (
        <EventCarousel
          key={carouselPhotos.map(item => item.photo).join("|")}
          gallery={carouselPhotos}
          eventTitle={title}
          forceCarousel
        />
      )}

      {archivedPhotos.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5 text-primary" />
            <h2 className="font-serif text-3xl font-bold text-primary">
              Event Gallery
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {archivedPhotos.map((item, index) => {
              const configuredLink = item.linkUrl?.trim() || "";
              const isValidLink =
                /^https?:\/\//i.test(configuredLink) ||
                /^\/(?!\/)/.test(configuredLink);
              const destination = isValidLink ? configuredLink : item.photo;
              const opensNewTab =
                !isValidLink || /^https?:\/\//i.test(configuredLink);

              return (
                <a
                  key={item.photo}
                  href={destination}
                  target={opensNewTab ? "_blank" : undefined}
                  rel={opensNewTab ? "noopener noreferrer" : undefined}
                  className="group relative aspect-square overflow-hidden rounded-2xl shadow-md transition-opacity hover:opacity-90"
                >
                  <img
                    src={item.photo}
                    alt={
                      item.caption || `${title} gallery photo ${index + 1}`
                    }
                    className="h-full w-full object-cover"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 flex items-end bg-black/60 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="text-xs italic text-white">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
