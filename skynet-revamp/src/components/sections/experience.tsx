"use client"

import { motion } from "framer-motion"
import { Calendar, Plane, Ship, Package } from "lucide-react"

const stats = [
  {
    icon: Calendar,
    number: "50+",
    label: "Years of Industry Experience",
    color: "text-blue-600",
  },
  {
    icon: Plane,
    number: "408,840+",
    label: "Air Freight Projects Completed",
    color: "text-orange-600",
  },
  {
    icon: Ship,
    number: "301,130+",
    label: "Sea Freight Projects Achieved",
    color: "text-green-600",
  },
  {
    icon: Package,
    number: "52,600+",
    label: "Courier Projects Delivered",
    color: "text-purple-600",
  },
]

export default function ExperienceSection() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 font-heading">
            Over <span className="text-primary">50 Years</span> of Delivering{" "}
            <span className="text-primary">Excellence</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            Our numbers speak for themselves. With decades of experience, we have successfully managed hundreds of
            thousands of projects, earning the trust of clients worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <stat.icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="absolute -top-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-white text-xs font-bold">✓</span>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-light mb-3">{stat.number}</div>
                <p className="text-muted-foreground font-light">{stat.label}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
