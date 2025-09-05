"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { fetchFeaturedTestimonials, getTestimonialAvatarUrl, getInitials } from "@/lib/strapi-testimonials"
import { StrapiData, Testimonial } from "@/lib/strapi-testimonials"

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [testimonials, setTestimonials] = useState<StrapiData<Testimonial>[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    fetchFeaturedTestimonials()
      .then((data) => {
        setTestimonials(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching testimonials:", error)
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
            <Quote className="w-3 h-3 mr-1" />
            Customer Reviews
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-heading mb-6">
            Trusted by <span className="text-primary">100,000+ Businesses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-light">
            See what our customers have to say about their experience with Skynet India
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="overflow-x-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`flex gap-6 ${testimonials.length <= 2 ? "justify-center w-full" : "animate-scroll-slow"}`}
              style={{
                width: testimonials.length <= 2 ? "100%" : "max-content",
                animationPlayState: isPaused ? "paused" : "running",
                animationDuration: testimonials.length > 2 ? `${testimonials.length * 10}s` : "0s",
              }}
            >
              {loading ? (
                // Loading state
                [...Array(4)].map((_, index) => (
                  <div key={index} className="w-[450px] flex-shrink-0">
                    <Card className="h-full border-0 shadow-sm">
                      <CardContent className="p-8 h-full">
                        <div className="animate-pulse">
                          <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 mb-6" />
                          <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                            ))}
                          </div>
                          <div className="space-y-2 mb-8">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              ) : testimonials.length > 0 ? (
                // Duplicate testimonials for seamless loop if more than 2
                (testimonials.length > 2 ? [...testimonials, ...testimonials] : testimonials).map(
                  (testimonial, index) => {
                    const avatarUrl = getTestimonialAvatarUrl(testimonial.attributes)
                    const initials = getInitials(testimonial.attributes.name)

                    return (
                      <div key={`${testimonial.id}-${index}`} className="w-[450px] flex-shrink-0">
                        <Card className="h-[320px] border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-card">
                          <CardContent className="p-8 h-full flex flex-col">
                            {/* Quote Icon */}
                            <Quote className="w-10 h-10 text-primary/20 mb-6" />

                            {/* Rating */}
                            <div className="flex gap-1 mb-6">
                              {[...Array(testimonial.attributes.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>

                            {/* Content */}
                            <p className="text-muted-foreground font-light mb-8 italic line-clamp-4 flex-grow">
                              "{testimonial.attributes.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 mt-auto">
                              <Avatar className="w-12 h-12">
                                {avatarUrl && <AvatarImage src={avatarUrl} alt={testimonial.attributes.name} />}
                                <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-light text-lg">{testimonial.attributes.name}</p>
                                <p className="text-sm text-muted-foreground font-light">
                                  {testimonial.attributes.role}, {testimonial.attributes.company}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )
                  },
                )
              ) : (
                // No testimonials found
                <div className="w-full text-center py-12">
                  <p className="text-muted-foreground">No testimonials available at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
