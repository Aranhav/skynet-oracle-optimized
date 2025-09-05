"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import LegalPageContent from "@/components/common/LegalPageContent"
import { fetchLegalPage, LegalPage } from "@/lib/strapi-legal"

export default function TermsPage() {
  const [page, setPage] = useState<LegalPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLegalPage("terms")
      .then((data) => {
        setPage(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error loading terms:", error)
        setIsLoading(false)
      })
  }, [])
  // Fallback content if CMS is not available
  const fallbackContent = (
    <div className="prose prose-gray max-w-none">
      <p className="text-muted-foreground mb-6">Effective Date: January 2024</p>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground mb-4">
          By using Skynet India's services, you agree to be bound by these Terms and Conditions. If you do not agree to
          these terms, please do not use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">2. Services</h2>
        <p className="text-muted-foreground mb-4">
          Skynet India provides express courier, logistics, and related services. Service availability and delivery
          times may vary based on location and service type selected.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">3. Prohibited Items</h2>
        <p className="text-muted-foreground mb-4">
          You agree not to ship any prohibited items including but not limited to dangerous goods, illegal substances,
          weapons, or any items restricted by law. A complete list is available upon request.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">4. Liability Limitations</h2>
        <p className="text-muted-foreground mb-4">
          Our liability for loss or damage is limited as per our standard terms. We recommend purchasing additional
          insurance for high-value shipments.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">5. Payment Terms</h2>
        <p className="text-muted-foreground mb-4">
          Payment is due upon receipt of invoice unless other arrangements have been made. We accept various payment
          methods including credit cards, bank transfers, and COD where available.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">6. Governing Law</h2>
        <p className="text-muted-foreground mb-4">
          These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be
          subject to the exclusive jurisdiction of courts in Mumbai.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">7. Contact Information</h2>
        <p className="text-muted-foreground">For questions about these Terms & Conditions, please contact us through our customer service channels or visit our contact page.</p>
      </section>
    </div>
  )

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
                Terms & <span className="text-primary">Conditions</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                Please read these terms carefully before using our services.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <LegalPageContent
              page={page}
              fallbackTitle="Terms & Conditions"
              fallbackContent={fallbackContent}
              isLoading={isLoading}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
