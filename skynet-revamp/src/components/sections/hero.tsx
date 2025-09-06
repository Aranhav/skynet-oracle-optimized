"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Globe, Package, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const features = [
  { icon: Globe, label: "209 Countries", value: "Global Reach" },
  { icon: Package, label: "10K+ Pin Codes", value: "Pan India" },
  { icon: Clock, label: "24/7 Support", value: "Always Available" },
  { icon: Shield, label: "100% Secure", value: "Insured Delivery" },
]

export default function HeroSection() {
  const router = useRouter()
  const [trackingNumber, setTrackingNumber] = useState("")

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedNumber = trackingNumber.trim()
    if (trimmedNumber) {
      // Navigate to tracking page with the tracking number
      router.push(`/track?id=${encodeURIComponent(trimmedNumber)}`)
    }
  }

  const handleButtonClick = () => {
    const trimmedNumber = trackingNumber.trim()
    if (trimmedNumber) {
      router.push(`/track?id=${encodeURIComponent(trimmedNumber)}`)
    }
  }

  return (
    <section className="relative min-h-[80vh] flex items-center pt-32 pb-16 overflow-hidden bg-white dark:bg-black">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 z-0 hero-gradient"></div>

      {/* Content */}
      <div className="relative z-10 container text-center">
        <div className="max-w-5xl mx-auto">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight mb-6"
          >
            Connecting Your <span className="text-primary">Business</span>
            <br />
            to the <span className="text-primary">World</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg sm:text-xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto"
          >
            Reliable e-commerce and courier services to over{" "}
            <span className="text-primary font-normal">209 countries</span>.
            <br />
            <span className="text-primary font-normal">Fast</span>,{" "}
            <span className="text-primary font-normal">secure</span>, and{" "}
            <span className="text-primary font-normal">trusted</span> delivery solutions.
          </motion.p>

          {/* Tracking Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-2xl mx-auto mb-8"
          >
            <form
              onSubmit={handleTrack}
              className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl shadow-xl dark:shadow-2xl glass gradient-border"
            >
              <Input
                type="text"
                placeholder="Enter your Tracking Numbers"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && trackingNumber.trim()) {
                    e.preventDefault()
                    router.push(`/track?id=${encodeURIComponent(trackingNumber.trim())}`)
                  }
                }}
                className="flex-1 h-14 px-6 text-base font-light border-0 bg-muted/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
              <Button
                type="submit"
                size="lg"
                onClick={handleButtonClick}
                disabled={!trackingNumber.trim()}
                className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                TRACK
              </Button>
            </form>
          </motion.div>

          {/* Quick Link */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="text-center mb-16"
          >
            <Link
              href="/rate-calculator"
              className="text-primary hover:text-primary/80 font-light transition-colors text-sm"
            >
              Get Instant Quote →
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto"
          >
            {features.map((feature) => (
              <div key={feature.label} className="text-center">
                <p className="text-2xl md:text-3xl font-light text-primary mb-1">{feature.label}</p>
                <p className="text-xs text-muted-foreground font-light">{feature.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
