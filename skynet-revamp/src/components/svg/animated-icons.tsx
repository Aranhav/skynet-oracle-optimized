"use client"

import { motion, Variants } from "framer-motion"

const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.5, ease: [0.23, 1, 0.32, 1] },
  },
}

export function GlobalNetworkIcon() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      {/* Globe outline */}
      <motion.circle
        cx="30"
        cy="30"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        variants={pathVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Latitude lines */}
      <motion.path
        d="M 10,30 Q 30,20 50,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        variants={pathVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      />
      <motion.path
        d="M 10,30 Q 30,40 50,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        variants={pathVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      />

      {/* Connection nodes */}
      {[
        { x: 30, y: 10 },
        { x: 45, y: 25 },
        { x: 15, y: 25 },
        { x: 30, y: 50 },
        { x: 45, y: 35 },
        { x: 15, y: 35 },
      ].map((node, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="2"
            fill="hsl(var(--primary))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
          />
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="4"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 2], opacity: [0.8, 0] }}
            transition={{
              delay: 0.5 + i * 0.1,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </motion.g>
      ))}
    </svg>
  )
}

export function DelhiHubIcon() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      {/* Central hub */}
      <motion.circle
        cx="30"
        cy="30"
        r="4"
        fill="hsl(var(--primary))"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      />

      {/* Radiating connections */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = i * 45 * (Math.PI / 180)
        const x2 = 30 + 20 * Math.cos(angle)
        const y2 = 30 + 20 * Math.sin(angle)

        return (
          <motion.g key={i}>
            <motion.line
              x1="30"
              y1="30"
              x2={x2}
              y2={y2}
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.1 }}
            />
            <motion.circle
              cx={x2}
              cy={y2}
              r="2"
              fill="hsl(var(--background))"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          </motion.g>
        )
      })}

      {/* Pulse effect */}
      {[1, 2].map((ring) => (
        <motion.circle
          key={ring}
          cx="30"
          cy="30"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.3"
          initial={{ r: 4, opacity: 0.6 }}
          animate={{ r: 10 + ring * 5, opacity: 0 }}
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

export function CustomizedSolutionsIcon() {
  const boxVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: (i: number) => ({
      scale: 1,
      rotate: i * 5,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  }

  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      {/* Morphing package shapes */}
      {[
        { x: 20, y: 20, size: 12 },
        { x: 35, y: 15, size: 10 },
        { x: 25, y: 35, size: 14 },
        { x: 40, y: 30, size: 8 },
      ].map((box, i) => (
        <motion.g key={i}>
          <motion.rect
            x={box.x}
            y={box.y}
            width={box.size}
            height={box.size}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.8"
            rx="2"
            custom={i}
            variants={boxVariants}
            initial="initial"
            animate="animate"
          />
          <motion.path
            d={`M ${box.x},${box.y + box.size / 3} L ${box.x + box.size},${box.y + box.size / 3}`}
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        </motion.g>
      ))}

      {/* Connecting lines */}
      <motion.path
        d="M 26,26 L 35,25 L 39,34 L 31,35 Z"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="0.3"
        strokeDasharray="2 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  )
}

export function TimelyDeliveryIcon() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      {/* Clock face */}
      <motion.circle
        cx="30"
        cy="30"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        variants={pathVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Clock markers */}
      {[0, 90, 180, 270].map((angle, i) => {
        const radian = angle * (Math.PI / 180)
        const x1 = 30 + 16 * Math.cos(radian)
        const y1 = 30 + 16 * Math.sin(radian)
        const x2 = 30 + 18 * Math.cos(radian)
        const y2 = 30 + 18 * Math.sin(radian)

        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        )
      })}

      {/* Hour hand */}
      <motion.line
        x1="30"
        y1="30"
        x2="30"
        y2="20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "30px 30px" }}
      />

      {/* Minute hand */}
      <motion.line
        x1="30"
        y1="30"
        x2="30"
        y2="14"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        strokeLinecap="round"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "30px 30px" }}
      />

      {/* Center dot */}
      <circle cx="30" cy="30" r="2" fill="hsl(var(--primary))" />

      {/* Speed lines */}
      {[45, 135, 225, 315].map((angle, i) => {
        const radian = angle * (Math.PI / 180)
        const x = 30 + 25 * Math.cos(radian)
        const y = 30 + 25 * Math.sin(radian)

        return (
          <motion.line
            key={i}
            x1={x}
            y1={y}
            x2={x + 5 * Math.cos(radian)}
            y2={y + 5 * Math.sin(radian)}
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        )
      })}
    </svg>
  )
}
