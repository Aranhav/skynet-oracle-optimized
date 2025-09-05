"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import * as Icons from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchFeaturedServices, getServiceIconName } from "@/lib/strapi-services"
import { StrapiData, Service } from "@/lib/strapi-services"

// Icon helper function
function getIcon(iconName: string) {
  const icon = Icons[getServiceIconName(iconName) as keyof typeof Icons]
  return icon || Icons.Package
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [services, setServices] = useState<StrapiData<Service>[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    fetchFeaturedServices()
      .then((data) => {
        setServices(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching services:", error)
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-20 md:py-24">
      <div className="container">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="mb-4">
            <Icons.Truck className="w-3 h-3 mr-1" />
            Our Services
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-heading mb-6">
            A Full Range of <span className="text-primary">Global Logistics</span> Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-light">
            We deliver excellence with a comprehensive suite of trusted logistics services. As a leading international
            courier provider, we offer specialized solutions designed to meet the diverse needs of businesses and
            individuals alike.
          </p>
        </motion.div>

        {/* Services Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="overflow-x-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`flex gap-6 ${services.length <= 3 ? "justify-center w-full" : "animate-scroll"}`}
              style={{
                width: services.length <= 3 ? "100%" : "max-content",
                animationPlayState: isPaused ? "paused" : "running",
                animationDuration: services.length > 3 ? `${services.length * 8}s` : "0s",
              }}
            >
              {loading ? (
                // Loading state
                [...Array(6)].map((_, index) => (
                  <div key={index} className="w-[350px] flex-shrink-0">
                    <Card className="h-full border-0 shadow-sm">
                      <CardContent className="p-8 h-full">
                        <div className="animate-pulse">
                          <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 mb-6" />
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-5/6" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              ) : services.length > 0 ? (
                // Duplicate services for seamless loop if more than 3
                (services.length > 3 ? [...services, ...services] : services).map((service, index) => {
                  const IconComponent = getIcon(service.attributes.icon)
                  const highlights = service.attributes.Highlights || []

                  return (
                    <div key={`${service.id}-${index}`} className="w-[350px] flex-shrink-0">
                      <Link href={`/services/${service.attributes.slug}`} className="block h-full">
                        <Card className="group h-[420px] border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-card cursor-pointer">
                          <CardContent className="p-8 h-full flex flex-col">
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 p-3 mb-6 group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="w-full h-full text-primary" strokeWidth={1.5} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-light mb-2 font-heading">{service.attributes.title}</h3>
                            <p className="text-muted-foreground mb-4 flex-grow font-light">
                              {service.attributes.shortDescription}
                            </p>

                            {/* Features from Highlights */}
                            {highlights.length > 0 && (
                              <ul className="space-y-2 mb-6">
                                {highlights.slice(0, 3).map((highlight) => {
                                  const HighlightIcon = getIcon(highlight.icon)
                                  return (
                                    <li
                                      key={highlight.id}
                                      className="flex items-start text-sm text-muted-foreground font-light"
                                    >
                                      <HighlightIcon className="w-4 h-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                                      {highlight.title}
                                    </li>
                                  )
                                })}
                              </ul>
                            )}

                            {/* CTA */}
                            <div className="inline-flex items-center text-primary text-sm font-light group-hover:translate-x-1 transition-transform mt-auto">
                              {service.attributes.ctaText || "Learn More"}
                              <Icons.ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  )
                })
              ) : (
                // No services found
                <div className="w-full text-center py-12">
                  <p className="text-muted-foreground">No services available at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View All Services Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 font-light" asChild>
            <Link href="/services">
              View All Services
              <Icons.ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
