"use client"

import { motion } from "framer-motion"

export default function DelhiHubMap() {
  const destinations = [
    { angle: 0, label: "North" },
    { angle: 45, label: "Northeast" },
    { angle: 90, label: "East" },
    { angle: 135, label: "Southeast" },
    { angle: 180, label: "South" },
    { angle: 225, label: "Southwest" },
    { angle: 270, label: "West" },
    { angle: 315, label: "Northwest" },
  ]

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="hubGlow">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* India outline - simplified */}
      <motion.path
        d="M 80,40 L 90,35 L 100,40 L 110,50 L 115,70 L 110,90 L 100,100 L 90,105 L 80,100 L 70,90 L 65,70 L 70,50 Z"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
        opacity="0.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Delhi location marker */}
      <g transform="translate(100, 100)">
        {/* Glow effect */}
        <circle r="30" fill="url(#hubGlow)" />

        {/* Map pin */}
        <motion.g
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        >
          <path
            d="M 0,-20 C -10,-20 -18,-12 -18,-2 C -18,8 0,25 0,25 C 0,25 18,8 18,-2 C 18,-12 10,-20 0,-20 Z"
            fill="hsl(var(--primary))"
            stroke="none"
          />
          <circle cx="0" cy="-10" r="6" fill="hsl(var(--background))" />
          <circle cx="0" cy="-10" r="3" fill="hsl(var(--primary))" />
        </motion.g>

        {/* Radiating arrows */}
        {destinations.map((dest, i) => {
          const radian = (dest.angle * Math.PI) / 180
          const x1 = 25 * Math.cos(radian)
          const y1 = 25 * Math.sin(radian)
          const x2 = 60 * Math.cos(radian)
          const y2 = 60 * Math.sin(radian)
          const arrowX = 55 * Math.cos(radian)
          const arrowY = 55 * Math.sin(radian)

          return (
            <motion.g
              key={dest.angle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              {/* Arrow line */}
              <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--primary))"
                strokeWidth="0.8"
                opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 1 + i * 0.1,
                  ease: "easeOut",
                }}
              />

              {/* Arrowhead */}
              <motion.path
                d={`M ${arrowX},${arrowY} L ${arrowX - 3 * Math.cos(radian - Math.PI / 6)},${arrowY - 3 * Math.sin(radian - Math.PI / 6)} M ${arrowX},${arrowY} L ${arrowX - 3 * Math.cos(radian + Math.PI / 6)},${arrowY - 3 * Math.sin(radian + Math.PI / 6)}`}
                stroke="hsl(var(--primary))"
                strokeWidth="0.8"
                opacity="0.4"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1.5 + i * 0.1 }}
              />
            </motion.g>
          )
        })}

        {/* Pulse effect */}
        {[1, 2, 3].map((ring) => (
          <motion.circle
            key={ring}
            r="20"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{
              scale: 1 + ring * 0.5,
              opacity: 0,
            }}
            transition={{
              duration: 3,
              delay: ring * 0.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Delhi label */}
        <motion.text
          y="35"
          textAnchor="middle"
          className="text-sm font-light fill-current"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Delhi Hub
        </motion.text>
      </g>
    </svg>
  )
}
