"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase,
  MapPin,
  Clock,
  Building2,
  Search,
  ChevronDown,
  Globe,
  Users,
  TrendingUp,
  SlidersHorizontal,
  X,
} from "lucide-react"
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetchAPI, strapiQuery } from "@/lib/strapi-demo"
import { Job } from "@/types/strapi"
import { StrapiResponse, StrapiData } from "@/lib/strapi"
import Link from "next/link"

export default function CareerPage() {
  const [jobs, setJobs] = useState<(Job & { id: number })[]>([])
  const [filteredJobs, setFilteredJobs] = useState<(Job & { id: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)

  // Collapsible filter section states
  const [departmentExpanded, setDepartmentExpanded] = useState(true)
  const [locationExpanded, setLocationExpanded] = useState(true)
  const [typeExpanded, setTypeExpanded] = useState(true)

  // Fetch jobs from API
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response: StrapiResponse<StrapiData<Job>[]> = await fetchAPI(
          "/jobs",
          strapiQuery.build(
            strapiQuery.populate("*"),
            { "filters[active][$eq]": true },
            strapiQuery.sort("createdAt:desc"),
          ),
        )

        const jobsData = response.data.map((item) => ({
          ...item.attributes,
          id: item.id,
        }))

        setJobs(jobsData)
        setFilteredJobs(jobsData)
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((job) => job.department === departmentFilter)
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((job) => job.location === locationFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((job) => job.type === typeFilter)
    }

    setFilteredJobs(filtered)
  }, [searchQuery, departmentFilter, locationFilter, typeFilter, jobs])

  // Get unique values for filters
  const departments = ["all", ...Array.from(new Set(jobs.map((job) => job.department)))]
  const locations = ["all", ...Array.from(new Set(jobs.map((job) => job.location)))]
  const types = ["all", ...Array.from(new Set(jobs.map((job) => job.type)))]

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-24">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6"
              >
                Join Our <span className="text-primary font-light">Team</span>
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
                Build your career with a global leader in logistics and supply chain solutions
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
                    placeholder="Search for positions..."
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
                      <ScrollArea className="h-[min(480px,80vh)] p-4">
                        <div className="space-y-3">
                          {/* Department Filter */}
                          <div>
                            <button
                              onClick={() => setDepartmentExpanded(!departmentExpanded)}
                              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
                                Department
                              </DropdownMenuLabel>
                              <ChevronDown
                                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                                  departmentExpanded ? "rotate-180" : ""
                                }`}
                                strokeWidth={1.5}
                              />
                            </button>
                            <AnimatePresence>
                              {departmentExpanded && (
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
                                    <DropdownMenuRadioGroup
                                      value={departmentFilter}
                                      onValueChange={setDepartmentFilter}
                                    >
                                      <DropdownMenuRadioItem
                                        value="all"
                                        className="font-light text-sm py-2 px-3 ml-3 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                                      >
                                        All Departments
                                      </DropdownMenuRadioItem>
                                      {departments.slice(1).map((dept) => (
                                        <DropdownMenuRadioItem
                                          key={dept}
                                          value={dept}
                                          className="font-light text-sm py-2 px-3 ml-3 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                                        >
                                          {dept}
                                        </DropdownMenuRadioItem>
                                      ))}
                                    </DropdownMenuRadioGroup>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <DropdownMenuSeparator />

                          {/* Location Filter */}
                          <div>
                            <button
                              onClick={() => setLocationExpanded(!locationExpanded)}
                              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
                                Location
                              </DropdownMenuLabel>
                              <ChevronDown
                                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                                  locationExpanded ? "rotate-180" : ""
                                }`}
                                strokeWidth={1.5}
                              />
                            </button>
                            <AnimatePresence>
                              {locationExpanded && (
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
                                    <DropdownMenuRadioGroup value={locationFilter} onValueChange={setLocationFilter}>
                                      <DropdownMenuRadioItem
                                        value="all"
                                        className="font-light text-sm py-2 px-3 ml-3 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                                      >
                                        All Locations
                                      </DropdownMenuRadioItem>
                                      {locations.slice(1).map((loc) => (
                                        <DropdownMenuRadioItem
                                          key={loc}
                                          value={loc}
                                          className="font-light text-sm py-2 px-3 ml-3 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                                        >
                                          {loc}
                                        </DropdownMenuRadioItem>
                                      ))}
                                    </DropdownMenuRadioGroup>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <DropdownMenuSeparator />

                          {/* Type Filter */}
                          <div>
                            <button
                              onClick={() => setTypeExpanded(!typeExpanded)}
                              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
                                Job Type
                              </DropdownMenuLabel>
                              <ChevronDown
                                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                                  typeExpanded ? "rotate-180" : ""
                                }`}
                                strokeWidth={1.5}
                              />
                            </button>
                            <AnimatePresence>
                              {typeExpanded && (
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
                                    <DropdownMenuRadioGroup value={typeFilter} onValueChange={setTypeFilter}>
                                      <DropdownMenuRadioItem
                                        value="all"
                                        className="font-light text-sm py-2 px-3 ml-3 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                                      >
                                        All Types
                                      </DropdownMenuRadioItem>
                                      {types.slice(1).map((type) => (
                                        <DropdownMenuRadioItem
                                          key={type}
                                          value={type}
                                          className="font-light text-sm py-2 px-3 ml-3 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                                        >
                                          {type}
                                        </DropdownMenuRadioItem>
                                      ))}
                                    </DropdownMenuRadioGroup>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Clear Filters */}
                          {(departmentFilter !== "all" || locationFilter !== "all" || typeFilter !== "all") && (
                            <>
                              <DropdownMenuSeparator />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full font-light text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                onClick={() => {
                                  setDepartmentFilter("all")
                                  setLocationFilter("all")
                                  setTypeFilter("all")
                                }}
                              >
                                Clear all filters
                              </Button>
                            </>
                          )}
                        </div>
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Active Filters Pills */}
                {(departmentFilter !== "all" || locationFilter !== "all" || typeFilter !== "all") && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 justify-center mt-4"
                  >
                    {departmentFilter !== "all" && (
                      <Badge
                        variant="secondary"
                        className="pl-3 pr-2 py-1.5 font-light text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30 dark:hover:bg-primary/30 transition-colors cursor-pointer rounded-full"
                        onClick={() => setDepartmentFilter("all")}
                      >
                        {departmentFilter}
                        <X className="w-3 h-3 ml-2" strokeWidth={2} />
                      </Badge>
                    )}
                    {locationFilter !== "all" && (
                      <Badge
                        variant="secondary"
                        className="pl-3 pr-2 py-1.5 font-light text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30 dark:hover:bg-primary/30 transition-colors cursor-pointer rounded-full"
                        onClick={() => setLocationFilter("all")}
                      >
                        {locationFilter}
                        <X className="w-3 h-3 ml-2" strokeWidth={2} />
                      </Badge>
                    )}
                    {typeFilter !== "all" && (
                      <Badge
                        variant="secondary"
                        className="pl-3 pr-2 py-1.5 font-light text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30 dark:hover:bg-primary/30 transition-colors cursor-pointer rounded-full"
                        onClick={() => setTypeFilter("all")}
                      >
                        {typeFilter}
                        <X className="w-3 h-3 ml-2" strokeWidth={2} />
                      </Badge>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Jobs Grid */}
        <section className="py-16 md:py-24 min-h-screen">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-12"
              >
                <p className="text-center text-muted-foreground font-light">
                  {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"} available
                </p>
              </motion.div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground font-light">Loading positions...</p>
                  </div>
                </div>
              ) : filteredJobs.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredJobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Link href={`/career/${job.id}`} className="block group">
                          <Card className="h-full p-8 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-800/30 shadow-sm hover:shadow-md hover:border-gray-300/50 dark:hover:border-gray-700/50 transition-all duration-300">
                            <div className="space-y-4">
                              {/* Job Title */}
                              <div>
                                <h3 className="text-2xl font-light mb-2 group-hover:text-primary transition-colors">
                                  {job.title}
                                </h3>
                                <p className="text-muted-foreground font-light">
                                  {job.department} • {job.location}
                                </p>
                              </div>

                              {/* Job Type Badge */}
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant="secondary"
                                  className="font-light text-xs px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 dark:bg-primary/15 dark:text-primary dark:border-primary/25 rounded-full"
                                >
                                  {job.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-light">
                                  {new Date(job.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <Briefcase className="w-10 h-10 text-gray-400" strokeWidth={1} />
                  </div>
                  <h3 className="text-2xl font-light mb-3">No positions found</h3>
                  <p className="text-muted-foreground font-light text-lg">
                    Try adjusting your filters or check back later
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-950/50">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-24"
              >
                <h2 className="text-4xl md:text-5xl font-light mb-6">
                  Why <span className="text-primary font-light">Skynet</span>?
                </h2>
                <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                  Be part of a team that's shaping the future of global logistics
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-center"
                >
                  <div className="mb-6">
                    <Globe className="w-12 h-12 text-primary mx-auto" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-light mb-3">Global Impact</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Work on projects that connect businesses across 209 countries
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="mb-6">
                    <Users className="w-12 h-12 text-primary mx-auto" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-light mb-3">Diverse Culture</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Join a multicultural team with diverse perspectives
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center"
                >
                  <div className="mb-6">
                    <TrendingUp className="w-12 h-12 text-primary mx-auto" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-light mb-3">Career Growth</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Continuous learning with clear progression paths
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
