"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const locations = [
  { name: "North America", x: "25%", y: "35%", deliveryTime: "3-5 days" },
  { name: "South America", x: "35%", y: "70%", deliveryTime: "4-6 days" },
  { name: "Europe", x: "52%", y: "30%", deliveryTime: "2-4 days" },
  { name: "Africa", x: "52%", y: "55%", deliveryTime: "4-6 days" },
  { name: "Asia", x: "70%", y: "35%", deliveryTime: "1-3 days" },
  { name: "Oceania", x: "80%", y: "70%", deliveryTime: "3-5 days" },
]

export default function WorldMapSVG() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black rounded-3xl overflow-hidden">
      <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Simplified world map paths */}
        <g className="continents">
          {/* North America */}
          <path
            d="M 150 100 Q 200 80 250 90 L 280 110 L 300 140 L 290 180 L 270 200 L 240 210 L 200 200 L 160 180 L 140 150 L 145 120 Z 
               M 240 70 L 260 65 L 270 75 L 265 85 L 250 88 L 240 80 Z
               M 120 110 L 140 105 L 150 115 L 145 125 L 125 128 L 115 120 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* South America */}
          <path
            d="M 280 250 L 300 240 L 320 250 L 340 270 L 350 300 L 345 340 L 340 380 L 330 410 L 310 420 L 290 415 L 270 400 L 260 370 L 255 340 L 260 300 L 270 270 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Europe */}
          <path
            d="M 480 120 L 520 115 L 560 120 L 580 130 L 575 145 L 560 155 L 540 160 L 520 155 L 500 150 L 485 140 L 480 125 Z
               M 500 105 L 510 100 L 515 108 L 508 112 L 498 110 Z
               M 530 108 L 540 105 L 545 112 L 538 115 L 528 113 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Africa */}
          <path
            d="M 500 180 L 540 175 L 570 185 L 580 210 L 575 250 L 570 290 L 560 330 L 545 360 L 520 370 L 490 365 L 470 350 L 460 320 L 455 280 L 460 240 L 470 200 L 490 185 Z
               M 545 370 L 560 380 L 555 395 L 540 390 L 538 375 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Asia */}
          <path
            d="M 600 120 L 700 115 L 780 125 L 820 140 L 840 170 L 835 200 L 820 220 L 780 230 L 720 225 L 660 220 L 620 200 L 600 170 L 595 140 Z
               M 620 100 L 640 95 L 650 105 L 645 115 L 625 118 L 615 108 Z
               M 730 180 L 760 175 L 780 185 L 775 210 L 760 220 L 740 215 L 725 200 L 728 185 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Australia */}
          <path
            d="M 740 320 L 800 315 L 840 325 L 850 350 L 845 380 L 820 390 L 780 385 L 750 375 L 735 350 L 738 330 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Additional small islands */}
          <circle cx="860" cy="340" r="8" fill="currentColor" className="text-gray-200 dark:text-gray-800" />
          <circle cx="880" cy="350" r="6" fill="currentColor" className="text-gray-200 dark:text-gray-800" />
          <circle cx="670" cy="260" r="5" fill="currentColor" className="text-gray-200 dark:text-gray-800" />
          <circle cx="690" cy="270" r="7" fill="currentColor" className="text-gray-200 dark:text-gray-800" />
        </g>

        {/* Delhi Hub - Main Location */}
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <circle cx="680" cy="180" r="10" fill="currentColor" className="text-primary" />
          <circle
            cx="680"
            cy="180"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary animate-pulse"
          />
          <text x="680" y="205" textAnchor="middle" className="text-sm font-medium fill-current">
            Delhi Hub
          </text>
        </motion.g>

        {/* Location markers and connections */}
        {locations.map((location, index) => {
          const x = parseFloat(location.x) * 10
          const y = parseFloat(location.y) * 5

          return (
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
                x1="680"
                y1="180"
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="5,5"
                className="text-primary/30"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
              />

              {/* Location marker */}
              <circle cx={x} cy={y} r="6" fill="currentColor" className="text-primary" />

              {/* Hover tooltip */}
              {hoveredLocation === location.name && (
                <g>
                  <rect
                    x={x - 70}
                    y={y - 40}
                    width="140"
                    height="30"
                    rx="4"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-gray-300 dark:text-gray-700"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  />
                  <text x={x} y={y - 22} textAnchor="middle" className="text-sm font-medium fill-gray-900">
                    {location.name}
                  </text>
                  <text x={x} y={y - 8} textAnchor="middle" className="text-xs fill-primary">
                    {location.deliveryTime}
                  </text>
                </g>
              )}
            </motion.g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <p className="text-sm font-medium mb-2">Global Express Network</p>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span>Hub Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0 border-t border-dashed border-primary/50" />
            <span>Delivery Routes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
