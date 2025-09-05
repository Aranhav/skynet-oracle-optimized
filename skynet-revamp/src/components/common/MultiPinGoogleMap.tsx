"use client"

import { Card } from "@/components/ui/card"

interface Office {
  id: string
  name: string
  lat: number | null
  lng: number | null
  hasCoordinates?: boolean
}

interface MultiPinGoogleMapProps {
  offices: Office[]
  className?: string
  height?: string
}

export default function MultiPinGoogleMap({ offices, className = "", height = "600px" }: MultiPinGoogleMapProps) {
  // Filter offices that have coordinates - be more flexible with coordinate detection
  const officesWithCoordinates = offices.filter(
    (office) => office.lat !== null && office.lng !== null && office.lat !== undefined && office.lng !== undefined,
  )

  console.log("Offices passed to map:", offices)
  console.log("Offices with coordinates:", officesWithCoordinates)

  // If no offices have coordinates, show a simple default map of India
  if (officesWithCoordinates.length === 0) {
    const defaultMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.748496318741!2d77.09210187573463!3d28.517213675727895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1c152c3bc7c5%3A0x59c48cd3e6354a91!2sSkynet%20WorldWide%20Express!5e0!3m2!1sen!2sin!4v1752452936179!5m2!1sen!2sin`
    return (
      <Card className={`p-0 overflow-hidden border-0 shadow-sm ${className}`}>
        <div className="relative">
          <iframe
            width="100%"
            height={height}
            style={{ border: 0, minHeight: height }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={defaultMapUrl}
            title="India Map - Office Locations"
            className="w-full rounded-lg"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
            <p className="text-xs font-light text-gray-800">Skynet India Locations</p>
          </div>
        </div>
      </Card>
    )
  }
  // Commented out dynamic maps
  // Calculate center point for the map (average of all coordinates)
  // const centerLat =
  //   officesWithCoordinates.reduce((sum, office) => sum + (office.lat || 0), 0) / officesWithCoordinates.length
  // const centerLng =
  //   officesWithCoordinates.reduce((sum, office) => sum + (office.lng || 0), 0) / officesWithCoordinates.length

  // // Use a reliable Google Maps embed URL
  // const mapUrl = `https://www.google.com/maps?q=${centerLat},${centerLng}&z=6&output=embed`

  // return (
  //   <Card className={`p-0 overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow ${className}`}>
  //     <div className="relative group">
  //       <iframe
  //         width="100%"
  //         height={height}
  //         style={{ border: 0, minHeight: height, display: "block" }}
  //         loading="lazy"
  //         allowFullScreen
  //         referrerPolicy="no-referrer-when-downgrade"
  //         src={mapUrl}
  //         title="Skynet Office Locations"
  //         className="w-full rounded-lg"
  //       />

  //       {/* Office count overlay */}
  //       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
  //         <p className="text-xs font-light text-gray-800">
  //           {officesWithCoordinates.length} office
  //           {officesWithCoordinates.length !== 1 ? "s" : ""} shown
  //         </p>
  //       </div>

  //       {/* Open in Google Maps overlay */}
  //       <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors rounded-lg">
  //         <a
  //           href={`https://www.google.com/maps?q=${centerLat},${centerLng}&z=6`}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/90"
  //           aria-label="Open office locations in Google Maps"
  //         >
  //           View in Maps
  //         </a>
  //       </div>
  //     </div>
  //   </Card>
  // )
}
