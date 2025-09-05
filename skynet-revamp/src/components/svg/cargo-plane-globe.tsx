"use client"

import { motion } from "framer-motion"

export default function CargoPlaneGlobe() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="globeGradient">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
        </radialGradient>
      </defs>

      {/* Background sky effect */}
      <rect x="0" y="0" width="400" height="300" fill="url(#skyGradient)" />

      {/* Globe */}
      <g transform="translate(200, 180)">
        {/* Globe background */}
        <circle r="100" fill="url(#globeGradient)" />
        {/* Globe outline */}
        <motion.circle
          r="100"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        {/* Latitude lines */}
        <motion.path
          d="M -100,0 Q 0,-30 100,0"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.4"
          opacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.path
          d="M -100,0 Q 0,30 100,0"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.4"
          opacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
        />
        {/* Longitude lines */}
        <motion.ellipse
          cx="0"
          cy="0"
          rx="40"
          ry="100"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.4"
          opacity="0.2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
        {/* Connection lines between hubs */}
        <g className="opacity-40">
          {/* Delhi to Dubai */}
          <motion.path
            d="M 20,-10 Q 0,-20 -30,-15"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.6"
            strokeDasharray="2 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 1,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
          {/* Delhi to Singapore */}
          <motion.path
            d="M 20,-10 Q 40,10 30,40"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.6"
            strokeDasharray="2 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 1.2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
          {/* Delhi to London */}
          <motion.path
            d="M 20,-10 Q -20,-40 -60,-30"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.6"
            strokeDasharray="2 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 1.4,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
          {/* Delhi to Sydney */}
          <motion.path
            d="M 20,-10 Q 50,30 40,60"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.6"
            strokeDasharray="2 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 1.6,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </g>
        {/* Hub dots */}
        <circle cx="20" cy="-10" r="3" fill="hsl(var(--primary))" opacity="0.8" /> {/* Delhi */}
        <circle cx="-30" cy="-15" r="2" fill="hsl(var(--primary))" opacity="0.6" /> {/* Dubai */}
        <circle cx="30" cy="40" r="2" fill="hsl(var(--primary))" opacity="0.6" /> {/* Singapore */}
        <circle cx="-60" cy="-30" r="2" fill="hsl(var(--primary))" opacity="0.6" /> {/* London */}
        <circle cx="40" cy="60" r="2" fill="hsl(var(--primary))" opacity="0.6" /> {/* Sydney */}
      </g>

      {/* Cargo Plane */}
      <motion.g
        initial={{ x: 50, y: 50 }}
        animate={{ x: 300, y: 80 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {/* Plane shadow */}
        <ellipse cx="5" cy="15" rx="15" ry="3" fill="hsl(var(--primary))" opacity="0.1" />

        {/* Plane body */}
        <path
          d="M 0,0 L 30,0 L 35,3 L 35,5 L 30,8 L 0,8 L -5,4 Z"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
        />

        {/* Wings */}
        <path
          d="M 10,-5 L 25,-3 L 25,0 L 10,2 Z"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="0.6"
        />
        <path
          d="M 10,8 L 25,10 L 25,13 L 10,11 Z"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="0.6"
        />

        {/* Tail */}
        <path
          d="M -5,2 L 0,-2 L 5,0 L 5,8 L 0,10 L -5,6 Z"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="0.6"
        />

        {/* Skynet logo hint */}
        <text x="15" y="5" className="text-[4px] fill-primary font-medium">
          S
        </text>
      </motion.g>

      {/* Trail effect */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.line
          x1="50"
          y1="50"
          x2="300"
          y2="80"
          stroke="hsl(var(--primary))"
          strokeWidth="0.3"
          strokeDasharray="1 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.g>
    </svg>
  )
}
