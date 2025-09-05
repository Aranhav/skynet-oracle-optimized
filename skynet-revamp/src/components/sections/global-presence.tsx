"use client"

import { motion } from "framer-motion"
import { Plane, Globe, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"

const WorldMapD3Full = dynamic(() => import("@/components/world-map-d3-full"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl animate-pulse dark:from-gray-900 dark:to-black" />
  ),
})

const continentalHubs = [
  { name: "Americas", location: "Doral, Florida, USA", icon: "🇺🇸" },
  { name: "Europe", location: "London, UK", icon: "🇬🇧" },
  { name: "Middle East", location: "Dubai, UAE", icon: "🇦🇪" },
  { name: "Asia", location: "Singapore", icon: "🇸🇬" },
  { name: "Africa", location: "Johannesburg, South Africa", icon: "🇿🇦" },
]

const dailyFlights = [
  "Dubai",
  "London",
  "USA",
  "Canada",
  "Hong Kong",
  "Europe",
  "Malaysia",
  "Singapore",
  "Australia",
  "New Zealand",
  "Saudi Arabia",
  "Kuwait",
  "Nepal",
]

export default function GlobalPresenceSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-4xl text-center"
        >
          <h2 className="mb-6 text-4xl font-light md:text-5xl lg:text-6xl font-heading">
            Daily Flights, <span className="text-primary">Dependable Deliveries</span>
          </h2>
          <p className="text-lg font-light leading-relaxed md:text-xl text-muted-foreground">
            Our unique advantage lies in our expansive global network and daily flight operations. We ensure swift and
            reliable deliveries across continents with daily flights to key destinations worldwide. This makes us the
            most efficient and secure choice for your worldwide shipping needs.
          </p>
        </motion.div>

        {/* World Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <WorldMapD3Full />
        </motion.div>

        {/* Daily Flights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="p-10 rounded-3xl bg-primary/5 dark:bg-primary/10 md:p-12">
            <div className="flex gap-3 justify-center items-center mb-8">
              <Plane className="w-6 h-6 text-primary" strokeWidth={1.5} />
              <h3 className="text-2xl font-light">Daily Flights To</h3>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {dailyFlights.map((destination) => (
                <span
                  key={destination}
                  className="px-6 py-3 text-sm font-light bg-white rounded-full border border-gray-200 shadow-sm transition-shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-md"
                >
                  {destination}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Continental Hubs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-12 text-3xl font-light text-center">Key Continental Hubs</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {continentalHubs.map((hub, index) => (
              <motion.div
                key={hub.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex"
              >
                <Card className="flex flex-col justify-center items-center w-full h-full min-h-[150px] p-6 text-center border-gray-200 shadow-sm transition-all duration-300 dark:border-gray-800 hover:shadow-md">
                  <div className="mb-3 text-4xl">{hub.icon}</div>
                  <h4 className="mb-2 text-lg font-light">{hub.name}</h4>
                  <p className="flex gap-1 justify-center items-center text-sm font-light text-muted-foreground whitespace-nowrap">
                    <MapPin className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-center">{hub.location}</span>
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
