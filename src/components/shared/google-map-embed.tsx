import { BUSINESS } from "@/lib/constants";

interface GoogleMapEmbedProps {
  className?: string;
  height?: number;
}

export function GoogleMapEmbed({
  className = "",
  height = 400,
}: GoogleMapEmbedProps) {
  const src = `https://maps.google.com/maps?q=${BUSINESS.lat},${BUSINESS.lng}&z=16&output=embed`;

  return (
    <div className={`overflow-hidden rounded-xl ${className}`}>
      <iframe
        title={`Ubicación de ${BUSINESS.name}`}
        src={src}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
