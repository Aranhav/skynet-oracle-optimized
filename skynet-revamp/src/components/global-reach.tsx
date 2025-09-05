"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin } from "lucide-react"

const deliveryPoints = [
  { name: "North America", time: "3-5 days", top: "25%", left: "20%" },
  { name: "Europe", time: "2-4 days", top: "30%", left: "50%" },
  { name: "Asia Pacific", time: "1-3 days", top: "45%", left: "75%" },
  { name: "Middle East", time: "2-3 days", top: "40%", left: "60%" },
  { name: "Africa", time: "4-6 days", top: "55%", left: "50%" },
  { name: "South America", time: "4-6 days", top: "65%", left: "30%" },
]

export default function GlobalReach() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black rounded-3xl overflow-hidden">
      {/* Globe Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-[500px] h-[500px]"
        >
          {/* Globe Circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm" />

          {/* Globe Grid Lines */}
          <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
            {/* Latitude lines */}
            {[150, 200, 250, 300, 350].map((y) => (
              <line
                key={`lat-${y}`}
                x1="100"
                y1={y}
                x2="400"
                y2={y}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/20"
              />
            ))}

            {/* Longitude lines */}
            {[150, 200, 250, 300, 350].map((x) => (
              <path
                key={`long-${x}`}
                d={`M ${x} 100 Q 250 250 ${x} 400`}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/20"
              />
            ))}

            {/* Globe outline */}
            <circle
              cx="250"
              cy="250"
              r="200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary/30"
            />
          </svg>

          {/* Skynet Logo in Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex items-center justify-center">
              <span className="text-2xl font-light text-primary">SKYNET</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delivery Points */}
      {deliveryPoints.map((point, index) => (
        <motion.div
          key={point.name}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          className="absolute group"
          style={{ top: point.top, left: point.left }}
        >
          {/* Pin */}
          <div className="relative">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-ping" />
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-3 whitespace-nowrap border border-gray-200/30 dark:border-gray-800/30">
              <p className="font-medium text-sm">{point.name}</p>
              <p className="text-xs text-primary">{point.time}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Network Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {deliveryPoints.map((point, i) =>
          deliveryPoints
            .slice(i + 1)
            .map((otherPoint, j) => (
              <motion.line
                key={`line-${i}-${j}`}
                x1={point.left}
                y1={point.top}
                x2={otherPoint.left}
                y2={otherPoint.top}
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="5 5"
                className="text-primary/20"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1 + (i + j) * 0.1, duration: 1 }}
              />
            )),
        )}
      </svg>
    </div>
  )
}
