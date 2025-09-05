"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface DeliveryRoute {
  id: string
  destination: string
  x: number
  y: number
  deliveryTime: string
}

const deliveryRoutes: DeliveryRoute[] = [
  {
    id: "dubai",
    destination: "Dubai",
    x: 62,
    y: 38,
    deliveryTime: "24-48 hrs",
  },
  {
    id: "singapore",
    destination: "Singapore",
    x: 82,
    y: 52,
    deliveryTime: "48-72 hrs",
  },
  {
    id: "hongkong",
    destination: "Hong Kong",
    x: 84,
    y: 37,
    deliveryTime: "48-72 hrs",
  },
  {
    id: "london",
    destination: "London",
    x: 50,
    y: 23,
    deliveryTime: "48-72 hrs",
  },
  {
    id: "sydney",
    destination: "Sydney",
    x: 88,
    y: 65,
    deliveryTime: "72-96 hrs",
  },
  {
    id: "paris",
    destination: "Paris",
    x: 52,
    y: 25,
    deliveryTime: "48-72 hrs",
  },
  {
    id: "newyork",
    destination: "New York",
    x: 25,
    y: 28,
    deliveryTime: "72-96 hrs",
  },
  {
    id: "tokyo",
    destination: "Tokyo",
    x: 87,
    y: 32,
    deliveryTime: "48-72 hrs",
  },
]

export default function InteractiveWorldMap() {
  const [activeRoute, setActiveRoute] = useState<string | null>(null)
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null)

  // Delhi hub coordinates
  const delhiX = 73
  const delhiY = 35

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 100 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="interactiveHubGlow">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* World Map Background */}
        <g className="opacity-10">
          {/* Continents - same as before */}
          <path
            d="M 48,20 L 50,18 L 53,19 L 55,18 L 56,20 L 55,22 L 53,23 L 52,25 L 50,24 L 48,22 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M 52,26 L 54,27 L 55,30 L 56,35 L 55,40 L 54,43 L 52,45 L 50,44 L 48,42 L 47,38 L 48,35 L 49,30 L 50,27 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M 56,18 L 65,16 L 75,15 L 85,17 L 90,20 L 88,25 L 85,30 L 82,35 L 78,37 L 75,38 L 70,36 L 65,34 L 60,32 L 58,28 L 57,24 L 58,20 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M 84,58 L 90,57 L 93,60 L 92,65 L 88,67 L 84,66 L 82,63 L 83,60 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M 15,18 L 25,15 L 35,16 L 38,20 L 36,25 L 35,30 L 32,32 L 28,30 L 25,28 L 20,25 L 18,22 L 16,20 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </g>

        {/* Connection lines - animated based on hover */}
        <g>
          {deliveryRoutes.map((route) => (
            <motion.line
              key={route.id}
              x1={delhiX}
              y1={delhiY}
              x2={route.x}
              y2={route.y}
              stroke="hsl(var(--primary))"
              strokeWidth={hoveredRoute === route.id ? "1.5" : "0.8"}
              opacity={hoveredRoute === route.id ? 0.8 : 0.2}
              strokeDasharray={hoveredRoute === route.id ? "0" : "2 3"}
              animate={{
                opacity: hoveredRoute === route.id ? 0.8 : 0.2,
                strokeWidth: hoveredRoute === route.id ? 1.5 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </g>

        {/* Delhi Hub */}
        <g filter="url(#glow)">
          <circle cx={delhiX} cy={delhiY} r="10" fill="url(#interactiveHubGlow)" />
          <motion.circle
            cx={delhiX}
            cy={delhiY}
            r="4"
            fill="hsl(var(--primary))"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <text x={delhiX} y={delhiY - 8} textAnchor="middle" className="text-[4px] font-medium fill-current">
            Delhi Hub
          </text>
        </g>

        {/* Destination nodes */}
        {deliveryRoutes.map((route) => (
          <motion.g
            key={route.id}
            onMouseEnter={() => setHoveredRoute(route.id)}
            onMouseLeave={() => setHoveredRoute(null)}
            onClick={() => setActiveRoute(route.id)}
            className="cursor-pointer"
            whileHover={{ scale: 1.2 }}
          >
            <circle
              cx={route.x}
              cy={route.y}
              r={hoveredRoute === route.id ? 4 : 3}
              fill={hoveredRoute === route.id ? "hsl(var(--primary))" : "hsl(var(--background))"}
              stroke="hsl(var(--primary))"
              strokeWidth="1"
            />

            {/* Hover ring effect */}
            <AnimatePresence>
              {hoveredRoute === route.id && (
                <motion.circle
                  cx={route.x}
                  cy={route.y}
                  r="8"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.5 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </motion.g>
        ))}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredRoute && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-white dark:bg-gray-900 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            style={{
              left: `${deliveryRoutes.find((r) => r.id === hoveredRoute)!.x}%`,
              top: `${deliveryRoutes.find((r) => r.id === hoveredRoute)!.y}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="text-sm font-medium text-foreground">
              Delhi → {deliveryRoutes.find((r) => r.id === hoveredRoute)!.destination}
            </div>
            <div className="text-lg font-light text-primary">
              {deliveryRoutes.find((r) => r.id === hoveredRoute)!.deliveryTime}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-900"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
