"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Smartphone, Shield, Leaf, Users, BarChart3, Headphones, Globe2, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Smartphone,
    title: "Digital First Approach",
    description: "Track shipments, get quotes, and manage deliveries through our mobile app and web platform.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "100% Secure Delivery",
    description: "Every shipment is insured and handled with utmost care. Real-time monitoring ensures safety.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Operations",
    description: "Committed to carbon neutrality by 2030 with electric vehicles and sustainable packaging.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Dedicated Account Manager",
    description: "Business customers get personalized support with dedicated managers for seamless operations.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Detailed reporting and analytics to help you optimize your shipping and reduce costs.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description: "Round-the-clock support via phone, email, and chat. Multilingual assistance available.",
    gradient: "from-pink-500 to-rose-500",
  },
]

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-heading mb-6">
            Why Choose <span className="text-primary">Skynet India</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            Experience the difference with our innovative approach to logistics and unwavering commitment to customer
            satisfaction.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-full h-full text-primary" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-light mb-3 font-heading">{feature.title}</h3>
                  <p className="text-muted-foreground font-light">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-8 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <span className="text-sm font-light">ISO 9001:2015 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <span className="text-sm font-light">Same Day Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <span className="text-sm font-light">Money Back Guarantee</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
