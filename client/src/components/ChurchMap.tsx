/**
 * ChurchMap Component
 * Uses a standard Google Maps embed for maximum reliability.
 * No API keys required for basic embedding.
 */

export default function ChurchMap() {
  // Address for Saint Therese Church, Rapid City, SD
  const address = "532 Adams St, Rapid City, SD 57701";
  const encodedAddress = encodeURIComponent(address);
  
  // Google Maps Embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_API_KEY&q=${encodedAddress}`;
  
  /* 
     NOTE: For a completely "No-Key" version, we use the standard search embed.
     This is the most reliable way to ensure a map shows up immediately.
  */
  const noKeyMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
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
        title="Saint Therese Church Location"
      ></iframe>
    </div>
  );
}
