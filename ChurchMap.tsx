// Sacred Minimalism: a practical location tool framed with warm ivory, navy, and restrained gold accents.
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { MapView } from '@/components/Map';

const address = '532 Adams St, Rapid City, SD 57701';
const googleDirections = 'https://www.google.com/maps/dir/?api=1&destination=532+Adams+St%2C+Rapid+City%2C+SD+57701';
const appleDirections = 'https://maps.apple.com/?daddr=532+Adams+St,+Rapid+City,+SD+57701&dirflg=d';

export default function ChurchMap() {
  const addChurchMarker = (map: google.maps.Map) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      const location = results?.[0]?.geometry.location;
      if (status !== 'OK' || !location) return;

      map.setCenter(location);
      map.setZoom(16);
      new google.maps.marker.AdvancedMarkerElement({
        map,
        position: location,
        title: 'Saint Therese Church',
      });
    });
  };

  return (
    <div className="overflow-hidden border border-primary/15 bg-white shadow-[0_18px_50px_rgba(26,55,89,0.12)]">
      <div className="relative">
        <MapView
          initialCenter={{ lat: 44.0805, lng: -103.231 }}
          initialZoom={14}
          onMapReady={addChurchMarker}
          className="h-[360px] w-full md:h-[430px]"
        />
        <div className="pointer-events-none absolute left-4 top-4 max-w-[calc(100%-2rem)] border border-white/60 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
          <p className="flex items-center gap-2 font-serif text-lg font-bold text-primary">
            <MapPin className="size-4 text-[#9b762f]" aria-hidden="true" />
            Saint Therese Church
          </p>
          <p className="mt-1 text-xs text-muted-foreground">532 Adams St · Rapid City, SD</p>
        </div>
      </div>

      <div className="grid gap-3 border-t border-primary/10 bg-[#fbfaf6] p-4 sm:grid-cols-2">
        <a
          href={googleDirections}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Navigation className="size-4" aria-hidden="true" />
          Google Maps
          <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
          <span className="sr-only"> directions, opens in a new tab</span>
        </a>
        <a
          href={appleDirections}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary/40 hover:bg-secondary"
        >
          <Navigation className="size-4" aria-hidden="true" />
          Apple Maps
          <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
          <span className="sr-only"> directions, opens in a new tab</span>
        </a>
      </div>
    </div>
  );
}
