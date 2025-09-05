"use client"

import React from "react"
import { motion } from "framer-motion"

interface NetworkNode {
  id: string
  name: string
  x: number
  y: number
  isHub?: boolean
}

const WorldMap = () => {
  // Network nodes with proper geographic positioning (scaled to 1200x600 viewBox)
  const nodes: NetworkNode[] = [
    { id: "delhi", name: "Delhi", x: 770, y: 280, isHub: true },
    { id: "dubai", name: "Dubai", x: 700, y: 310 },
    { id: "singapore", name: "Singapore", x: 880, y: 380 },
    { id: "hongkong", name: "Hong Kong", x: 900, y: 300 },
    { id: "london", name: "London", x: 600, y: 200 },
    { id: "sydney", name: "Sydney", x: 1020, y: 480 },
    { id: "frankfurt", name: "Frankfurt", x: 630, y: 195 },
    { id: "paris", name: "Paris", x: 610, y: 205 },
    { id: "newyork", name: "New York", x: 350, y: 250 },
    { id: "losangeles", name: "Los Angeles", x: 250, y: 280 },
    { id: "tokyo", name: "Tokyo", x: 980, y: 270 },
    { id: "johannesburg", name: "Johannesburg", x: 660, y: 470 },
    { id: "cairo", name: "Cairo", x: 680, y: 290 },
    { id: "moscow", name: "Moscow", x: 690, y: 170 },
    { id: "beijing", name: "Beijing", x: 900, y: 250 },
    { id: "mumbai", name: "Mumbai", x: 760, y: 300 },
    { id: "bangalore", name: "Bangalore", x: 770, y: 320 },
    { id: "kolkata", name: "Kolkata", x: 810, y: 290 },
  ]

  const delhiNode = nodes.find((n) => n.id === "delhi")!
  const otherNodes = nodes.filter((n) => n.id !== "delhi")

  // Simplified continent paths
  const continentPaths = {
    // North America
    northAmerica:
      "M 150 180 C 150 150, 200 140, 250 150 L 300 160 L 350 180 L 400 200 L 420 220 L 450 250 L 460 280 L 450 300 L 420 320 L 380 340 L 340 350 L 300 360 L 260 350 L 220 340 L 180 320 L 160 300 L 150 280 L 140 260 L 140 240 L 145 220 L 150 200 L 150 180 Z",

    // South America
    southAmerica:
      "M 340 380 L 360 390 L 380 410 L 390 430 L 395 450 L 390 470 L 380 490 L 360 510 L 340 520 L 320 530 L 300 520 L 280 500 L 270 480 L 265 460 L 270 440 L 280 420 L 300 400 L 320 390 L 340 380 Z",

    // Europe
    europe:
      "M 580 180 L 600 170 L 620 165 L 640 170 L 660 175 L 680 180 L 690 190 L 695 200 L 690 210 L 680 220 L 660 230 L 640 235 L 620 230 L 600 225 L 580 220 L 570 210 L 570 200 L 575 190 L 580 180 Z",

    // Africa
    africa:
      "M 620 280 L 640 270 L 660 270 L 680 280 L 700 290 L 710 310 L 715 330 L 710 350 L 700 370 L 690 390 L 680 410 L 670 430 L 660 450 L 650 470 L 640 480 L 620 485 L 600 480 L 580 470 L 570 450 L 565 430 L 570 410 L 580 390 L 590 370 L 600 350 L 610 330 L 615 310 L 620 290 L 620 280 Z",

    // Asia
    asia: "M 700 180 L 720 170 L 750 160 L 800 155 L 850 160 L 900 170 L 950 180 L 1000 190 L 1020 200 L 1030 220 L 1025 240 L 1010 260 L 990 280 L 960 290 L 920 300 L 880 310 L 840 320 L 800 330 L 760 340 L 720 335 L 700 320 L 690 300 L 685 280 L 690 260 L 695 240 L 700 220 L 705 200 L 700 180 Z",

    // Australia
    australia:
      "M 950 450 L 980 440 L 1010 445 L 1040 455 L 1060 470 L 1065 490 L 1050 510 L 1020 520 L 990 515 L 960 505 L 940 490 L 935 470 L 940 455 L 950 450 Z",

    // India (more detailed)
    india:
      "M 740 280 L 750 270 L 760 265 L 770 270 L 780 275 L 790 280 L 800 290 L 805 300 L 800 310 L 790 320 L 780 330 L 770 340 L 760 345 L 750 340 L 740 330 L 735 320 L 730 310 L 730 300 L 735 290 L 740 280 Z",
  }

  return (
    <div className="w-full h-full">
      <svg viewBox="0 0 1200 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="1200" height="600" fill="transparent" />

        {/* Continents */}
        <g opacity="0.3">
          {Object.entries(continentPaths).map(([name, path]) => (
            <path key={name} d={path} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-400" />
          ))}
        </g>

        {/* Connection lines from Delhi to other nodes */}
        <g opacity="0.5">
          {otherNodes.map((node, index) => (
            <motion.line
              key={node.id}
              x1={delhiNode.x}
              y1={delhiNode.y}
              x2={node.x}
              y2={node.y}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-300"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{
                pathLength: {
                  duration: 2,
                  delay: index * 0.1,
                  ease: "easeOut",
                },
                opacity: { duration: 0.5, delay: index * 0.1 },
              }}
            />
          ))}
        </g>

        {/* Animated pulses along connection lines */}
        {otherNodes.map((node, index) => (
          <motion.circle
            key={`pulse-${node.id}`}
            r="2"
            fill="#ef4444"
            opacity="0.8"
            initial={{ cx: delhiNode.x, cy: delhiNode.y }}
            animate={{
              cx: [delhiNode.x, node.x, delhiNode.x],
              cy: [delhiNode.y, node.y, delhiNode.y],
            }}
            transition={{
              duration: 4,
              delay: index * 0.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Network nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Node glow effect for hub */}
            {node.isHub && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill="url(#nodeGlow)"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}

            {/* Node circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.isHub ? "6" : "3"}
              fill={node.isHub ? "#ef4444" : "#fff"}
              stroke={node.isHub ? "#fff" : "#ef4444"}
              strokeWidth="1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.5 }}
              filter={node.isHub ? "url(#glow)" : undefined}
            />

            {/* Node label (only for major nodes) */}
            {(node.isHub ||
              ["dubai", "singapore", "hongkong", "london", "sydney", "newyork", "tokyo"].includes(node.id)) && (
              <motion.text
                x={node.x}
                y={node.y - 10}
                textAnchor="middle"
                className="text-xs font-light fill-current text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                {node.name}
              </motion.text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

export default WorldMap
