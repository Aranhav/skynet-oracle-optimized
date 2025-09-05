"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, ChevronDown, HelpCircle, X } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetchFAQs, searchFAQs } from "@/lib/strapi-faqs"
import { FAQ } from "@/types/strapi"
import { parseMarkdownText, parseMarkdownInline } from "@/lib/markdown-parser"

export default function FAQsPage() {
  const [allFaqs, setAllFaqs] = useState<FAQ[]>([])
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const [categoryExpanded, setCategoryExpanded] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all FAQs
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchFAQs()
        setAllFaqs(data)
        setFilteredFaqs(data)
      } catch (error) {
        console.error("Error loading FAQs:", error)
        setError("Failed to load FAQs. Please try again later.")
        // Use fallback data
        setAllFaqs([])
        setFilteredFaqs([])
      } finally {
        setLoading(false)
      }
    }

    loadFAQs()
  }, [])

  // Filter FAQs based on search and category
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        setSearchLoading(true)
        try {
          const searchResults = await searchFAQs(searchQuery)
          let filtered = searchResults

          // Apply category filter on search results
          if (categoryFilter !== "all") {
            filtered = filtered.filter((faq) => faq.category === categoryFilter)
          }

          setFilteredFaqs(filtered)
        } catch (error) {
          console.error("Error searching FAQs:", error)
        } finally {
          setSearchLoading(false)
        }
      } else {
        // No search query, just filter by category
        let filtered = allFaqs

        if (categoryFilter !== "all") {
          filtered = filtered.filter((faq) => faq.category === categoryFilter)
        }

        setFilteredFaqs(filtered)
      }
    }

    const timeoutId = setTimeout(performSearch, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchQuery, categoryFilter, allFaqs])

  // Get unique categories from fetched FAQs
  const categories = ["all", ...Array.from(new Set(allFaqs.map((faq) => faq.category).filter(Boolean)))]

  const toggleExpanded = (id: string) => {
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

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
  }

  const hasActiveFilters = searchQuery || categoryFilter !== "all"

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-24 bg-gradient-to-b from-muted/20 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <Badge
                  variant="outline"
                  className="mb-8 font-light border-primary/20 bg-primary/5 text-primary px-4 py-2 rounded-full"
                >
                  <HelpCircle className="w-3 h-3 mr-2" strokeWidth={1.5} />
                  Help Center
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6"
              >
                Frequently Asked <span className="text-primary font-light">Questions</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-16 max-w-2xl mx-auto"
              >
                Find answers to common questions about our services, shipping, tracking, and more
              </motion.p>

              {/* Search Bar with Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative max-w-xl mx-auto"
              >
                <div className="relative group">
                  <Search
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                    strokeWidth={1.5}
                  />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search FAQs..."
                    className="h-14 pl-14 pr-14 text-base font-light rounded-full border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg focus:border-gray-300 transition-all duration-300"
                  />

                  {/* Filter Button */}
                  <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-72 p-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl"
                    >
                      <ScrollArea className="h-[min(320px,80vh)] p-4">
                        <div className="space-y-3">
                          {/* Category Filter */}
                          <div>
                            <button
                              onClick={() => setCategoryExpanded(!categoryExpanded)}
                              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <span className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
                                Category
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                                  categoryExpanded ? "rotate-180" : ""
                                }`}
                                strokeWidth={1.5}
                              />
                            </button>
                            <AnimatePresence>
                              {categoryExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    ease: [0.23, 1, 0.32, 1],
                                  }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-2">
                                    <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                                      {categories.map((category) => (
                                        <DropdownMenuRadioItem
                                          key={category}
                                          value={category}
                                          className="font-light text-sm py-2 px-3 ml-3 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                                        >
                                          {category === "all" ? "All Categories" : category}
                                        </DropdownMenuRadioItem>
                                      ))}
                                    </DropdownMenuRadioGroup>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="py-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-full">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`
                      px-6 py-2.5 rounded-full font-light text-sm transition-all duration-300
                      ${
                        categoryFilter === category
                          ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      }
                    `}
                  >
                    {category === "all" ? "All FAQs" : category}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-24 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Active Search */}
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 text-center"
                >
                  <p className="text-sm text-muted-foreground font-light">
                    Search results for:
                    <span className="ml-2 text-gray-900 dark:text-gray-100 font-normal">"{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-3 text-primary hover:text-primary/80 transition-colors"
                    >
                      Clear search
                    </button>
                  </p>
                </motion.div>
              )}
              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-20"
                >
                  <HelpCircle className="w-16 h-16 mx-auto mb-6 text-destructive/50" strokeWidth={1} />
                  <h3 className="text-2xl font-light mb-4">Oops! Something went wrong</h3>
                  <p className="text-muted-foreground font-light mb-8 max-w-md mx-auto">{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="rounded-full font-light"
                  >
                    Refresh Page
                  </Button>
                </motion.div>
              ) : loading || searchLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
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
              ) : filteredFaqs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-20"
                >
                  <HelpCircle className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" strokeWidth={1} />
                  <h3 className="text-2xl font-light mb-4">No FAQs Found</h3>
                  <p className="text-muted-foreground font-light mb-8 max-w-md mx-auto">
                    {searchQuery
                      ? `No results found for "${searchQuery}". Try different keywords or browse all FAQs.`
                      : "No FAQs available in this category."}
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="rounded-full font-light">
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {/* Category Sections */}
                  {categoryFilter === "all"
                    ? // Group by category when showing all
                      Array.from(new Set(filteredFaqs.map((faq) => faq.category))).sort().map((category) => {
                        const categoryFaqs = filteredFaqs.filter((faq) => faq.category === category)

                        if (categoryFaqs.length === 0) return null

                        return (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-12"
                          >
                            <h2 className="text-2xl font-light mb-6 text-primary">{category}</h2>
                            <div className="space-y-4">
                              {categoryFaqs.map((faq, index) => (
                                <motion.div
                                  key={`${category}-${index}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.5,
                                    delay: index * 0.05,
                                  }}
                                >
                                  <Card
                                    className={`
                                    bg-white dark:bg-gray-950/50 border border-gray-200/50 dark:border-gray-800/50 
                                    shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden
                                  `}
                                  >
                                    <button
                                      onClick={() => toggleExpanded(`${category}-${index}`)}
                                      className="w-full p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                                    >
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                          <h3 className="text-lg font-light text-primary leading-relaxed mb-1">
                                            {faq.question}
                                          </h3>
                                          {!expandedItems.has(`${category}-${index}`) && (
                                            <p className="text-sm text-muted-foreground font-light line-clamp-2">
                                              {parseMarkdownInline(faq.answer)}
                                            </p>
                                          )}
                                        </div>
                                        <div
                                          className={`
                                        w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                        ${expandedItems.has(`${category}-${index}`) ? "bg-primary/10" : "bg-gray-100 dark:bg-gray-800"}
                                        transition-all duration-300
                                      `}
                                        >
                                          <motion.div
                                            animate={{
                                              rotate: expandedItems.has(`${category}-${index}`) ? 180 : 0,
                                            }}
                                            transition={{
                                              duration: 0.3,
                                              ease: [0.23, 1, 0.32, 1],
                                            }}
                                          >
                                            <ChevronDown
                                              className={`w-5 h-5 transition-colors duration-300 ${
                                                expandedItems.has(`${category}-${index}`) ? "text-primary" : "text-muted-foreground"
                                              }`}
                                              strokeWidth={1.5}
                                            />
                                          </motion.div>
                                        </div>
                                      </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                      {expandedItems.has(`${category}-${index}`) && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: "auto",
                                            opacity: 1,
                                          }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{
                                            duration: 0.3,
                                            ease: [0.23, 1, 0.32, 1],
                                          }}
                                          className="overflow-hidden"
                                        >
                                          <div className="px-6 pb-6">
                                            <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4">
                                              <div className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                                                {parseMarkdownText(faq.answer)}
                                              </div>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )
                      })
                    : // Show filtered FAQs without category grouping
                      filteredFaqs.map((faq, index) => (
                        <motion.div
                          key={`faq-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                          <Card
                            className={`
                            bg-white dark:bg-gray-950/50 border border-gray-200/50 dark:border-gray-800/50 
                            shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden
                          `}
                          >
                            <button
                              onClick={() => toggleExpanded(`faq-${index}`)}
                              className="w-full p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-lg font-light text-primary leading-relaxed mb-1">
                                    {faq.question}
                                  </h3>
                                  {!expandedItems.has(`faq-${index}`) && (
                                    <p className="text-sm text-muted-foreground font-light line-clamp-2">
                                      {parseMarkdownInline(faq.answer)}
                                    </p>
                                  )}
                                </div>
                                <div
                                  className={`
                                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                ${expandedItems.has(`faq-${index}`) ? "bg-primary/10" : "bg-gray-100 dark:bg-gray-800"}
                                transition-all duration-300
                              `}
                                >
                                  <motion.div
                                    animate={{
                                      rotate: expandedItems.has(`faq-${index}`) ? 180 : 0,
                                    }}
                                    transition={{
                                      duration: 0.3,
                                      ease: [0.23, 1, 0.32, 1],
                                    }}
                                  >
                                    <ChevronDown
                                      className={`w-5 h-5 transition-colors duration-300 ${
                                        expandedItems.has(`faq-${index}`) ? "text-primary" : "text-muted-foreground"
                                      }`}
                                      strokeWidth={1.5}
                                    />
                                  </motion.div>
                                </div>
                              </div>
                            </button>

                            <AnimatePresence initial={false}>
                              {expandedItems.has(`faq-${index}`) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: [0.23, 1, 0.32, 1],
                                  }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-6 pb-6">
                                    <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4">
                                      <div className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                                        {parseMarkdownText(faq.answer)}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Card>
                        </motion.div>
                      ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-muted/20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-light mb-6">Still have questions?</h2>
              <p className="text-lg text-muted-foreground font-light mb-8">
                Our support team is here to help you with any queries you may have.
              </p>
              <Button size="lg" className="rounded-full font-light" asChild>
                <a href="/contact">Contact Support</a>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
