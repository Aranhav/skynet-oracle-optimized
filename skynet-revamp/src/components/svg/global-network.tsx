"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

interface NetworkNode {
  id: string
  x: number
  y: number
  label: string
  isHub?: boolean
}

// Accurate geographic coordinates mapped to SVG viewBox
const networkNodes: NetworkNode[] = [
  // Main Hub
  { id: "delhi", x: 73, y: 35, label: "Delhi", isHub: true },

  // Key Destinations with proper geographic positions
  { id: "dubai", x: 62, y: 38, label: "Dubai" },
  { id: "singapore", x: 82, y: 52, label: "Singapore" },
  { id: "hongkong", x: 84, y: 37, label: "Hong Kong" },
  { id: "uk", x: 50, y: 23, label: "London" },
  { id: "australia", x: 88, y: 65, label: "Sydney" },
  { id: "europe", x: 52, y: 25, label: "Paris" },
]

export default function GlobalNetworkSVG() {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById("network-svg")?.getBoundingClientRect()
      if (rect) {
        mouseX.set(((e.clientX - rect.left) / rect.width) * 100)
        mouseY.set(((e.clientY - rect.top) / rect.height) * 100)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const parallaxX = useTransform(mouseX, [0, 100], [-2, 2])
  const parallaxY = useTransform(mouseY, [0, 100], [-2, 2])

  return (
    <div className="relative w-full h-full">
      <svg id="network-svg" viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* World Map Continents - Ultra thin design */}
        <g className="opacity-15">
          {/* Europe */}
          <motion.path
            d="M 48,20 L 50,18 L 53,19 L 55,18 L 56,20 L 55,22 L 53,23 L 52,25 L 50,24 L 48,22 Z
               M 51,23 L 52,24 L 51,26 L 50,25 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Africa */}
          <motion.path
            d="M 52,26 L 54,27 L 55,30 L 56,35 L 55,40 L 54,43 L 52,45 L 50,44 L 48,42 L 47,38 L 48,35 L 49,30 L 50,27 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
          />

          {/* Asia */}
          <motion.path
            d="M 56,18 L 65,16 L 75,15 L 85,17 L 90,20 L 88,25 L 85,30 L 82,35 L 78,37 L 75,38 L 70,36 L 65,34 L 60,32 L 58,28 L 57,24 L 58,20 Z
               M 73,32 L 75,34 L 73,36 L 71,35 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
          />

          {/* Southeast Asia / Indonesia */}
          <motion.path
            d="M 78,40 L 82,42 L 85,45 L 84,48 L 82,50 L 80,48 L 78,45 L 78,42 Z
               M 86,48 L 88,50 L 86,52 L 84,50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />

          {/* Australia */}
          <motion.path
            d="M 84,58 L 90,57 L 93,60 L 92,65 L 88,67 L 84,66 L 82,63 L 83,60 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
          />

          {/* North America */}
          <motion.path
            d="M 15,18 L 25,15 L 35,16 L 38,20 L 36,25 L 35,30 L 32,32 L 28,30 L 25,28 L 20,25 L 18,22 L 16,20 Z
               M 10,20 L 12,18 L 14,20 L 12,22 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.7, ease: "easeInOut" }}
          />

          {/* South America */}
          <motion.path
            d="M 28,35 L 30,38 L 32,42 L 31,48 L 28,52 L 25,54 L 22,52 L 20,48 L 21,42 L 23,38 L 25,35 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          />
        </g>

        {/* Connection lines */}
        <g className="opacity-30">
          {networkNodes.map((node, i) => {
            if (node.isHub || !node.label) return null
            return (
              <motion.line
                key={`line-${node.id}`}
                x1={networkNodes[0].x}
                y1={networkNodes[0].y}
                x2={node.x}
                y2={node.y}
                stroke="url(#lineGradient)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: activeNode === node.id ? 1 : 0.3,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: [0.23, 1, 0.32, 1],
                }}
                style={{
                  x: parallaxX,
                  y: parallaxY,
                }}
              />
            )
          })}
        </g>

        {/* Delhi Hub Special Effects */}
        <g>
          {/* Glow effect behind hub */}
          <circle
            cx={networkNodes[0].x}
            cy={networkNodes[0].y}
            r="5"
            fill="hsl(var(--primary))"
            opacity="0.1"
            filter="blur(4px)"
          />

          {/* Animated pulse rings from Delhi hub */}
          {[1, 2, 3].map((ring) => (
            <motion.circle
              key={`pulse-${ring}`}
              cx={networkNodes[0].x}
              cy={networkNodes[0].y}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.4"
              initial={{ r: 3, opacity: 0.6 }}
              animate={{
                r: 8 + ring * 6,
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
        </g>

        {/* Network nodes */}
        {networkNodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: i * 0.05,
              ease: [0.23, 1, 0.32, 1],
            }}
            onMouseEnter={() => node.label && setActiveNode(node.id)}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            {/* Node circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.isHub ? 3 : node.label ? 2 : 1}
              fill={node.isHub ? "hsl(var(--primary))" : "hsl(var(--background))"}
              stroke={node.isHub ? "none" : "hsl(var(--primary))"}
              strokeWidth="0.5"
              whileHover={{ scale: 1.5 }}
              animate={{
                scale: activeNode === node.id ? 1.3 : 1,
              }}
              style={{
                x: parallaxX,
                y: parallaxY,
              }}
            />

            {/* Node label with background */}
            {node.label && (
              <g>
                {/* Label background for better readability */}
                {(activeNode === node.id || node.isHub) && (
                  <rect
                    x={node.x - 8}
                    y={node.y - 8}
                    width="16"
                    height="5"
                    rx="2"
                    fill="hsl(var(--background))"
                    fillOpacity="0.8"
                    stroke="none"
                  />
                )}
                <motion.text
                  x={node.x}
                  y={node.y - 4.5}
                  textAnchor="middle"
                  className="text-[3.5px] fill-current font-medium select-none"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{
                    opacity: activeNode === node.id || node.isHub ? 1 : 0,
                    y: 0,
                  }}
                  style={{
                    x: parallaxX,
                    y: parallaxY,
                  }}
                >
                  {node.label}
                </motion.text>
              </g>
            )}

            {/* Hover effect ring */}
            {node.label && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={5}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.3"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: activeNode === node.id ? 1 : 0,
                  opacity: activeNode === node.id ? 0.5 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.g>
        ))}

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Connection info tooltip */}
      {activeNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-lg"
        >
          <p className="text-sm font-light">
            <span className="text-primary">Delhi</span> → {networkNodes.find((n) => n.id === activeNode)?.label}
          </p>
        </motion.div>
      )}
    </div>
  )
}
