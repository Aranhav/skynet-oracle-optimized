"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const locations = [
  { name: "North America", cx: 25, cy: 35, deliveryTime: "3-5 days" },
  { name: "South America", cx: 35, cy: 65, deliveryTime: "4-6 days" },
  { name: "Europe", cx: 50, cy: 30, deliveryTime: "2-4 days" },
  { name: "Africa", cx: 50, cy: 55, deliveryTime: "4-6 days" },
  { name: "Asia", cx: 70, cy: 35, deliveryTime: "1-3 days" },
  { name: "Oceania", cx: 85, cy: 65, deliveryTime: "3-5 days" },
]

export default function WorldMapStylized() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950" />

      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-gray-900 dark:text-gray-100" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative w-full h-full flex items-center justify-center p-8">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-w-4xl max-h-[600px]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Stylized world map - simplified continents */}
          <g className="continents" opacity="0.1">
            {/* North America */}
            <path
              d="M 15 30 Q 20 25 25 28 L 30 32 L 28 40 L 20 38 Z"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            />

            {/* South America */}
            <path
              d="M 30 55 L 35 50 L 38 60 L 35 75 L 30 70 L 28 60 Z"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            />

            {/* Europe */}
            <path
              d="M 45 25 L 55 27 L 53 35 L 47 33 L 45 28 Z"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            />

            {/* Africa */}
            <path
              d="M 48 40 L 55 38 L 57 50 L 55 65 L 48 63 L 45 50 L 47 42 Z"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            />

            {/* Asia */}
            <path
              d="M 58 25 L 80 28 L 78 40 L 65 42 L 55 35 L 57 28 Z"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            />

            {/* Australia */}
            <path
              d="M 80 60 L 88 62 L 87 68 L 82 67 L 80 63 Z"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            />
          </g>

          {/* Delhi Hub */}
          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <circle cx="68" cy="32" r="2.5" fill="currentColor" className="text-primary" />
            <circle cx="68" cy="32" r="1.5" fill="white" className="dark:fill-black" />
            <text x="68" y="27" textAnchor="middle" className="text-[3px] font-medium fill-current">
              Delhi Hub
            </text>
          </motion.g>

          {/* Location markers and connections */}
          {locations.map((location, index) => (
            <motion.g
              key={location.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onMouseEnter={() => setHoveredLocation(location.name)}
              onMouseLeave={() => setHoveredLocation(null)}
              className="cursor-pointer"
            >
              {/* Connection path to Delhi */}
              <motion.path
                d={`M 68 32 Q ${68 + (location.cx - 68) / 2} ${Math.min(32, location.cy) - 10} ${location.cx} ${location.cy}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                strokeDasharray="1,1"
                className="text-primary/40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8 + index * 0.15, duration: 1.5 }}
              />

              {/* Location marker */}
              <circle cx={location.cx} cy={location.cy} r="1.5" fill="currentColor" className="text-primary" />
              <circle cx={location.cx} cy={location.cy} r="0.8" fill="white" className="dark:fill-black" />

              {/* Hover tooltip */}
              {hoveredLocation === location.name && (
                <motion.g initial={{ opacity: 0, y: 1 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <rect
                    x={location.cx - 12}
                    y={location.cy - 8}
                    width="24"
                    height="6"
                    rx="1"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="0.2"
                    className="text-gray-300 dark:text-gray-700 dark:fill-gray-950"
                  />
                  <text
                    x={location.cx}
                    y={location.cy - 4.5}
                    textAnchor="middle"
                    className="text-[2.5px] font-medium fill-current"
                  >
                    {location.name}
                  </text>
                  <text x={location.cx} y={location.cy - 2} textAnchor="middle" className="text-[2px] fill-primary">
                    {location.deliveryTime}
                  </text>
                </motion.g>
              )}
            </motion.g>
          ))}

          {/* Animated dots moving along routes */}
          {locations.map((location, index) => (
            <motion.circle
              key={`dot-${location.name}`}
              r="0.3"
              fill="currentColor"
              className="text-primary"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: index * 0.8,
                times: [0, 0.1, 0.9, 1],
              }}
            >
              <animateMotion dur="5s" repeatCount="indefinite" begin={`${index * 0.8}s`}>
                <mpath href={`#path-${location.name}-simple`} />
              </animateMotion>
            </motion.circle>
          ))}

          {/* Hidden paths for animated dots */}
          {locations.map((location) => (
            <path
              key={`path-${location.name}`}
              id={`path-${location.name}-simple`}
              d={`M 68 32 Q ${68 + (location.cx - 68) / 2} ${Math.min(32, location.cy) - 10} ${location.cx} ${location.cy}`}
              fill="none"
              stroke="none"
            />
          ))}
        </svg>

        {/* Stats overlay */}
        <div className="absolute top-4 right-4 space-y-2">
          <motion.div
            className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-3xl font-thin text-primary">209</p>
            <p className="text-xs text-muted-foreground">Countries</p>
          </motion.div>
          <motion.div
            className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-3xl font-thin text-primary">24/7</p>
            <p className="text-xs text-muted-foreground">Support</p>
          </motion.div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
          <p className="text-sm font-medium mb-2">Global Express Network</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0 border-t border-dashed border-primary/50" />
              <span>Routes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
