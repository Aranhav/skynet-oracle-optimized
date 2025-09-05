"use client"

import { motion } from "framer-motion"

interface ValueIllustrationProps {
  value: "reliability" | "efficiency" | "customer-focus" | "global-reach"
}

export function ValueIllustration({ value }: ValueIllustrationProps) {
  switch (value) {
    case "reliability":
      return <ReliabilityGraphic />
    case "efficiency":
      return <EfficiencyGraphic />
    case "customer-focus":
      return <CustomerFocusGraphic />
    case "global-reach":
      return <GlobalReachGraphic />
    default:
      return null
  }
}

function ReliabilityGraphic() {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* Shield shape representing trust and reliability */}
      <motion.path
        d="M 100,20 L 140,40 L 140,80 Q 140,110 100,130 Q 60,110 60,80 L 60,40 Z"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
      />

      {/* Inner check mark */}
      <motion.path
        d="M 80,70 L 95,85 L 120,60"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      />

      {/* Radiating lines for trust */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const radian = angle * (Math.PI / 180)
        const x1 = 100 + 60 * Math.cos(radian)
        const y1 = 75 + 60 * Math.sin(radian)
        const x2 = 100 + 70 * Math.cos(radian)
        const y2 = 75 + 70 * Math.sin(radian)

        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ delay: 1.5 + i * 0.05 }}
          />
        )
      })}
    </svg>
  )
}

function EfficiencyGraphic() {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* Speed lines converging to a point */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.line
          key={i}
          x1={20 + i * 20}
          y1="120"
          x2="160"
          y2="40"
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{
            delay: i * 0.1,
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1],
          }}
        />
      ))}

      {/* Arrow shape */}
      <motion.path
        d="M 40,90 L 100,30 L 90,35 M 100,30 L 95,40"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />

      {/* Efficiency particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.circle
          key={i}
          r="2"
          fill="hsl(var(--primary))"
          initial={{ x: 40, y: 90, opacity: 0 }}
          animate={{
            x: 100 + i * 5,
            y: 30 + i * 3,
            opacity: [0, 1, 0],
          }}
          transition={{
            delay: 1 + i * 0.1,
            duration: 1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </svg>
  )
}

function CustomerFocusGraphic() {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* Central circle representing customer */}
      <motion.circle
        cx="100"
        cy="75"
        r="20"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      />

      {/* Surrounding service elements */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = i * 60 * (Math.PI / 180)
        const x = 100 + 50 * Math.cos(angle)
        const y = 75 + 50 * Math.sin(angle)

        return (
          <motion.g key={i}>
            <motion.line
              x1="100"
              y1="75"
              x2={x}
              y2={y}
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
            <motion.circle
              cx={x}
              cy={y}
              r="8"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            />
          </motion.g>
        )
      })}

      {/* Pulse effect from center */}
      {[1, 2].map((ring) => (
        <motion.circle
          key={ring}
          cx="100"
          cy="75"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.3"
          initial={{ r: 20, opacity: 0.6 }}
          animate={{ r: 30 + ring * 15, opacity: 0 }}
          transition={{
            duration: 2,
            delay: ring * 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </svg>
  )
}

function GlobalReachGraphic() {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* Globe with network connections */}
      <motion.ellipse
        cx="100"
        cy="75"
        rx="60"
        ry="40"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Latitude lines */}
      <motion.path
        d="M 40,75 Q 100,50 160,75"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.path
        d="M 40,75 Q 100,100 160,75"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.6 }}
      />

      {/* Longitude line */}
      <motion.line
        x1="100"
        y1="35"
        x2="100"
        y2="115"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.7 }}
      />

      {/* Network nodes around the globe */}
      {[
        { x: 70, y: 50 },
        { x: 130, y: 50 },
        { x: 50, y: 75 },
        { x: 150, y: 75 },
        { x: 70, y: 100 },
        { x: 130, y: 100 },
        { x: 100, y: 40 },
        { x: 100, y: 110 },
      ].map((node, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="3"
            fill="hsl(var(--primary))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
          />
          {/* Connection lines */}
          {i > 0 && i % 2 === 0 && (
            <motion.line
              x1={node.x}
              y1={node.y}
              x2={100}
              y2={75}
              stroke="hsl(var(--primary))"
              strokeWidth="0.3"
              strokeDasharray="1 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.5 + i * 0.05 }}
            />
          )}
        </motion.g>
      ))}
    </svg>
  )
}
