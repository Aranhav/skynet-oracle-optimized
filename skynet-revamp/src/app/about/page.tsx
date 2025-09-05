"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import {
  Shield,
  Zap,
  Heart,
  Compass,
  Globe,
  MapPin,
  Package,
  Clock,
  Award,
  Navigation,
  Headphones,
  Plane,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Image from "next/image"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRef } from "react"

const WorldMapD3Full = dynamic(() => import("@/components/world-map-d3-full"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black rounded-3xl animate-pulse" />
  ),
})

const whyChooseUs = [
  {
    icon: Globe,
    title: "Global Network",
    description: "Reliable services across key destinations worldwide.",
  },
  {
    icon: MapPin,
    title: "Delhi Based",
    description: "Strategically located hub for all our operations.",
  },
  {
    icon: Package,
    title: "Customized Solutions",
    description: "Tailored logistics for individuals and businesses.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "Safe and timely delivery of all your shipments.",
  },
]

const coreValues = [
  {
    icon: Shield,
    title: "Reliability",
    description: "Consistent and dependable service you can trust.",
  },
  {
    icon: Zap,
    title: "Efficiency",
    description: "Streamlined processes for optimal delivery times.",
  },
  {
    icon: Heart,
    title: "Customer Focus",
    description: "Exceeding expectations in every interaction.",
  },
  {
    icon: Compass,
    title: "Global Reach",
    description: "Extensive network connecting the world.",
  },
]

