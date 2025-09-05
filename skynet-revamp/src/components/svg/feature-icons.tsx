"use client"

import { motion } from "framer-motion"

interface IconProps {
  className?: string
}

export function GlobalNetworkFeatureIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 60 60" className={`w-full h-full ${className}`}>
      {/* Globe with interconnected nodes */}
      <motion.circle
        cx="30"
        cy="30"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Network nodes */}
      {[
        { x: 30, y: 8, size: 3 },
        { x: 48, y: 20, size: 2.5 },
        { x: 45, y: 40, size: 2.5 },
        { x: 30, y: 52, size: 2.5 },
        { x: 15, y: 40, size: 2.5 },
        { x: 12, y: 20, size: 2.5 },
      ].map((node, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={node.size}
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
          {/* Connection lines */}
          {i > 0 && (
            <motion.line
              x1={30}
              y1={30}
              x2={node.x}
              y2={node.y}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            />
          )}
        </motion.g>
      ))}

      {/* Center hub */}
      <motion.circle
        cx="30"
        cy="30"
        r="4"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      />
    </svg>
  )
}

export function DelhiBasedIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 60 60" className={`w-full h-full ${className}`}>
      {/* Map pin */}
      <motion.path
        d="M 30,10 C 20,10 12,18 12,28 C 12,38 30,50 30,50 C 30,50 48,38 48,28 C 48,18 40,10 30,10 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Inner circle */}
      <motion.circle
        cx="30"
        cy="25"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      />

      {/* Center dot */}
      <motion.circle
        cx="30"
        cy="25"
        r="3"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
      />

      {/* India flag hint */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <line x1="27" y1="23" x2="33" y2="23" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        <circle cx="30" cy="25" r="1" fill="currentColor" opacity="0.5" />
        <line x1="27" y1="27" x2="33" y2="27" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      </motion.g>
    </svg>
  )
}

export function CustomizedSolutionsIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 60 60" className={`w-full h-full ${className}`}>
      {/* Puzzle pieces */}
      <motion.g>
        {/* Main piece */}
        <motion.path
          d="M 15,20 L 25,20 L 25,15 Q 30,15 30,20 L 30,25 L 35,25 L 35,35 L 30,35 Q 30,40 25,40 L 25,35 L 15,35 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
        />

        {/* Connecting piece */}
        <motion.path
          d="M 35,25 L 45,25 L 45,35 L 40,35 L 40,40 Q 35,40 35,35 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />
      </motion.g>

      {/* Gears for customization */}
      <motion.g
        transform="translate(40, 20)"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="0" cy="0" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180
          return (
            <line
              key={i}
              x1={3 * Math.cos(angle)}
              y1={3 * Math.sin(angle)}
              x2={5 * Math.cos(angle)}
              y2={5 * Math.sin(angle)}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
            />
          )
        })}
      </motion.g>
    </svg>
  )
}

export function TimelyDeliveryIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 60 60" className={`w-full h-full ${className}`}>
      {/* Clock face */}
      <motion.circle
        cx="30"
        cy="30"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Clock hands */}
      <motion.line
        x1="30"
        y1="30"
        x2="30"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ rotate: -90 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ transformOrigin: "30px 30px" }}
      />
      <motion.line
        x1="30"
        y1="30"
        x2="40"
        y2="30"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        initial={{ rotate: 0 }}
        animate={{ rotate: 90 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        style={{ transformOrigin: "30px 30px" }}
      />

      {/* Center dot */}
      <circle cx="30" cy="30" r="2" fill="currentColor" />

      {/* Speed lines */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <motion.path
          d="M 45,30 L 50,30"
          stroke="currentColor"
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d="M 43,20 L 47,16"
          stroke="currentColor"
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        <motion.path
          d="M 43,40 L 47,44"
          stroke="currentColor"
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      </motion.g>

      {/* Checkmark for delivery */}
      <motion.path
        d="M 48,28 L 50,30 L 54,26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      />
    </svg>
  )
}
