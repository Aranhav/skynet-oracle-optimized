"use client"

import { motion } from "framer-motion"

interface StatsBackgroundProps {
  variant: "years" | "countries" | "pincodes" | "support"
}

export function StatsBackground({ variant }: StatsBackgroundProps) {
  switch (variant) {
    case "years":
      return <YearsGraphic />
    case "countries":
      return <CountriesGraphic />
    case "pincodes":
      return <PincodesGraphic />
    case "support":
      return <SupportGraphic />
    default:
      return null
  }
}

function YearsGraphic() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-10">
      {/* Timeline visualization */}
      <motion.line
        x1="10"
        y1="50"
        x2="90"
        y2="50"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Year markers */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.g key={i}>
          <motion.line
            x1={20 + i * 15}
            y1="45"
            x2={20 + i * 15}
            y2="55"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
          <motion.circle
            cx={20 + i * 15}
            cy="50"
            r="2"
            fill="hsl(var(--primary))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          />
        </motion.g>
      ))}
    </svg>
  )
}

function CountriesGraphic() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-10">
      {/* World dots pattern */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = 10 + (i % 6) * 15 + Math.random() * 5
        const y = 20 + Math.floor(i / 6) * 12 + Math.random() * 5

        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="1"
            fill="hsl(var(--primary))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 1],
              opacity: [0, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              delay: i * 0.05,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        )
      })}

      {/* Connection lines */}
      <motion.path
        d="M 20,30 Q 50,20 80,35 T 50,60 Q 20,50 20,30"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="0.3"
        strokeDasharray="2 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </svg>
  )
}

function PincodesGraphic() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-10">
      {/* Grid pattern representing coverage */}
      {Array.from({ length: 25 }).map((_, i) => {
        const row = Math.floor(i / 5)
        const col = i % 5
        const x = 20 + col * 12
        const y = 20 + row * 12

        return (
          <motion.g key={i}>
            <motion.rect
              x={x}
              y={y}
              width="10"
              height="10"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{
                delay: i * 0.02,
                duration: 0.5,
              }}
            />
            <motion.circle
              cx={x + 5}
              cy={y + 5}
              r="1"
              fill="hsl(var(--primary))"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{
                delay: 1 + i * 0.03,
                duration: 0.5,
              }}
            />
          </motion.g>
        )
      })}
    </svg>
  )
}

function SupportGraphic() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-10">
      {/* 24/7 circular clock */}
      <motion.circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
        strokeDasharray="3 2"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x1 = 50 + 25 * Math.cos(angle)
        const y1 = 50 + 25 * Math.sin(angle)
        const x2 = 50 + 28 * Math.cos(angle)
        const y2 = 50 + 28 * Math.sin(angle)

        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: i * 0.05 }}
          />
        )
      })}

      {/* Pulsing center */}
      <motion.circle
        cx="50"
        cy="50"
        r="3"
        fill="hsl(var(--primary))"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </svg>
  )
}
