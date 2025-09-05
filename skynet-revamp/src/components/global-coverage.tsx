"use client"

import { motion } from "framer-motion"
import { Globe, Clock, MapPin, Package } from "lucide-react"

const regions = [
  {
    name: "Asia Pacific",
    countries: "45+ Countries",
    deliveryTime: "1-3 Business Days",
    icon: MapPin,
    coverage: "India, China, Japan, Singapore, Australia",
  },
  {
    name: "Europe",
    countries: "50+ Countries",
    deliveryTime: "2-4 Business Days",
    icon: Globe,
    coverage: "UK, Germany, France, Italy, Spain",
  },
  {
    name: "North America",
    countries: "3 Countries",
    deliveryTime: "3-5 Business Days",
    icon: Package,
    coverage: "USA, Canada, Mexico",
  },
  {
    name: "Middle East",
    countries: "20+ Countries",
    deliveryTime: "2-3 Business Days",
    icon: Clock,
    coverage: "UAE, Saudi Arabia, Qatar, Kuwait",
  },
  {
    name: "Africa",
    countries: "30+ Countries",
    deliveryTime: "4-6 Business Days",
    icon: Globe,
    coverage: "South Africa, Nigeria, Kenya, Egypt",
  },
  {
    name: "South America",
    countries: "15+ Countries",
    deliveryTime: "4-6 Business Days",
    icon: MapPin,
    coverage: "Brazil, Argentina, Chile, Colombia",
  },
]

export default function GlobalCoverage() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {regions.map((region, index) => (
          <motion.div
            key={region.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200/30 dark:border-gray-800/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-medium mb-1">{region.name}</h3>
                <p className="text-sm text-primary font-light">{region.countries}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <region.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="font-light">{region.deliveryTime}</span>
              </div>

              <p className="text-xs text-muted-foreground font-light leading-relaxed">{region.coverage}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full px-8 py-4">
          <div>
            <p className="text-2xl font-light text-primary">209</p>
            <p className="text-sm text-muted-foreground">Countries</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-2xl font-light text-primary">50+</p>
            <p className="text-sm text-muted-foreground">Years Experience</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-2xl font-light text-primary">24/7</p>
            <p className="text-sm text-muted-foreground">Support</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