const stats = [
  { number: "50+", label: "Years of Excellence", icon: Award },
  { number: "209", label: "Countries Served", icon: Globe },
  { number: "10K+", label: "Pin Codes Covered", icon: Navigation },
  { number: "24/7", label: "Customer Support", icon: Headphones },
]

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  return (
    <>
      <Header />
      <main className="min-h-screen" ref={containerRef}>
        {/* 1. Hero Section - Apple Style */}
        <motion.section
          className="flex overflow-hidden relative items-center pt-16 min-h-screen"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          {/* Background Image with stronger overlay */}
          <div className="absolute inset-0">
            <Image
              src="/images/skynet-uae-vans.jpg"
              alt="Skynet Express Fleet"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 top-16 bg-gradient-to-b from-transparent dark:top-0 dark:from-black/80 via-black/75 to-black/70" />
          </div>

          {/* Content */}
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              className="mx-auto max-w-5xl text-center"
            >
              <h1 className="mb-8 text-6xl font-light tracking-tight text-white md:text-7xl lg:text-8xl">
                Leading the Way in
                <br />
                <span className="font-light text-primary">Global Logistics</span>
              </h1>
              <p
                className="mx-auto mb-12 max-w-3xl text-xl font-light leading-relaxed text-white md:text-2xl"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
              >
                Your trusted partner in fast, reliable international courier and cargo services.
              </p>
              <div className="flex gap-12 justify-center items-center">
                <motion.div
                  className="flex gap-3 items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Plane className="w-6 h-6 text-primary" />
                  <span className="text-lg font-light text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                    Express Delivery
                  </span>
                </motion.div>
                <motion.div
                  className="flex gap-3 items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Globe className="w-6 h-6 text-primary" />
                  <span className="text-lg font-light text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                    209 Countries
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 2. About Introduction - Clean Apple Layout */}
        <section className="py-24 bg-white md:py-32 dark:bg-black">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="grid gap-24 items-center lg:grid-cols-2"
              >
                {/* Text Content */}
                <div>
                  <h2 className="mb-8 text-5xl font-light leading-tight md:text-6xl">
                    About <span className="text-primary">Skynet Express</span>
                  </h2>
                  <p className="mb-12 text-xl font-light leading-relaxed text-muted-foreground">
                    From our strategic hub in Delhi, Skynet Express India Pvt. Ltd. is a trusted name in logistics,
                    offering customized and efficient international courier solutions for individuals and businesses
                    worldwide.
                  </p>

                  {/* Key highlights */}
                  <div className="space-y-8">
                    <div className="flex gap-4 items-start">
                      <div className="flex flex-shrink-0 justify-center items-center w-12 h-12 rounded-2xl bg-primary/10">
                        <MapPin className="w-6 h-6 text-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="mb-1 text-lg font-medium">Strategic Location</h4>
                        <p className="font-light text-muted-foreground">Delhi hub connecting global markets</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex flex-shrink-0 justify-center items-center w-12 h-12 rounded-2xl bg-primary/10">
                        <TrendingUp className="w-6 h-6 text-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="mb-1 text-lg font-medium">50+ Years</h4>
                        <p className="font-light text-muted-foreground">Of trusted logistics expertise</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Office Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative h-[600px] rounded-3xl overflow-hidden"
                >
                  <Image
                    src="/images/skynet-warehouse-scanning.jpg"
                    alt="Skynet Express Warehouse Operations"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. Why Choose Us - Apple Grid */}
        <section className="py-24 bg-gray-50 md:py-32 dark:bg-gray-950">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20 text-center"
            >
              <h2 className="mb-6 text-5xl font-light md:text-6xl">
                Why Choose <span className="text-primary">Skynet Express</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-16 mx-auto max-w-5xl md:grid-cols-2">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex justify-center items-center mx-auto mb-8 w-14 h-14 rounded-2xl bg-primary/10">
                    <item.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-4 text-2xl font-light">{item.title}</h3>
                  <p className="text-lg font-light leading-relaxed text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Global Network Map - Full Width */}
        <section className="py-24 bg-white md:py-32 dark:bg-black">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20 text-center"
            >
              <h2 className="mb-8 text-5xl font-light md:text-6xl">
                Our <span className="text-primary">Global Reach</span>
              </h2>
              <p className="mx-auto max-w-3xl text-xl font-light text-muted-foreground">
                Connecting businesses across continents with reliable express delivery
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="max-w-7xl mx-auto h-[600px] lg:h-[700px]"
            >
              <WorldMapD3Full />
            </motion.div>
          </div>
        </section>

        {/* 5. Statistics - Apple Style */}
        <section className="py-24 bg-gray-50 md:py-32 dark:bg-gray-950">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20 text-center"
            >
              <h2 className="mb-6 text-5xl font-light md:text-6xl">
                Numbers That <span className="text-primary">Define Us</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 gap-8 mx-auto max-w-6xl lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-6">
                    <stat.icon className="mx-auto w-12 h-12 text-primary/50" strokeWidth={1} />
                  </div>
                  <div className="mb-3 text-5xl font-light md:text-6xl text-primary">{stat.number}</div>
                  <p className="text-lg font-light text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Core Values - Minimalist Grid */}
        <section className="py-24 bg-white md:py-32 dark:bg-black">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20 text-center"
            >
              <h2 className="mb-8 text-5xl font-light md:text-6xl">
                Our <span className="text-primary">Core Values</span>
              </h2>
              <p className="mx-auto max-w-3xl text-xl font-light text-muted-foreground">
                The principles that guide every decision we make
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-12 mx-auto max-w-6xl md:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex justify-center items-center mx-auto mb-8 w-14 h-14 rounded-2xl bg-primary/10">
                    <value.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-4 text-2xl font-light">{value.title}</h3>
                  <p className="font-light leading-relaxed text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CTA Section - Apple Style */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white md:py-32 dark:from-gray-950 dark:to-black">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mx-auto max-w-4xl text-center"
            >
              <h2 className="mb-8 text-5xl font-light md:text-6xl">
                Ready to Experience <span className="text-primary">Excellence</span>?
              </h2>
              <p className="mb-12 text-xl font-light text-muted-foreground">
                Join thousands of satisfied customers who trust Skynet Express for their logistics needs.
              </p>
              <div className="flex flex-col gap-6 justify-center sm:flex-row">
                <Button
                  size="lg"
                  className="px-10 py-6 text-lg font-light text-white rounded-full bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link href="/contact">Get a Quote</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-6 text-lg font-light rounded-full border-gray-300"
                  asChild
                >
                  <Link href="/contact">Contact Our Team</Link>
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
