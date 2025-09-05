"use client"

import { Card } from "@/components/ui/card"

interface GoogleMapProps {
  lat: number
  lng: number
  zoom?: number
  title?: string
  className?: string
  height?: string
}

export default function GoogleMap({
  lat,
  lng,
  zoom = 15,
  title = "Office Location",
  className = "",
  height = "400px",
}: GoogleMapProps) {
  const hasApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== "DEMO_KEY"

  // Generate Google Maps embed URL
  const mapUrl = hasApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${lat},${lng}&zoom=${zoom}`
    : `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`

  return (
    <Card className={`p-0 overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative group">
        <iframe
          width="100%"
          height={height}
          style={{ border: 0, minHeight: height }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          title={title}
          className="w-full rounded-lg transition-transform group-hover:scale-[1.02]"
        />

        {/* Overlay with link to open in Google Maps */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors rounded-lg">
          <a
            href={`https://www.google.com/maps?q=${lat},${lng}&z=${zoom}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/90"
            aria-label={`Open ${title} in Google Maps`}
          >
            Open in Maps
          </a>
        </div>
      </div>
    </Card>
  )
}
