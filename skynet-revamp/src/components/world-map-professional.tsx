"use client"

import { motion } from "framer-motion"
import { useState } from "react"

// Manually positioned coordinates calibrated to match the SVG map
const locations = [
  // Australia & New Zealand
  { name: "Perth", x: 540, y: 208 },
  { name: "Sydney", x: 594, y: 210 },
  { name: "Melbourne", x: 586, y: 218 },
  { name: "Auckland", x: 638, y: 216 },

  // North America
  { name: "Montreal", x: 184, y: 89 },
  { name: "Vancouver", x: 92, y: 80 },
  { name: "Miami", x: 200, y: 117 },
  { name: "JFK", x: 184, y: 94 },

  // Asia
  { name: "Hong Kong", x: 544, y: 115 },
  { name: "Kuala Lumpur", x: 522, y: 152 },
  { name: "Kathmandu", x: 484, y: 112 },
  { name: "Dhaka", x: 497, y: 118 },
  { name: "Delhi", x: 473, y: 110 },
  { name: "Singapore", x: 527, y: 157 },
  { name: "Bangkok", x: 521, y: 134 },
  { name: "Phnom Penh", x: 530, y: 138 },
  { name: "Taipei", x: 559, y: 117 },
  { name: "Jakarta", x: 533, y: 165 },
  { name: "Brunei", x: 548, y: 151 },
  { name: "Manila", x: 558, y: 134 },
  { name: "Hanoi", x: 532, y: 115 },
  { name: "Shanghai", x: 558, y: 105 },
  { name: "Macao", x: 546, y: 115 },
  { name: "Seoul", x: 566, y: 90 },
  { name: "Tokyo", x: 578, y: 92 },

  // Middle East
  { name: "Riyadh", x: 418, y: 117 },
  { name: "Manama", x: 424, y: 114 },
  { name: "Kuwait City", x: 420, y: 107 },
  { name: "Doha", x: 426, y: 116 },
  { name: "Muscat", x: 441, y: 119 },
  { name: "Beirut", x: 395, y: 96 },
  { name: "Amman", x: 396, y: 101 },
  { name: "Cairo", x: 388, y: 106 },
  { name: "Tehran", x: 426, y: 91 },
  { name: "Tel Aviv", x: 394, y: 101 },

  // Africa
  { name: "Khartoum", x: 391, y: 135 },
  { name: "Johannesburg", x: 384, y: 194 },

  // South Asia
  { name: "Colombo", x: 478, y: 143 },

  // Europe
  { name: "London", x: 350, y: 76 },
  { name: "Amsterdam", x: 355, y: 75 },
  { name: "Berlin", x: 364, y: 75 },
  { name: "Brussels", x: 355, y: 77 },
  { name: "Luxembourg City", x: 356, y: 79 },
  { name: "Paris", x: 352, y: 80 },
  { name: "Vienna", x: 367, y: 80 },
  { name: "Prague", x: 365, y: 78 },
  { name: "Warsaw", x: 372, y: 75 },
  { name: "Budapest", x: 370, y: 82 },
  { name: "Dublin", x: 343, y: 73 },
  { name: "Vilnius", x: 378, y: 70 },
  { name: "Bratislava", x: 368, y: 80 },
  { name: "Riga", x: 377, y: 67 },
  { name: "Tallinn", x: 377, y: 64 },
  { name: "Madrid", x: 345, y: 93 },
  { name: "Stockholm", x: 369, y: 62 },
  { name: "Lisbon", x: 340, y: 94 },
  { name: "Rome", x: 363, y: 93 },
  { name: "Helsinki", x: 378, y: 60 },
  { name: "Sofia", x: 377, y: 92 },
  { name: "Bucharest", x: 380, y: 89 },
  { name: "Athens", x: 377, y: 96 },
  { name: "Zagreb", x: 367, y: 87 },
  { name: "Ljubljana", x: 365, y: 86 },
  { name: "Copenhagen", x: 363, y: 69 },
]

export default function WorldMapProfessional() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black rounded-3xl overflow-hidden p-4">
      <svg viewBox="0 0 701 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Filter to create uniform darker red landmass */}
        <defs>
          <filter id="mapFilter">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.9
                      0 0 0 0 0.7
                      0 0 0 0 0.7
                      0 0 0 1 0"
            />
          </filter>
        </defs>

        {/* World map with cleaner colors - uses original SVG with slight tint */}
        <g opacity="0.85">
          <image
            href="/images/world-map-new.svg"
            x="0"
            y="0"
            width="701"
            height="300"
            filter="url(#mapFilter)"
            className="dark:opacity-0.7"
          />
        </g>

        {/* City dots */}
        {locations.map((location) => (
          <circle
            key={`dot-${location.name}`}
            cx={location.x}
            cy={location.y}
            r="3"
            fill="#ef4444"
            className="opacity-90"
          />
        ))}

        {/* Invisible hover areas over dots */}
        {locations.map((location) => (
          <g key={location.name}>
            <circle
              cx={location.x}
              cy={location.y}
              r="10"
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredLocation(location.name)}
              onMouseLeave={() => setHoveredLocation(null)}
            />

            {/* Hover tooltip */}
            {hoveredLocation === location.name && (
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <rect
                  x={location.x - 40}
                  y={location.y - 30}
                  width="80"
                  height="22"
                  rx="3"
                  fill="white"
                  stroke="#e5e5e5"
                  strokeWidth="0.5"
                  className="dark:fill-gray-900 dark:stroke-gray-700"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                />
                <text
                  x={location.x}
                  y={location.y - 15}
                  textAnchor="middle"
                  className="text-xs font-medium fill-current"
                  style={{ fontSize: "11px" }}
                >
                  {location.name}
                </text>
              </motion.g>
            )}
          </g>
        ))}
      </svg>

      {/* Stats */}
      <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-light text-primary">209</p>
            <p className="text-xs text-muted-foreground">Countries</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-light text-primary">24/7</p>
            <p className="text-xs text-muted-foreground">Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
