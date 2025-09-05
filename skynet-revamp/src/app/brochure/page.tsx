"use client"

import { useState } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Download, FileText, Sparkles, Send, MessageCircle, Building2 } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function BrochurePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  const brochures = [
    {
      title: "Company Profile",
      description:
        "Discover our company history, values, global network infrastructure, and commitment to excellence in express logistics.",
      fileSize: "3.2 MB",
      fileName: "SkynetwwCompanyProfile.pdf",
      icon: Building2,
    },
    {
      title: "Skynet Brochure",
      description:
        "Comprehensive guide to our global express network services, coverage areas, and partnership opportunities.",
      fileSize: "2.5 MB",
      fileName: "SkynetBrochure.pdf",
      icon: FileText,
    },
    {
      title: "Skynet Newsletter",
      description: "Stay updated with the latest news, innovations, and insights from Skynet Worldwide Express.",
      fileSize: "1.8 MB",
      fileName: "skynet-newsletter.pdf",
      icon: Sparkles,
    },
  ]

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
                Download <span className="text-primary">Brochures</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                Access comprehensive information about our services, coverage areas, and logistics solutions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Download Cards Section */}
        <section className="py-24 md:py-32 bg-background">
          <div className="container max-w-5xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brochures.map((brochure, index) => (
                <motion.div
                  key={brochure.fileName}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all">
                    <div className="p-8">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <brochure.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                      </div>

                      <h3 className="text-2xl font-light mb-4">{brochure.title}</h3>
                      <p className="text-muted-foreground font-light mb-6 leading-relaxed">{brochure.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-light">PDF • {brochure.fileSize}</span>

                        <Button
                          asChild
                          variant="default"
                          className="rounded-full bg-primary hover:bg-primary/90 font-light"
                        >
                          <a href={`/documents/${brochure.fileName}`} download>
                            <Download className="w-4 h-4 mr-2" strokeWidth={1.5} />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Request a Callback Form - From Contact Page */}
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
      </main>
      <Footer />
    </>
  )
}
