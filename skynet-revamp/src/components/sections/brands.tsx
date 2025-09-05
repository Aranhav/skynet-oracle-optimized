"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import * as Icons from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { fetchFeaturedPartners, getPartnerLogoUrl } from "@/lib/strapi-partners"
import { StrapiData, Partner } from "@/lib/strapi-partners"

export default function BrandsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [partners, setPartners] = useState<StrapiData<Partner>[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    fetchFeaturedPartners()
      .then((data) => {
        setPartners(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching partners:", error)
        setLoading(false)
      })
  }, [])

  // Fallback partners for demo/loading
  const fallbackPartners = [
    { name: "DHL", logo: "/images/partners/dhl.png" },
    { name: "FedEx", logo: "/images/partners/fedex.png" },
    { name: "UPS", logo: "/images/partners/ups.png" },
    { name: "Amazon", logo: "/images/partners/amazon.png" },
    { name: "Shopify", logo: "/images/partners/shopify.png" },
    { name: "WooCommerce", logo: "/images/partners/woocommerce.png" },
  ]

  return (
    <section className="py-20 md:py-24">
      <div className="container">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            <Icons.Handshake className="w-3 h-3 mr-1" />
            Our Partners
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-heading mb-6">
            Trusted by <span className="text-primary">Leading Brands</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-light">
            We collaborate with industry leaders to deliver exceptional logistics solutions worldwide
          </p>
        </motion.div>

        {/* Partners Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="overflow-x-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`flex items-center gap-12 ${partners.length > 5 ? "animate-scroll-slow" : "justify-center w-full"}`}
              style={{
                width: partners.length > 5 ? "max-content" : "100%",
                animationPlayState: isPaused ? "paused" : "running",
                animationDuration: partners.length > 5 ? `${partners.length * 5}s` : "0s",
              }}
            >
              {loading
                ? // Loading state
                  [...Array(6)].map((_, index) => (
                    <div key={index} className="flex-shrink-0">
                      <div className="w-32 h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                    </div>
                  ))
                : partners.length > 0
                  ? // Duplicate partners for seamless loop if more than 5
                    (partners.length > 5 ? [...partners, ...partners] : partners).map((partner, index) => {
                      const logoUrl = getPartnerLogoUrl(partner.attributes)

                      return (
                        <div key={`${partner.id}-${index}`} className="flex-shrink-0 group">
                          {partner.attributes.website ? (
                            <a
                              href={partner.attributes.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <div className="relative w-32 h-20 transition-all duration-300 hover:scale-110">
                                {logoUrl ? (
                                  <Image 
                                    src={logoUrl} 
                                    alt={partner.attributes.name} 
                                    fill 
                                    className="object-contain dark:brightness-0 dark:invert" 
                                    style={{ backgroundColor: 'transparent' }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded">
                                    <span className="text-xs text-muted-foreground">{partner.attributes.name}</span>
                                  </div>
                                )}
                              </div>
                            </a>
                          ) : (
                            <div className="relative w-32 h-20 transition-all duration-300 hover:scale-110">
                              {logoUrl ? (
                                <Image 
                                  src={logoUrl} 
                                  alt={partner.attributes.name} 
                                  fill 
                                  className="object-contain dark:brightness-0 dark:invert" 
                                  style={{ backgroundColor: 'transparent' }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded">
                                  <span className="text-xs text-muted-foreground">{partner.attributes.name}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })
                  : // Fallback partners if no data from CMS
                    fallbackPartners.map((partner, index) => (
                      <div key={index} className="flex-shrink-0">
                        <div className="relative w-32 h-20 transition-all duration-300 hover:scale-110">
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded">
                            <span className="text-sm text-muted-foreground font-light">{partner.name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
