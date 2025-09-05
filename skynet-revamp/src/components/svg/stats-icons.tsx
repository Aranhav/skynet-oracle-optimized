"use client"

import { motion } from "framer-motion"

interface IconProps {
  className?: string
}

export function YearsIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 60 60" className={`w-full h-full ${className}`}>
      {/* Laurel wreath */}
      <motion.g>
        {/* Left side */}
        <motion.path
          d="M 20,40 Q 15,35 15,30 Q 15,25 18,20 Q 20,18 22,20 Q 20,25 20,30 Q 20,35 22,40"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d="M 22,38 Q 18,33 18,28 Q 18,23 20,18"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
        />

        {/* Right side */}
        <motion.path
          d="M 40,40 Q 45,35 45,30 Q 45,25 42,20 Q 40,18 38,20 Q 40,25 40,30 Q 40,35 38,40"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.path
          d="M 38,38 Q 42,33 42,28 Q 42,23 40,18"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </motion.g>

      {/* Medal/Badge in center */}
      <motion.circle
        cx="30"
        cy="28"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      />
      <motion.text
        x="30"
        y="32"
        textAnchor="middle"
        className="text-[8px] font-light fill-current"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        50+
      </motion.text>
    </svg>
  )
}

export function CountriesIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 60 60" className={`w-full h-full ${className}`}>
      {/* Globe with multiple pinpoints */}
      <motion.circle
        cx="30"
        cy="30"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Latitude lines */}
      <motion.path
        d="M 10,30 Q 30,20 50,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3 }}
      />
      <motion.path
        d="M 10,30 Q 30,40 50,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4 }}
      />

      {/* Pin points representing countries */}
      {[
        { x: 30, y: 20 },
        { x: 40, y: 25 },
        { x: 20, y: 25 },
        { x: 35, y: 30 },
        { x: 25, y: 30 },
        { x: 38, y: 35 },
        { x: 22, y: 35 },
        { x: 30, y: 38 },
      ].map((pin, i) => (
        <motion.circle
          key={i}
          cx={pin.x}
          cy={pin.y}
          r="1.5"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 + i * 0.05, type: "spring" }}
        />
      ))}

      {/* Pulse effect */}
      <motion.circle
        cx="30"
        cy="30"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  )
}

export function PincodesIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 60 60" className={`w-full h-full ${className}`}>
      {/* Map with network grid */}
      <motion.g>
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.g key={i}>
            <motion.line
              x1={15 + i * 7.5}
              y1="15"
              x2={15 + i * 7.5}
              y2="45"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
            <motion.line
              x1="15"
              y1={15 + i * 7.5}
              x2="45"
              y2={15 + i * 7.5}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
            />
          </motion.g>
        ))}

        {/* Network nodes at intersections */}
        {Array.from({ length: 16 }).map((_, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          return (
            <motion.circle
              key={i}
              cx={19.5 + col * 7.5}
              cy={19.5 + row * 7.5}
              r="1"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.03, type: "spring" }}
            />
          )
        })}
      </motion.g>

      {/* Map outline */}
      <motion.rect
        x="15"
        y="15"
        width="30"
        height="30"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />
    </svg>
  )
}

export function SupportIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 60 60" className={`w-full h-full ${className}`}>
      {/* 24/7 representation */}
      <motion.g>
        {/* Clock circle */}
        <motion.circle
          cx="30"
          cy="30"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />

        {/* 24/7 text */}
        <motion.text
          x="30"
          y="28"
          textAnchor="middle"
          className="text-[10px] font-light fill-current"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          24/7
        </motion.text>

        {/* Support headset */}
        <motion.g transform="translate(30, 35)">
          <motion.path
            d="M -6,0 Q -6,-4 -4,-6 Q 0,-8 4,-6 Q 6,-4 6,0"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8 }}
          />
          <motion.circle
            cx="-5"
            cy="1"
            r="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          />
          <motion.circle
            cx="5"
            cy="1"
            r="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.1 }}
          />
        </motion.g>

        {/* Rotating indicator */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "30px 30px" }}
        >
          <circle cx="30" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
        </motion.g>
      </motion.g>
    </svg>
  )
}
