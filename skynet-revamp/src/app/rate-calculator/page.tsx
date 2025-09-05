"use client"

import { useState, useEffect, useRef } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { motion } from "framer-motion"
import { Calculator, Globe, Package, Clock, IndianRupee } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { calculateShippingRate, getDestinationCountries, ShippingRate } from "@/lib/strapi-rates-cms"
import FAQSection from "@/components/common/FAQSection"

export default function RateCalculatorPage() {
  const [fromCountry] = useState("India")
  const [toCountry, setToCountry] = useState("")
  const [weight, setWeight] = useState("")
  const [unit, setUnit] = useState<"g" | "kg">("kg")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ShippingRate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countries, setCountries] = useState<string[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)

  // Refs for scroll behavior
  const formRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch available countries from API
    setLoadingCountries(true)
    getDestinationCountries()
      .then((data) => {
        setCountries(data)
        setLoadingCountries(false)
      })
      .catch(() => {
        setLoadingCountries(false)
        setError("Failed to load destination countries")
      })
  }, [])

  // Scroll functions
  const scrollToResults = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }, 100)
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    })
  }

  const handleCheckRates = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!toCountry || !weight) {
      setError("Please fill in all fields")
      return
    }

    const weightNum = parseFloat(weight)
    if (isNaN(weightNum) || weightNum <= 0) {
      setError("Please enter a valid weight")
      return
    }

    // Validate minimum weight based on unit
    if (unit === "g" && weightNum < 100) {
      setError("Minimum weight is 100 grams")
      return
    } else if (unit === "kg" && weightNum < 0.1) {
      setError("Minimum weight is 0.1 kg")
      return
    }

    // Convert to kg if unit is grams (API expects kg)
    const weightInKg = unit === "g" ? weightNum / 1000 : weightNum

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const rate = await calculateShippingRate(toCountry, weightInKg)
      if (rate) {
        setResult(rate)
        scrollToResults() // Scroll to results section
      } else {
        setError("No rates available for this route and weight. Please contact us for a custom quote.")
      }
    } catch (err) {
      setError("Failed to calculate rate. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setToCountry("")
    setWeight("")
    setResult(null)
    setError(null)
    scrollToForm() // Scroll back to form section
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-black dark:via-gray-950/50 dark:to-black">
        {/* Hero Section with Two Columns */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start max-w-7xl mx-auto">
              {/* Left Column - Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lg:pt-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mb-8"
                >
                  <Badge
                    variant="outline"
                    className="mb-8 font-light border-primary/20 bg-primary/5 text-primary px-4 py-2 rounded-full"
                  >
                    <Calculator className="w-3 h-3 mr-2" strokeWidth={1.5} />
                    Rate Calculator
                  </Badge>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8 leading-tight"
                >
                  Calculate Your <span className="text-primary font-light">Shipping Rates</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8"
                >
                  Get instant quotes for international shipping from India to over 27 countries worldwide. Our advanced
                  rate calculator provides real-time pricing for your logistics needs.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-light">Instant rate calculation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-light">27+ destination countries</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-light">Real-time pricing</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Rate Calculator Form */}
              <motion.div
                ref={formRef}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="lg:sticky lg:top-32"
              >
                <Card className="border-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-2xl shadow-gray-900/10 dark:shadow-gray-900/20 rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/8 dark:from-primary/10 dark:to-primary/15 border-b border-gray-200/30 dark:border-gray-800/30 p-8">
                    <CardTitle className="text-2xl md:text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 text-center">
                      Rate Inquiry
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleCheckRates} className="space-y-6">
                      {/* From Country */}
                      <div className="space-y-4">
                        <label className="text-sm font-light text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                          From Country
                        </label>
                        <Select value={fromCountry} disabled>
                          <SelectTrigger className="h-16 border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 font-light rounded-2xl shadow-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
                            <SelectItem value="India" className="font-light py-3 px-4 rounded-xl">
                              🇮🇳 India
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* To Country */}
                      <div className="space-y-4">
                        <label className="text-sm font-light text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                          To Country <span className="text-primary font-normal">*</span>
                        </label>
                        <Select value={toCountry} onValueChange={setToCountry} disabled={loadingCountries}>
                          <SelectTrigger className="h-16 border-gray-200/50 dark:border-gray-800/50 hover:border-primary/40 transition-all duration-300 font-light rounded-2xl shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                            <SelectValue
                              placeholder={loadingCountries ? "Loading countries..." : "Select destination country"}
                            />
                          </SelectTrigger>
                          <SelectContent className="max-h-80 rounded-2xl border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-xl">
                            {countries.length === 0 ? (
                              <SelectItem value="no-countries" disabled className="font-light py-3 px-4">
                                No countries available
                              </SelectItem>
                            ) : (
                              countries.map((country) => (
                                <SelectItem
                                  key={country}
                                  value={country || "unknown"}
                                  className="font-light py-3 px-4 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                                >
                                  {country || "Unknown Country"}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Weight Input */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-sm font-light text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                            Weight <span className="text-primary font-normal">*</span>
                          </label>
                          <Input
                            type="number"
                            step={unit === "g" ? "10" : "0.1"}
                            min={unit === "g" ? "100" : "0.1"}
                            max={unit === "g" ? "100000" : "100"}
                            placeholder={
                              unit === "g" ? "Enter weight in grams (min 100g)" : "Enter weight in kg (min 0.1kg)"
                            }
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="h-16 border-gray-200/50 dark:border-gray-800/50 hover:border-primary/40 focus:border-primary/60 transition-all duration-300 font-light rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm text-base"
                          />
                          {unit === "g" && weight && parseFloat(weight) < 100 && (
                            <p className="text-xs text-red-500 font-light pl-1">Minimum weight is 100 grams</p>
                          )}
                          {unit === "kg" && weight && parseFloat(weight) < 0.1 && (
                            <p className="text-xs text-red-500 font-light pl-1">Minimum weight is 0.1 kg</p>
                          )}
                        </div>
                        <div className="space-y-4">
                          <label className="text-sm font-light text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                            Unit
                          </label>
                          <Select value={unit} onValueChange={(value) => setUnit(value as "g" | "kg")}>
                            <SelectTrigger className="h-16 border-gray-200/50 dark:border-gray-800/50 hover:border-primary/40 transition-all duration-300 font-light rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-xl">
                              <SelectItem
                                value="kg"
                                className="font-light py-3 px-4 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                              >
                                Kilograms (kg)
                              </SelectItem>
                              <SelectItem
                                value="g"
                                className="font-light py-3 px-4 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                              >
                                Grams (g)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="p-6 bg-red-50/70 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-2xl text-sm font-light backdrop-blur-sm shadow-sm"
                        >
                          {error}
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-8">
                        <Button
                          type="submit"
                          size="lg"
                          className="flex-1 h-16 bg-primary hover:bg-primary/90 rounded-full font-light text-base tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                          disabled={loading || loadingCountries}
                        >
                          {loading ? (
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Calculating...
                            </div>
                          ) : (
                            "CHECK RATES"
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="lg"
                          variant="outline"
                          className="h-16 px-8 rounded-full font-light border-gray-200/50 dark:border-gray-800/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm backdrop-blur-sm"
                          onClick={handleReset}
                        >
                          Reset
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {result && (
          <section className="pb-24 md:pb-32">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  ref={resultRef}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="p-10 bg-gradient-to-br from-primary/5 via-primary/8 to-primary/12 dark:from-primary/10 dark:via-primary/15 dark:to-primary/20 rounded-3xl border border-primary/20 dark:border-primary/30 backdrop-blur-sm shadow-xl shadow-primary/10"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <h3 className="text-3xl md:text-4xl font-light mb-6 text-gray-900 dark:text-gray-100 tracking-wide">
                        Estimated Shipping Rate
                      </h3>
                      <div className="flex items-center justify-center gap-4 text-5xl md:text-6xl font-light text-primary mb-8">
                        <IndianRupee className="w-12 h-12 md:w-14 md:h-14 stroke-[1.5]" />
                        <span className="font-extralight tracking-tight">
                          {result.attributes.rate_inr.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 mt-10">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-center p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-white/80 dark:border-gray-800/80 backdrop-blur-sm shadow-sm"
                      >
                        <Globe className="w-8 h-8 mx-auto mb-4 text-primary stroke-[1.5]" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2 tracking-wider uppercase">
                          Route
                        </p>
                        <p className="font-light text-gray-900 dark:text-gray-100 text-lg">
                          {fromCountry} → {toCountry}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-center p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-white/80 dark:border-gray-800/80 backdrop-blur-sm shadow-sm"
                      >
                        <Package className="w-8 h-8 mx-auto mb-4 text-primary stroke-[1.5]" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2 tracking-wider uppercase">
                          Weight
                        </p>
                        <p className="font-light text-gray-900 dark:text-gray-100 text-lg">
                          {weight} {unit === "g" ? "g" : "kg"}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-center p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-white/80 dark:border-gray-800/80 backdrop-blur-sm shadow-sm"
                      >
                        <Clock className="w-8 h-8 mx-auto mb-4 text-primary stroke-[1.5]" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-2 tracking-wider uppercase">
                          Delivery Time
                        </p>
                        <p className="font-light text-gray-900 dark:text-gray-100 text-lg">
                          {result.attributes.serviceDays || "Contact for details"}
                        </p>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="mt-10 flex flex-col sm:flex-row gap-4"
                    >
                      <Button
                        size="lg"
                        className="flex-1 h-16 rounded-full font-light text-base tracking-wider bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                        asChild
                      >
                        <a href="/contact">Book Shipment</a>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="flex-1 h-16 rounded-full font-light text-base border-white/60 dark:border-gray-800/60 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm backdrop-blur-sm"
                        onClick={handleReset}
                      >
                        Calculate Another
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Additional Info */}
        <section className="pb-24 md:pb-32">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="p-8 bg-gray-50/70 dark:bg-gray-950/70 rounded-3xl border border-gray-200/30 dark:border-gray-800/30 backdrop-blur-sm shadow-sm">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
                  * Rates are indicative and subject to change based on dimensions, actual weight, and service type.
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  For bulk shipments or custom requirements, please{" "}
                  <a
                    href="/contact"
                    className="text-primary hover:text-primary/80 transition-colors font-normal underline decoration-primary/30 underline-offset-4 hover:decoration-primary/60"
                  >
                    contact us
                  </a>{" "}
                  for personalized quotes.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          category="Pricing"
          title="Pricing FAQs"
          description="Common questions about our shipping rates, calculations, and pricing policies"
          limit={6}
          showViewAll={true}
          className="bg-gradient-to-b from-background to-muted/20"
        />
      </main>
      <Footer />
    </>
  )
}
