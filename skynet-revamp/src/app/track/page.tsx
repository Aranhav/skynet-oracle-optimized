"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Search, Package, AlertCircle, History, X, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useTrackingHistory } from "@/hooks/use-tracking-history"
import { trackShipment } from "@/lib/tracking-api"
import { TrackingData } from "@/types/tracking"
import TrackingTimeline from "@/components/tracking/tracking-timeline"
import TrackingDetails from "@/components/tracking/tracking-details"
import FAQSection from "@/components/common/FAQSection"

function TrackingContent() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { history, addToHistory, removeFromHistory } = useTrackingHistory()
  const resultsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      setTrackingNumber(id)
      handleTrack(id)
    }
  }, [searchParams])

  const handleTrack = async (number?: string) => {
    const trackNo = number || trackingNumber
    if (!trackNo) return

    setLoading(true)
    setError(null)

    try {
      const response = await trackShipment(trackNo)
      setTrackingData(response.data)

      // Add to history
      if (response.data.shipmentDetails?.[0]) {
        const details = response.data.shipmentDetails[0]
        addToHistory({
          trackingNumber: trackNo.trim(),
          destination: details.destination,
          status: details.status,
        })
      }

      // Auto-scroll to results after a short delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 300)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track shipment")
      setTrackingData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-muted/20 to-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8">
                Track Your <span className="text-primary">Shipment</span>
              </h1>
              <p className="text-xl font-light text-muted-foreground mb-12">
                Enter your tracking number to see <span className="text-primary">real-time</span> updates
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <Input
                    type="text"
                    placeholder="Enter tracking number (e.g., SKY1234567890)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                    className="pl-12 h-14 text-base font-light rounded-full border-gray-200 focus:border-primary transition-colors"
                  />
                </div>
                <Button
                  onClick={() => handleTrack()}
                  disabled={loading || !trackingNumber}
                  className="h-14 px-10 rounded-full font-light bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Tracking..." : "Track Package"}
                </Button>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-light">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tracking History */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-16"
                >
                  <h3 className="text-sm font-light text-muted-foreground mb-6 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    Recent Tracking
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                    {history.slice(0, 3).map((item) => {
                      const getStatusColor = (status: string) => {
                        const normalizedStatus = status?.toUpperCase() || ""
                        if (normalizedStatus.includes("DELIVERED")) return "text-green-600 bg-green-50"
                        if (normalizedStatus.includes("TRANSIT") || normalizedStatus.includes("PROCESSED"))
                          return "text-primary bg-primary/10"
                        if (normalizedStatus.includes("BOOKED")) return "text-blue-600 bg-blue-50"
                        return "text-gray-600 bg-gray-50"
                      }

                      const formatTimestamp = (timestamp: number) => {
                        const now = Date.now()
                        const diff = now - timestamp
                        const minutes = Math.floor(diff / 60000)
                        const hours = Math.floor(diff / 3600000)
                        const days = Math.floor(diff / 86400000)

                        if (minutes < 60) return `${minutes}m ago`
                        if (hours < 24) return `${hours}h ago`
                        return `${days}d ago`
                      }

                      return (
                        <motion.div
                          key={item.trackingNumber}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          className="relative group"
                        >
                          <button
                            onClick={() => {
                              setTrackingNumber(item.trackingNumber)
                              handleTrack(item.trackingNumber)
                            }}
                            className="flex items-center gap-3 px-5 py-3 rounded-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:border-primary hover:shadow-md transition-all duration-300"
                          >
                            <Package className="w-4 h-4 text-primary" strokeWidth={1.5} />
                            <div className="flex items-center gap-3">
                              <span className="font-light text-sm">{item.trackingNumber}</span>
                              {item.destination && (
                                <span className="text-xs font-light text-muted-foreground">To: {item.destination}</span>
                              )}
                              {item.status && (
                                <Badge className={`text-xs font-light ${getStatusColor(item.status)} border-0`}>
                                  {item.status}
                                </Badge>
                              )}
                              <span className="text-xs font-light text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" strokeWidth={1.5} />
                                {formatTimestamp(item.timestamp)}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeFromHistory(item.trackingNumber)
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full ml-2"
                            >
                              <X className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                            </button>
                          </button>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Empty State */}
        {!trackingData && !loading && history.length === 0 && (
          <section className="py-32 md:py-40 bg-white dark:bg-black">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto text-center"
              >
                <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center">
                  <Package className="w-12 h-12 text-primary/40" strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-light mb-4">
                  No <span className="text-primary">Tracking</span> Information
                </h3>
                <p className="text-lg text-muted-foreground font-light">
                  Enter a tracking number above to view shipment details
                </p>
              </motion.div>
            </div>
          </section>
        )}

        {/* Tracking Results */}
        {trackingData && trackingData.status === "SUCCESS" && trackingData.shipmentDetails?.[0] && (
          <section ref={resultsRef} className="py-12 md:py-20 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-6xl mx-auto"
              >
                {/* Shipment Overview */}
                <TrackingDetails
                  details={trackingData.shipmentDetails[0]}
                  statusDetails={trackingData.statusDetails?.[0]}
                />

                {/* Tracking Timeline */}
                {trackingData.shipmentHistory && trackingData.shipmentHistory.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-light mb-8">
                      Tracking <span className="text-primary">Timeline</span>
                    </h2>
                    <TrackingTimeline history={trackingData.shipmentHistory} />
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <FAQSection
          category="Tracking"
          limit={6}
          title="Tracking FAQs"
          description="Find answers to common questions about tracking your shipments with Skynet"
          className="bg-gradient-to-b from-background to-muted/20"
        />
      </main>
      <Footer />
    </>
  )
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="min-h-screen pt-20">
            <div className="flex items-center justify-center py-40">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground font-light">Loading tracking page...</p>
              </div>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <TrackingContent />
    </Suspense>
  )
}
