"use client"

import { motion } from "framer-motion"
import { Building, Globe, Users, Award, Shield, Zap, Leaf } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const stats = [
  { icon: Building, number: "500+", label: "Service Centers" },
  { icon: Globe, number: "190+", label: "Countries Served" },
  { icon: Users, number: "10,000+", label: "Team Members" },
  { icon: Award, number: "25+", label: "Years of Excellence" },
]

const values = [
  {
    icon: Shield,
    title: "Reliability",
    description:
      "We deliver on our promises, ensuring your shipments reach their destination safely and on time, every time.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "Continuously improving our services with cutting-edge technology and innovative solutions for modern logistics challenges.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "Committed to reducing our environmental impact with carbon-neutral operations by 2030 and net-zero emissions by 2035.",
  },
]

export default function CompanyProfilePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-muted/20 to-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
                Company <span className="text-primary">Profile</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                Part of the world's largest independently owned express network, delivering excellence globally.
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 md:py-32 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-light mb-8">
                  About <span className="text-primary">Skynet India</span>
                </h2>
                <p className="text-lg text-muted-foreground font-light mb-6 leading-relaxed">
                  Skynet India is part of the world's largest independently owned express network, providing
                  comprehensive logistics solutions across India and internationally.
                </p>
                <p className="text-lg text-muted-foreground font-light mb-6 leading-relaxed">
                  Established with a vision to revolutionize the logistics industry in India, we have grown to become a
                  trusted partner for businesses of all sizes, from startups to large enterprises.
                </p>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  Our commitment to excellence, innovation, and customer satisfaction has made us a leader in the
                  express delivery and logistics sector.
                </p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-8 text-center h-full border-0 shadow-sm hover:shadow-xl transition-all">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <stat.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-3xl font-light text-primary mb-2">{stat.number}</h3>
                      <p className="text-sm text-muted-foreground font-light">{stat.label}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 md:py-32 bg-gray-50 dark:bg-gray-950">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-light mb-6">
                Our <span className="text-primary">Values</span>
              </h2>
              <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                The principles that guide every decision we make
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 h-full border-0 shadow-sm hover:shadow-xl transition-all">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <value.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-light mb-4">{value.title}</h3>
                    <p className="text-muted-foreground font-light leading-relaxed">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-black dark:via-gray-950/50 dark:to-black">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-light mb-8">
                Partner with <span className="text-primary">Skynet India</span>
              </h2>
              <p className="text-xl text-muted-foreground font-light mb-12">
                Join the largest independently owned express network and expand your business globally.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 py-6 text-lg font-light"
                  asChild
                >
                  <a href="/contact">Contact Us</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 py-6 text-lg font-light border-gray-300"
                  asChild
                >
                  <a href="/services">Explore Services</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
