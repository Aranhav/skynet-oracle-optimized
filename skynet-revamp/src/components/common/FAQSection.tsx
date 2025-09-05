"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchFAQs } from "@/lib/strapi-faqs"
import { FAQ } from "@/types/strapi"
import Link from "next/link"
import { parseMarkdownText, parseMarkdownInline } from "@/lib/markdown-parser"

interface FAQSectionProps {
  category?: "General" | "Shipping" | "Tracking" | "Pricing" | "Support"
  limit?: number
  title?: string
  description?: string
  showViewAll?: boolean
  className?: string
}

export default function FAQSection({
  category,
  limit = 5,
  title = "Frequently Asked Questions",
  description,
  showViewAll = true,
  className = "",
}: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true)
        const data = await fetchFAQs(category)
        // Ensure we have valid FAQ data
        const validFaqs = data.filter(
          (faq) =>
            faq &&
            faq.id &&
            faq.question &&
            faq.answer &&
            typeof faq.question === "string" &&
            typeof faq.answer === "string",
        )
        setFaqs(limit ? validFaqs.slice(0, limit) : validFaqs)
      } catch (error) {
        console.error("Error loading FAQs:", error)
        setFaqs([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    loadFAQs()
  }, [category, limit])

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  className="p-6 bg-white dark:bg-gray-950/50 border border-gray-200/50 dark:border-gray-800/50 shadow-sm rounded-2xl"
                >
                  <div className="animate-pulse flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded-lg w-full"></div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full shrink-0"></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (faqs.length === 0) {
    // Return a placeholder message when no FAQs are available
    return (
      <section className={`py-24 md:py-32 ${className}`}>
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6 text-muted-foreground/30" strokeWidth={1} />
            <h3 className="text-2xl font-light mb-4">No FAQs Available</h3>
            <p className="text-muted-foreground font-light">
              {category ? `No FAQs found for ${category} category.` : "No FAQs available at this time."}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-24 md:py-32 ${className}`}>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-6 font-light border-primary/20 bg-primary/5 text-primary px-4 py-2 rounded-full"
            >
              <HelpCircle className="w-3 h-3 mr-2" strokeWidth={1.5} />
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">{title}</h2>
            {description && <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">{description}</p>}
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`
                    bg-white dark:bg-gray-950/50 border border-gray-200/50 dark:border-gray-800/50 
                    shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden
                  `}
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-light text-primary leading-relaxed mb-1">{faq.question}</h3>
                        {!expandedItems.has(faq.id) && faq.answer && (
                          <p className="text-sm text-muted-foreground font-light line-clamp-2">{parseMarkdownInline(faq.answer)}</p>
                        )}
                      </div>
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center shrink-0
                        ${expandedItems.has(faq.id) ? "bg-primary/10" : "bg-gray-100 dark:bg-gray-800"}
                        transition-all duration-300
                      `}
                      >
                        <motion.div
                          animate={{
                            rotate: expandedItems.has(faq.id) ? 180 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: [0.23, 1, 0.32, 1],
                          }}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-colors duration-300 ${
                              expandedItems.has(faq.id) ? "text-primary" : "text-muted-foreground"
                            }`}
                            strokeWidth={1.5}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedItems.has(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4">
                            <div className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">{parseMarkdownText(faq.answer)}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Link */}
          {showViewAll && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/faqs"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-light transition-colors"
              >
                View All FAQs
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" strokeWidth={1.5} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
