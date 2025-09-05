"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Package, MapPin, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TrackingCTA() {
  const [trackingNumber, setTrackingNumber] = useState("")

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber) {
      window.location.href = `/track?id=${trackingNumber}`
    }
  }

  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Package className="w-3 h-3 mr-1" strokeWidth={1.5} />
              Real-time Tracking
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-heading mb-6">
              Track Your <span className="text-primary">Shipment</span> <span className="text-primary">Instantly</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light">
              Enter your tracking number to get real-time updates on your package location
            </p>
          </motion.div>

          {/* Tracking Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleTrack}
            className="mb-20"
          >
            <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5"
                  strokeWidth={1.5}
                />
                <Input
                  type="text"
                  placeholder="Enter tracking number (e.g., SKY1234567890)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-12 h-14 text-base font-light border-gray-200 dark:border-gray-800"
                  required
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-10 font-light">
                Track Package
              </Button>
            </div>
            <p className="text-sm text-muted-foreground font-light text-center mt-4">
              Example: SKY1234567890 or 1234-5678-9012
            </p>
          </motion.form>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                <MapPin className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-light text-lg mb-2">Live Location</h3>
              <p className="text-sm text-muted-foreground font-light">
                Track your package location in real-time on map
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                <Package className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-light text-lg mb-2">Delivery Updates</h3>
              <p className="text-sm text-muted-foreground font-light">Get SMS and email notifications at every step</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-light text-lg mb-2">Delivery Proof</h3>
              <p className="text-sm text-muted-foreground font-light">Digital signature and photo proof of delivery</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
