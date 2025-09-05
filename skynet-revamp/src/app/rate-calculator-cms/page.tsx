"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { motion } from "framer-motion"
import { Calculator, Globe, Package, Clock, IndianRupee, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  getDestinationCountries,
  calculateShippingRate,
  formatWeightRange,
  formatRate,
  type ShippingRate,
} from "@/lib/strapi-rates-cms"

export default function RateCalculatorCMSPage() {
  const [fromCountry] = useState("India")
  const [toCountry, setToCountry] = useState("")
  const [weight, setWeight] = useState("")
  const [unit, setUnit] = useState<"g" | "kg">("kg")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ShippingRate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countries, setCountries] = useState<string[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)

  useEffect(() => {
    // Fetch available countries from CMS
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

    // Convert to kg if unit is grams (CMS expects kg)
    const weightInKg = unit === "g" ? weightNum / 1000 : weightNum

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const rate = await calculateShippingRate(toCountry, weightInKg)
      if (rate) {
        setResult(rate)
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
  }

  const getDeliveryTime = (zone?: string) => {
    switch (zone) {
      case "Zone A":
        return "5-7 business days"
      case "Zone B":
        return "7-9 business days"
      case "Zone C":
        return "3-5 business days"
      case "Zone D":
        return "2-3 business days"
      default:
        return "5-7 business days"
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-black dark:via-gray-950/50 dark:to-black">
        {/* Hero Section */}
        <section className="pt-32 pb-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge variant="outline" className="mb-4">
                <Calculator className="w-3 h-3 mr-1" />
                Rate Calculator
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
                Calculate Your <span className="text-primary">Shipping Rates</span>
              </h1>
              <p className="text-lg text-muted-foreground font-light">
                Get instant quotes for international shipping from India to over 190+ countries worldwide
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                    <CardTitle className="text-2xl font-light">Rate Inquiry</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleCheckRates} className="space-y-6">
                      {/* From Country */}
                      <div className="space-y-2">
                        <label className="text-sm font-light text-muted-foreground">From Country</label>
                        <Select value={fromCountry} disabled>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="India">India</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* To Country */}
                      <div className="space-y-2">
                        <label className="text-sm font-light text-muted-foreground">
                          To Country <span className="text-primary">*</span>
                        </label>
                        <Select value={toCountry} onValueChange={setToCountry} disabled={loadingCountries}>
                          <SelectTrigger className="h-12">
                            <SelectValue
                              placeholder={loadingCountries ? "Loading countries..." : "Select To Country"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.length === 0 ? (
                              <SelectItem value="" disabled>
                                No countries available
                              </SelectItem>
                            ) : (
                              countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Weight Input */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-light text-muted-foreground">
                            Weight <span className="text-primary">*</span>
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
                            className="h-12"
                          />
                          {unit === "g" && weight && parseFloat(weight) < 100 && (
                            <p className="text-xs text-red-500">Minimum weight is 100 grams</p>
                          )}
                          {unit === "kg" && weight && parseFloat(weight) < 0.1 && (
                            <p className="text-xs text-red-500">Minimum weight is 0.1 kg</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-light text-muted-foreground">Unit</label>
                          <Select value={unit} onValueChange={(value) => setUnit(value as "g" | "kg")}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">Kilograms (kg)</SelectItem>
                              <SelectItem value="g">Grams (g)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        <Button
                          type="submit"
                          size="lg"
                          className="flex-1 h-12 bg-primary hover:bg-primary/90 rounded-full"
                          disabled={loading || loadingCountries}
                        >
                          {loading ? "Calculating..." : "CHECK RATES"}
                        </Button>
                        <Button
                          type="button"
                          size="lg"
                          variant="outline"
                          className="h-12 rounded-full"
                          onClick={handleReset}
                        >
                          Reset
                        </Button>
                      </div>
                    </form>

                    {/* Result Display */}
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl"
                      >
                        <div className="text-center">
                          <h3 className="text-2xl font-light mb-2">Estimated Shipping Rate</h3>
                          <div className="flex items-center justify-center gap-2 text-4xl font-light text-primary mb-4">
                            <IndianRupee className="w-8 h-8" />
                            <span>{result.attributes.rate_inr.toLocaleString("en-IN")}</span>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
                            <div className="text-center">
                              <Globe className="w-5 h-5 mx-auto mb-1 text-primary" />
                              <p className="text-muted-foreground">Route</p>
                              <p className="font-medium">
                                {fromCountry} → {toCountry}
                              </p>
                            </div>
                            <div className="text-center">
                              <Package className="w-5 h-5 mx-auto mb-1 text-primary" />
                              <p className="text-muted-foreground">Weight</p>
                              <p className="font-medium">
                                {weight} {unit === "g" ? "g" : "kg"}
                              </p>
                            </div>
                            <div className="text-center">
                              <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                              <p className="text-muted-foreground">Delivery Time</p>
                              <p className="font-medium">{getDeliveryTime(result.attributes.zone)}</p>
                            </div>
                          </div>

                          {result.attributes.service_type && (
                            <div className="mt-4">
                              <Badge variant="secondary" className="font-light">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {result.attributes.service_type} Service
                              </Badge>
                            </div>
                          )}

                          <div className="mt-6 flex gap-4">
                            <Button size="lg" className="flex-1 rounded-full" asChild>
                              <a href="/contact">Book Shipment</a>
                            </Button>
                            <Button size="lg" variant="outline" className="flex-1 rounded-full" onClick={handleReset}>
                              Calculate Another
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 text-center"
              >
                <p className="text-sm text-muted-foreground font-light">
                  * Rates are indicative and subject to change based on dimensions, actual weight, and service type.
                  <br />
                  For bulk shipments or custom requirements, please{" "}
                  <a href="/contact" className="text-primary hover:underline">
                    contact us
                  </a>
                  .
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
