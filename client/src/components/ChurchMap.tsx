/**
 * ChurchMap Component
 * Uses a standard Google Maps embed for maximum reliability.
 * No API keys required for basic embedding.
 */

export default function ChurchMap() {
  // Address for Saint Therese Church, Rapid City, SD
  const address = "532 Adams St, Rapid City, SD 57701";
  const encodedAddress = encodeURIComponent(address);
  const encodedDirectionsAddress = encodeURIComponent(
    "Saint Thérèse Church, 532 Adams St, Rapid City, SD 57701",
  );
  const noKeyMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${encodedDirectionsAddress}`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDirectionsAddress}`;

  return (
    <div>
      <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={noKeyMapUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Saint Thérèse Church Location"
        ></iframe>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-primary">
          Get directions with:
        </span>
        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-primary/20 bg-background px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Apple Maps
        </a>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-primary/20 bg-background px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Google Maps
        </a>
      </div>
    </div>
  );
}
