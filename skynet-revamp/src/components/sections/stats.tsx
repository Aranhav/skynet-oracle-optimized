"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"
import { Globe, Package, Users, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: Globe,
    value: 190,
    suffix: "+",
    label: "Countries Served",
    color: "text-blue-500",
  },
  {
    icon: Package,
    value: 50000000,
    suffix: "+",
    label: "Packages Delivered",
    color: "text-orange-500",
    format: true,
  },
  {
    icon: Users,
    value: 100000,
    suffix: "+",
    label: "Happy Customers",
    color: "text-green-500",
    format: true,
  },
  {
    icon: TrendingUp,
    value: 35,
    suffix: " Years",
    label: "Industry Experience",
    color: "text-purple-500",
  },
]

function AnimatedCounter({ value, format = false }: { value: number; format?: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [hasAnimated, setHasAnimated] = useState(false)

  const springValue = useSpring(0, {
    duration: 2000,
    bounce: 0.2,
  })

  const displayValue = useTransform(springValue, (latest) =>
    format ? formatNumber(Math.floor(latest)) : Math.floor(latest).toString(),
  )

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value)
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated, springValue, value])

  return <motion.span ref={ref}>{displayValue}</motion.span>
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K"
  }
  return num.toString()
}

export default function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 md:py-24 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="text-center"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background border-0 shadow-sm hover:shadow-xl transition-shadow duration-300 mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>

              {/* Value */}
              <div className="text-3xl md:text-4xl font-light font-heading mb-1">
                <AnimatedCounter value={stat.value} format={stat.format} />
                <span className="text-muted-foreground">{stat.suffix}</span>
              </div>

              {/* Label */}
              <p className="text-muted-foreground font-light">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
