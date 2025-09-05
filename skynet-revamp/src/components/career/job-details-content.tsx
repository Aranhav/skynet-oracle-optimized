"use client"

import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Clock, Building2, Briefcase, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Job } from "@/types/strapi"

interface JobDetailsContentProps {
  job: Job & { id: number }
  relatedJobs: (Job & { id: number })[]
  parsedDescription: string
  parsedRequirements: string
  parsedBenefits: string | null
}

export default function JobDetailsContent({
  job,
  relatedJobs,
  parsedDescription,
  parsedRequirements,
  parsedBenefits,
}: JobDetailsContentProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <Link
                href="/career"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
              >
                <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Back to all positions
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-6">{job.title}</h1>
                <p className="text-xl text-muted-foreground font-extralight mb-8">
                  {job.department} • {job.location}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 font-light rounded-full px-10 h-12 text-base shadow-sm hover:shadow-md transition-all"
                    asChild
                  >
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                      Apply for this role
                    </a>
                  </Button>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-light">
                    <Badge
                      variant="secondary"
                      className="font-light px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 dark:bg-primary/15 dark:text-primary dark:border-primary/25 rounded-full"
                    >
                      {job.type}
                    </Badge>
                    <span>
                      Posted{" "}
                      {new Date(job.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-24"
            >
              {/* Description */}
              <div>
                <h2 className="text-2xl font-light mb-8 text-center">About this role</h2>
                <div
                  className="prose prose-lg max-w-none font-light
                    prose-headings:font-light prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:font-normal prose-strong:text-foreground
                    prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                    prose-li:marker:text-primary
                    dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: parsedDescription }}
                />
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-light mb-8 text-center">What we're looking for</h2>
                <div
                  className="prose prose-lg max-w-none font-light
                    prose-headings:font-light prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:font-normal prose-strong:text-foreground
                    prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                    prose-li:marker:text-primary
                    dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: parsedRequirements }}
                />
              </div>

              {/* Benefits */}
              {parsedBenefits && (
                <div>
                  <h2 className="text-2xl font-light mb-8 text-center">What we offer</h2>
                  <div
                    className="prose prose-lg max-w-none font-light
                      prose-headings:font-light prose-headings:text-foreground
                      prose-p:text-muted-foreground prose-p:leading-relaxed
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-strong:font-normal prose-strong:text-foreground
                      prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                      prose-li:marker:text-primary
                      dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: parsedBenefits }}
                  />
                </div>
              )}

              {/* Apply CTA */}
              <div className="text-center py-12 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-3xl font-extralight mb-6">Ready to get started?</h3>
                <p className="text-lg text-muted-foreground font-extralight mb-8">
                  Join us in shaping the future of logistics
                </p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 font-light rounded-full px-10 h-12 text-base shadow-sm hover:shadow-md transition-all"
                  asChild
                >
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                    Apply for this role
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Jobs */}
      {relatedJobs.length > 0 && (
        <section className="py-20 md:py-32 bg-gray-50/50 dark:bg-gray-950/50">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl font-extralight mb-16 text-center"
              >
                Other open positions
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {relatedJobs.map((relatedJob, index) => (
                  <motion.div
                    key={relatedJob.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Link href={`/career/${relatedJob.id}`} className="block group">
                      <Card className="h-full p-6 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-800/30 shadow-sm hover:shadow-md hover:border-gray-300/50 dark:hover:border-gray-700/50 transition-all duration-300">
                        <h3 className="text-xl font-light mb-3 group-hover:text-primary transition-colors">
                          {relatedJob.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-light">
                          {relatedJob.location} • {relatedJob.type}
                        </p>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
