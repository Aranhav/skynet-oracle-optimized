"use client"

import { motion } from "framer-motion"
import { MessageCircle, Bell, FileCheck, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"

const strengths = [
  {
    icon: MessageCircle,
    title: "Localized Communication",
    description: "We keep you informed with shipment updates in your local language, building clarity and trust.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Receive instant SMS and email notifications the moment the status of your shipment changes.",
  },
  {
    icon: FileCheck,
    title: "Streamlined Customs",
    description:
      "We simplify complex customs processes, like those for Russia, ensuring your cross-border shipments are smoother and faster.",
  },
  {
    icon: MapPin,
    title: "Global PUDO Network",
    description:
      "Our extensive Pick-Up and Drop-Off (PUDO) network offers flexible and convenient delivery solutions worldwide.",
  },
]

export default function CoreStrengthsSection() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 font-heading">
            Making International Shipping <span className="text-primary">Smarter</span> &{" "}
            <span className="text-primary">Faster</span>
          </h2>
          <p className="text-lg text-muted-foreground font-light">
            At Skynet Worldwide Express India, our focus is on providing a seamless, customer-centric shipping
            experience. Here's what sets us apart:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {strengths.map((strength, index) => (
            <motion.div
              key={strength.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-0 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl shrink-0">
                    <strength.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2">{strength.title}</h3>
                    <p className="text-muted-foreground font-light">{strength.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
