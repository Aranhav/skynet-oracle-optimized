"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Testimonial } from "@/types/strapi"
import { getStrapiMedia } from "@/lib/strapi"
import Image from "next/image"

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <Card className="p-10 md:p-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 relative">
            <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/10" strokeWidth={1} />

            <div className="flex items-center gap-5 mb-8">
              {currentTestimonial.avatar?.data && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src={getStrapiMedia(currentTestimonial.avatar.data.attributes.url) || ""}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h4 className="text-lg font-light">{currentTestimonial.name}</h4>
                <p className="text-sm text-muted-foreground font-light">
                  {currentTestimonial.role} at {currentTestimonial.company}
                </p>
              </div>
            </div>

            <blockquote className="text-lg md:text-xl font-light leading-relaxed mb-8 text-foreground/90">
              "{currentTestimonial.content}"
            </blockquote>

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < currentTestimonial.rating
                      ? "fill-primary text-primary"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800"
                  }`}
                  strokeWidth={1}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={prevTestimonial}
          className="rounded-full border-gray-200 dark:border-gray-800 hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </Button>

        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextTestimonial}
          className="rounded-full border-gray-200 dark:border-gray-800 hover:border-primary hover:text-primary"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  )
}
