"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const locations = [
  { name: "North America", x: "20%", y: "30%", deliveryTime: "3-5 days" },
  { name: "South America", x: "30%", y: "65%", deliveryTime: "4-6 days" },
  { name: "Europe", x: "50%", y: "25%", deliveryTime: "2-4 days" },
  { name: "Africa", x: "50%", y: "50%", deliveryTime: "4-6 days" },
  { name: "Asia", x: "70%", y: "30%", deliveryTime: "1-3 days" },
  { name: "Oceania", x: "85%", y: "65%", deliveryTime: "3-5 days" },
]

export default function WorldMapClean() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black rounded-3xl overflow-hidden">
      <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* World map continents - simplified but recognizable shapes */}
        <g className="continents">
          {/* North America */}
          <path
            d="M 100 80 C 100 80, 140 70, 180 75 C 220 80, 250 85, 270 100 C 290 115, 295 130, 285 150 C 275 170, 260 185, 240 195 C 220 205, 200 210, 180 205 C 160 200, 140 190, 125 175 C 110 160, 95 145, 90 125 C 85 105, 85 90, 100 80 Z M 190 60 L 210 55 L 220 65 L 215 75 L 200 78 L 190 70 Z M 70 100 L 90 95 L 100 105 L 95 115 L 75 118 L 65 110 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* South America */}
          <path
            d="M 260 280 C 265 270, 275 265, 285 270 C 295 275, 305 285, 310 300 C 315 315, 318 335, 315 355 C 312 375, 305 395, 295 405 C 285 415, 270 420, 255 415 C 240 410, 230 395, 225 375 C 220 355, 218 335, 225 315 C 232 295, 245 285, 260 280 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Europe */}
          <path
            d="M 450 100 C 460 95, 475 92, 490 95 C 505 98, 520 105, 530 115 C 540 125, 545 135, 540 145 C 535 155, 525 160, 510 162 C 495 164, 480 162, 465 155 C 450 148, 440 138, 435 125 C 430 112, 435 105, 450 100 Z M 470 85 L 480 80 L 485 88 L 478 92 L 468 90 Z M 500 90 L 510 85 L 515 93 L 508 97 L 498 95 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Africa */}
          <path
            d="M 480 170 C 490 165, 505 163, 520 168 C 535 173, 545 182, 550 195 C 555 208, 555 225, 550 245 C 545 265, 535 285, 520 300 C 505 315, 485 325, 465 320 C 445 315, 430 300, 420 280 C 410 260, 405 235, 410 210 C 415 185, 430 170, 450 165 C 460 162, 470 165, 480 170 Z M 510 325 L 525 335 L 520 350 L 505 345 L 503 330 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Asia */}
          <path
            d="M 580 90 C 600 85, 640 82, 680 88 C 720 94, 760 105, 780 125 C 800 145, 805 170, 795 190 C 785 210, 760 225, 730 230 C 700 235, 665 232, 635 220 C 605 208, 580 190, 570 165 C 560 140, 560 115, 575 95 C 575 92, 577 91, 580 90 Z M 600 75 L 620 70 L 630 80 L 625 90 L 605 93 L 595 83 Z M 700 160 L 730 155 L 750 165 L 745 185 L 730 195 L 710 190 L 695 175 L 698 162 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Australia */}
          <path
            d="M 760 300 C 780 295, 810 298, 830 308 C 850 318, 860 332, 855 348 C 850 364, 835 375, 815 380 C 795 385, 770 382, 750 372 C 730 362, 715 348, 710 332 C 705 316, 710 305, 725 300 C 740 295, 750 297, 760 300 Z"
            fill="currentColor"
            className="text-gray-200 dark:text-gray-800"
            stroke="currentColor"
            strokeWidth="1"
          />

          {/* Additional islands */}
          <circle cx="870" cy="340" r="10" fill="currentColor" className="text-gray-200 dark:text-gray-800" />
          <circle cx="890" cy="355" r="8" fill="currentColor" className="text-gray-200 dark:text-gray-800" />
          <circle cx="650" cy="250" r="6" fill="currentColor" className="text-gray-200 dark:text-gray-800" />
          <circle cx="670" cy="260" r="8" fill="currentColor" className="text-gray-200 dark:text-gray-800" />
          <circle cx="520" cy="110" r="5" fill="currentColor" className="text-gray-200 dark:text-gray-800" />
        </g>

        {/* Delhi Hub - Main Location */}
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <motion.circle
            cx="680"
            cy="160"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <circle cx="680" cy="160" r="12" fill="currentColor" className="text-primary" />
          <circle cx="680" cy="160" r="6" fill="white" className="dark:fill-black" />
          <text x="680" y="185" textAnchor="middle" className="text-sm font-medium fill-current">
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
                y1="160"
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3,3"
                className="text-primary/40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
              />

              {/* Location marker with pulse */}
              <motion.circle
                cx={x}
                cy={y}
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <circle cx={x} cy={y} r="8" fill="currentColor" className="text-primary" />
              <circle cx={x} cy={y} r="4" fill="white" className="dark:fill-black" />

              {/* Hover tooltip */}
              {hoveredLocation === location.name && (
                <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <rect
                    x={x - 70}
                    y={y - 45}
                    width="140"
                    height="35"
                    rx="6"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-gray-300 dark:text-gray-700 dark:fill-gray-950"
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                  />
                  <text x={x} y={y - 25} textAnchor="middle" className="text-sm font-medium fill-current">
                    {location.name}
                  </text>
                  <text x={x} y={y - 10} textAnchor="middle" className="text-xs fill-primary">
                    {location.deliveryTime}
                  </text>
                </motion.g>
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
            <div className="w-6 h-0 border-t-2 border-dashed border-primary/50" />
            <span>Delivery Routes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
