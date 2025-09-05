"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import MultiPinGoogleMap from "@/components/common/MultiPinGoogleMap"
import { fetchOfficeLocations, transformOfficeForUI } from "@/lib/strapi-offices"
import { Office } from "@/types/strapi"
import FAQSection from "@/components/common/FAQSection"

interface OfficeForUI {
  id: string
  name: string
  company: string
  addresses: string[]
  phone: string
  email: string[]
  lat: number | null
  lng: number | null
  mapUrl?: string
  workingHours?: string
  isHeadOffice?: boolean
  hasCoordinates?: boolean
}

const contactInfo = {
  phone: "+91-8808808500",
  email: "dm@skynetww.com",
  workingHours: "Mon - Sat: 10.00AM - 07.00PM",
  cin: "U64100DL2015PTC279337",
  gstin: "07AACCL8506B1ZU",
  iso: "ISO 9001:2015 – Certificate No. SMS/QMS/B320/2515",
}

export default function ContactPage() {
  const [offices, setOffices] = useState<OfficeForUI[]>([])
  const [isLoadingOffices, setIsLoadingOffices] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch office locations from Strapi CMS
  useEffect(() => {
    const loadOffices = async () => {
      try {
        setIsLoadingOffices(true)

        const officeData = await fetchOfficeLocations()
        const transformedOffices = officeData.map(transformOfficeForUI)

        // Sort offices - head office first, then alphabetically
        const sortedOffices = transformedOffices.sort((a, b) => {
          if (a.isHeadOffice && !b.isHeadOffice) return -1
          if (!a.isHeadOffice && b.isHeadOffice) return 1
          return a.name.localeCompare(b.name)
        })

        setOffices(sortedOffices)
      } catch (error) {
        console.error("Error loading offices:", error)
        // Set fallback offices with coordinates
        setOffices([
          {
            id: "fallback-delhi",
            name: "New Delhi (Head Office)",
            company: "Skynet Express India Private Limited",
            addresses: ["JMK Tower, NH-8, Kapashera, New Delhi 110037, India"],
            phone: "+91-8808808500",
            email: ["dm@skynetww.com"],
            lat: 28.5355,
            lng: 77.1345,
            workingHours: "Mon - Sat: 10.00AM - 07.00PM",
            isHeadOffice: true,
            hasCoordinates: true,
          },
          {
            id: "fallback-mumbai",
            name: "West Hub (Mumbai)",
            company: "Skynet Express India Private Limited",
            addresses: [
              "Gala No.7, Indo Saigon Industrial Estate, Marol Naka, Andheri Kurla Road, Andheri East, Mumbai-400059",
            ],
            phone: "+91 - 92055 77402",
            email: ["mumbai@skynetww.com"],
            lat: 19.1197,
            lng: 72.8863,
            workingHours: "Mon - Sat: 10.00AM - 07.00PM",
            isHeadOffice: false,
            hasCoordinates: true,
          },
          {
            id: "fallback-ahmedabad",
            name: "Gujarat Hub (Ahmedabad)",
            company: "SKYNET EXPRESS INDIA P.LTD",
            addresses: ["Sky International Pvt Ltd. Gr. Floor, Shann Complex B/H Sakar 2, Ellis Bridge Ahmedabad."],
            phone: "+91-79-26577100",
            email: ["ahmedabad@skynetww.com"],
            lat: 23.0225,
            lng: 72.5714,
            workingHours: "Mon - Sat: 10.00AM - 07.00PM",
            isHeadOffice: false,
            hasCoordinates: true,
          },
        ])
      } finally {
        setIsLoadingOffices(false)
      }
    }

    loadOffices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Reset form
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    alert("Thank you for your message. We will get back to you soon!")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
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
                Contact <span className="text-primary">Us</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                Get in touch with us for all your logistics needs. We're here to help you 24/7.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 text-center h-full border-0 shadow-sm hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Phone className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-light mb-3">Call Us</h3>
                  <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline font-light">
                    {contactInfo.phone}
                  </a>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 text-center h-full border-0 shadow-sm hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-light mb-3">Email Us</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline font-light">
                    {contactInfo.email}
                  </a>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 text-center h-full border-0 shadow-sm hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-light mb-3">Working Hours</h3>
                  <p className="text-muted-foreground font-light">{contactInfo.workingHours}</p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Office Locations - Two Column Layout */}
        <section id="office-locations" className="py-24 md:py-32 bg-background">
          <div className="container">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Office Addresses */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-light mb-4">Office Locations</h2>
                  <p className="text-muted-foreground font-light">
                    Find our offices across India for in-person support and services.
                  </p>
                </div>

                {isLoadingOffices
                  ? // Loading state for addresses
                    Array.from({ length: 3 }).map((_, index) => (
                      <Card key={`loading-${index}`} className="p-8 border-0 shadow-sm">
                        <div className="animate-pulse">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-muted/50 rounded-2xl"></div>
                            <div>
                              <div className="h-6 bg-muted/50 rounded-lg w-32 mb-2"></div>
                              <div className="h-4 bg-muted/30 rounded-lg w-24"></div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="h-4 bg-muted/40 rounded-lg w-full"></div>
                            <div className="h-4 bg-muted/40 rounded-lg w-3/4"></div>
                            <div className="h-4 bg-muted/30 rounded-lg w-1/2"></div>
                          </div>
                        </div>
                      </Card>
                    ))
                  : offices.map((office, index) => (
                      <motion.div
                        key={office.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className="p-8 border-0 shadow-sm hover:shadow-xl transition-all">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
                            </div>
                            <div>
                              <h3 className="text-xl font-light mb-2">{office.name}</h3>
                              <p className="text-sm text-muted-foreground font-light">{office.company}</p>
                            </div>
                          </div>

                          <div className="space-y-4 text-sm">
                            {office.addresses.map((address, i) => (
                              <p key={i} className="text-muted-foreground font-light leading-relaxed">
                                {address}
                              </p>
                            ))}

                            <div className="flex flex-wrap gap-4 pt-3 border-t border-border/20">
                              {office.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-primary" strokeWidth={1.5} />
                                  <a
                                    href={`tel:${office.phone}`}
                                    className="text-primary hover:underline font-light text-sm"
                                  >
                                    {office.phone}
                                  </a>
                                </div>
                              )}

                              {office.email && office.email.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-primary" strokeWidth={1.5} />
                                  <a
                                    href={`mailto:${office.email[0]}`}
                                    className="text-primary hover:underline font-light text-sm"
                                  >
                                    {office.email[0]}
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" strokeWidth={1.5} />
                              <span className="font-light">{office.workingHours}</span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
              </motion.div>

              {/* Right Column - Multi-Pin Map */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="h-full min-h-[600px]"
              >
                <MultiPinGoogleMap offices={offices} height="600px" className="sticky top-8" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Request a Callback Form - Rate Calculator Style */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-black dark:via-gray-950/50 dark:to-black">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start max-w-7xl mx-auto">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="lg:pt-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <Badge
                    variant="outline"
                    className="mb-8 font-light border-primary/20 bg-primary/5 text-primary px-4 py-2 rounded-full"
                  >
                    <MessageCircle className="w-3 h-3 mr-2" strokeWidth={1.5} />
                    Contact Form
                  </Badge>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8 leading-tight"
                >
                  Request a <span className="text-primary font-light">Callback</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true }}
                  className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8"
                >
                  Have questions about our logistics services? Get in touch with our expert team for personalized
                  assistance and support.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-light">24/7 customer support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-light">Expert logistics consultation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-light">Quick response guarantee</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true }}
                className="lg:sticky lg:top-32"
              >
                <Card className="border-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-2xl shadow-gray-900/10 dark:shadow-gray-900/20 rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/8 dark:from-primary/10 dark:to-primary/15 border-b border-gray-200/30 dark:border-gray-800/30 p-8">
                    <CardTitle className="text-2xl md:text-3xl font-light tracking-wide text-gray-900 dark:text-gray-100 text-center">
                      Get in Touch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div className="space-y-4">
                        <label className="text-sm font-light text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                          Full Name <span className="text-primary font-normal">*</span>
                        </label>
                        <Input
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-16 border-gray-200/50 dark:border-gray-800/50 hover:border-primary/40 transition-all duration-300 font-light rounded-2xl shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-4">
                        <label className="text-sm font-light text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                          Email Address <span className="text-primary font-normal">*</span>
                        </label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-16 border-gray-200/50 dark:border-gray-800/50 hover:border-primary/40 transition-all duration-300 font-light rounded-2xl shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-4">
                        <label className="text-sm font-light text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                          Phone Number <span className="text-primary font-normal">*</span>
                        </label>
                        <Input
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="h-16 border-gray-200/50 dark:border-gray-800/50 hover:border-primary/40 transition-all duration-300 font-light rounded-2xl shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-4">
                        <label className="text-sm font-light text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                          Subject
                        </label>
                        <Input
                          name="subject"
                          placeholder="Brief subject of your inquiry"
                          value={formData.subject}
                          onChange={handleChange}
                          className="h-16 border-gray-200/50 dark:border-gray-800/50 hover:border-primary/40 transition-all duration-300 font-light rounded-2xl shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-4">
                        <label className="text-sm font-light text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                          Message <span className="text-primary font-normal">*</span>
                        </label>
                        <Textarea
                          name="message"
                          placeholder="Tell us how we can help you..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="min-h-[120px] border-gray-200/50 dark:border-gray-800/50 hover:border-primary/40 transition-all duration-300 font-light rounded-2xl shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-light rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending Message...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="w-5 h-5" strokeWidth={1.5} />
                            Send Message
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          category="Support"
          title="Support FAQs"
          description="Find answers to common questions about our customer service and support"
          limit={5}
          showViewAll={true}
        />

        {/* Company Registration Info */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="p-8 max-w-3xl mx-auto border-0 shadow-sm">
                <h3 className="text-xl font-light mb-6">Company Registration Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground font-light mb-1">CIN No.</p>
                    <p className="font-light">{contactInfo.cin}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-light mb-1">GSTIN</p>
                    <p className="font-light">{contactInfo.gstin}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-light mb-1">ISO Certification</p>
                    <p className="font-light">{contactInfo.iso}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
