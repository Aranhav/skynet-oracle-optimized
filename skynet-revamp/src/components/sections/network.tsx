"use client"

import { motion } from "framer-motion"
import { MapPin, Building, Package, Users } from "lucide-react"

const stats = [
  { icon: Building, number: "1,300+", label: "Offices Worldwide" },
  { icon: Package, number: "33,400+", label: "PUDO Points" },
  { icon: MapPin, number: "209", label: "Countries & Territories" },
  { icon: Users, number: "18,500+", label: "Dedicated Employees" },
]

export default function NetworkSection() {
  return (
    <section className="overflow-hidden relative py-20 md:py-24 bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-4xl text-center"
        >
          <h2 className="mb-6 text-4xl font-light md:text-5xl lg:text-6xl font-heading">
            The Power of a <span className="text-primary">Truly Global</span> Reach
          </h2>
          <p className="text-xl font-light leading-relaxed text-muted-foreground">
            Established in 1972, Skynet Worldwide Express has become the largest independently owned express network in
            the world. As a premier international courier in India, we provide secure and dependable shipping to over
            209 countries. Our vast footprint ensures we can connect you to virtually every major city worldwide,
            granting you unparalleled access to global markets.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-4 md:p-10 bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-gray-200 transition-all duration-500 dark:from-gray-900 dark:to-gray-950 dark:border-gray-800 hover:shadow-lg group">
                <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 rounded-2xl transition-transform duration-300 bg-primary/10 group-hover:scale-110">
                  <stat.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <div className="mb-3 text-3xl font-light md:text-4xl text-foreground">{stat.number}</div>
                <div className="text-sm font-light tracking-wide uppercase text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
