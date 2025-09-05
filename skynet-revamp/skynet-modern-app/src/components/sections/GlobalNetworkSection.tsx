"use client"

import React from "react"
import { motion } from "framer-motion"
import WorldMap from "@/components/ui/world-map"
import { Globe, Plane, Package, Clock } from "lucide-react"

const GlobalNetworkSection = () => {
  const features = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Presence in 190+ countries worldwide",
    },
    {
      icon: Plane,
      title: "Express Delivery",
      description: "Fast international shipping solutions",
    },
    {
      icon: Package,
      title: "Secure Handling",
      description: "End-to-end tracking and safety",
    },
    {
      icon: Clock,
      title: "24/7 Operations",
      description: "Round the clock service availability",
    },
  ]

  return (
    <section className="py-32 md:py-40 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">Connecting India to the World</h2>
          <p className="text-xl font-light text-gray-600 max-w-3xl mx-auto">
            With Delhi as our central hub, we seamlessly connect businesses across continents through our extensive
            global network
          </p>
        </motion.div>

        {/* World Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden">
            <div className="h-[300px] md:h-[500px] text-gray-800">
              <WorldMap />
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-light text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm font-light text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GlobalNetworkSection
