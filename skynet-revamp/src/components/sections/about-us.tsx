"use client"

import { motion } from "framer-motion"
import { Globe, Award, Users, Target } from "lucide-react"
import { Card } from "@/components/ui/card"

const highlights = [
  {
    icon: Globe,
    title: "Global Network",
    description: "Operating in over 209 countries with 1,300+ offices worldwide",
  },
  {
    icon: Award,
    title: "ISO Certified",
    description: "ISO 9001:2015 certified for quality management systems",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "18,500+ dedicated professionals across the globe",
  },
  {
    icon: Target,
    title: "Mission Focused",
    description: "Committed to connecting businesses and communities reliably",
  },
]

export default function AboutUsSection() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8">
            Your <span className="text-primary">Trusted Partner</span> in{" "}
            <span className="text-primary">Global Logistics</span>
          </h2>
          <p className="text-xl font-light text-muted-foreground leading-relaxed">
            Skynet Express India Pvt. Ltd. is a leading name in fast and reliable international courier services. Based
            in Delhi, we provide customized logistics solutions for both individuals and businesses, ensuring your
            documents and parcels are delivered safely and on time, anywhere in the world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <p className="text-center text-muted-foreground">
            We specialize in premium delivery services across India and to key global destinations. Count on Skynet for
            efficient, affordable, and exceptional shipping to Australia, Dubai, the UK, Singapore, Hong Kong, Europe,
            and beyond.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-white dark:bg-gray-900">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-light mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
