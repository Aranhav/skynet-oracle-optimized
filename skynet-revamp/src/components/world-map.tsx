"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const continents = {
  northAmerica:
    "M 180,100 Q 160,90 150,100 L 140,110 L 130,120 L 120,140 L 110,160 L 115,170 L 125,175 L 140,170 L 155,165 L 170,155 L 180,140 L 190,130 L 195,115 L 190,105 Z M 155,85 L 160,80 L 165,82 L 162,87 Z",
  southAmerica:
    "M 145,220 L 140,230 L 135,245 L 132,260 L 130,275 L 132,290 L 136,305 L 142,315 L 150,320 L 155,315 L 160,300 L 162,285 L 165,270 L 167,255 L 165,240 L 160,225 L 152,218 Z",
  europe:
    "M 260,110 L 265,105 L 275,103 L 285,105 L 295,110 L 300,115 L 295,120 L 290,125 L 280,127 L 270,125 L 262,120 L 258,115 Z M 272,98 L 275,95 L 278,97 L 275,100 Z",
  africa:
    "M 270,160 L 265,170 L 262,185 L 260,200 L 262,215 L 265,230 L 270,245 L 278,255 L 285,260 L 295,255 L 302,245 L 305,230 L 307,215 L 305,200 L 302,185 L 295,170 L 285,165 L 275,162 Z",
  asia: "M 310,105 L 320,100 L 340,98 L 360,100 L 380,105 L 395,115 L 400,130 L 395,145 L 385,155 L 370,160 L 350,162 L 330,160 L 315,155 L 305,145 L 302,130 L 305,115 Z M 390,110 L 400,108 L 410,110 L 415,120 L 410,130 L 400,132 L 390,130 L 385,120 Z",
  oceania:
    "M 380,250 L 390,248 L 400,250 L 405,260 L 400,270 L 390,272 L 380,270 L 375,260 Z M 410,265 L 415,263 L 420,265 L 422,270 L 420,275 L 415,277 L 410,275 L 408,270 Z",
}

const locations = [
  { name: "North America", x: 155, y: 130, deliveryTime: "3-5 days" },
  { name: "South America", x: 150, y: 265, deliveryTime: "4-6 days" },
  { name: "Europe", x: 280, y: 115, deliveryTime: "2-4 days" },
  { name: "Africa", x: 285, y: 210, deliveryTime: "4-6 days" },
  { name: "Asia", x: 350, y: 130, deliveryTime: "1-3 days" },
  { name: "Oceania", x: 390, y: 260, deliveryTime: "3-5 days" },
]

export default function WorldMap() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black rounded-3xl overflow-hidden p-8">
      <svg viewBox="0 0 500 380" className="w-full h-full" style={{ maxHeight: "600px" }}>
        {/* Grid lines for visual reference */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-200 dark:text-gray-800"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Continent paths */}
        <g className="continents">
          {Object.entries(continents).map(([name, path]) => (
            <motion.path
              key={name}
              d={path}
              fill="currentColor"
              className="text-gray-300 dark:text-gray-700"
              stroke="currentColor"
              strokeWidth="0.5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            />
          ))}
        </g>

        {/* Delhi Hub */}
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <circle cx="335" cy="145" r="8" fill="currentColor" className="text-primary" />
          <circle
            cx="335"
            cy="145"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary animate-pulse"
          />
          <text x="335" y="165" textAnchor="middle" className="text-xs font-medium fill-current">
            Delhi Hub
          </text>
        </motion.g>

        {/* Location markers and connections */}
        {locations.map((location, index) => (
          <motion.g
            key={location.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            onMouseEnter={() => setHoveredLocation(location.name)}
            onMouseLeave={() => setHoveredLocation(null)}
            className="cursor-pointer"
          >
            {/* Connection line to Delhi */}
            <motion.line
              x1="335"
              y1="145"
              x2={location.x}
              y2={location.y}
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="5,5"
              className="text-primary/30"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
            />

            {/* Location marker */}
            <circle cx={location.x} cy={location.y} r="4" fill="currentColor" className="text-primary" />

            {/* Hover tooltip */}
            {hoveredLocation === location.name && (
              <g>
                <rect
                  x={location.x - 60}
                  y={location.y - 35}
                  width="120"
                  height="25"
                  rx="4"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-300 dark:text-gray-700"
                />
                <text
                  x={location.x}
                  y={location.y - 20}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-900"
                >
                  {location.name}
                </text>
                <text x={location.x} y={location.y - 8} textAnchor="middle" className="text-xs fill-primary">
                  {location.deliveryTime}
                </text>
              </g>
            )}
          </motion.g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg p-3">
        <p className="text-xs font-light text-muted-foreground mb-1">Express Delivery from Delhi Hub</p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>Hub Location</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0 border-t border-dashed border-primary/50" />
            <span>Delivery Routes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
