"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, UserPlus, FileText, Package, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const steps = [
  {
    icon: UserPlus,
    title: "Register With Us",
    description: "Fill in our contact form, and our client onboarding team will reach out to you.",
  },
  {
    icon: FileText,
    title: "Sign the Service Contract",
    description: "Review and agree to the terms of service to activate your account.",
  },
  {
    icon: Package,
    title: "Start Shipping",
    description: "Simply hand over your products from your preferred location, and we'll handle the rest.",
  },
  {
    icon: Search,
    title: "Track Your Shipments",
    description: "Use your forwarding number to monitor your delivery's progress in real-time.",
  },
]

export default function PartnerWithUsSection() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 font-heading">
            Join Our <span className="text-primary">Network</span> and <span className="text-primary">Simplify</span>{" "}
            Your Logistics
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            Partner with Skynet Worldwide Express India to unlock seamless global shipping solutions. Register with us
            today to access a wide range of international courier services tailored to your business needs. Ship with
            confidence, backed by our fast, secure, and reliable global network, and stay in control with real-time
            tracking every step of the way.
          </p>
        </motion.div>

        {/* How to Get Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-light text-center mb-12">How to Get Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full relative overflow-hidden group border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="absolute top-2 right-4 text-7xl font-light text-gray-100 dark:text-gray-800 group-hover:text-primary/10 transition-colors">
                    {index + 1}
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                      <step.icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-xl font-light mb-3">{step.title}</h4>
                    <p className="text-muted-foreground text-sm font-light">{step.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 md:p-16 shadow-sm border border-gray-200 dark:border-gray-800 max-w-3xl mx-auto">
            <h3 className="text-3xl font-light mb-6">Ready to Get Started?</h3>
            <p className="text-muted-foreground font-light mb-8">
              Join thousands of businesses that trust Skynet for their global shipping needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/contact">
                  Register Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">Learn More About Our Services</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
