"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import LegalPageContent from "@/components/common/LegalPageContent"
import { fetchLegalPage, LegalPage } from "@/lib/strapi-legal"

export default function PrivacyPage() {
  const [page, setPage] = useState<LegalPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLegalPage("privacy")
      .then((data) => {
        console.log("Privacy page data:", data)
        setPage(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error loading privacy policy:", error)
        setIsLoading(false)
      })
  }, [])

  // Fallback content if CMS is not available
  const fallbackContent = (
    <div className="prose prose-gray max-w-none">
      <p className="text-muted-foreground mb-6">Last updated: January 2024</p>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">1. Information We Collect</h2>
        <p className="text-muted-foreground mb-4">
          We collect information you provide directly to us, such as when you create an account, make a shipment,
          request a quote, or contact us for support.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">2. How We Use Your Information</h2>
        <p className="text-muted-foreground mb-4">
          We use the information we collect to provide, maintain, and improve our services, process transactions, send
          notifications, and respond to your comments and questions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">3. Information Sharing</h2>
        <p className="text-muted-foreground mb-4">
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
          except as described in this policy or as required by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">4. Data Security</h2>
        <p className="text-muted-foreground mb-4">
          We implement appropriate technical and organizational measures to protect your personal information against
          unauthorized access, alteration, disclosure, or destruction.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">5. Contact Us</h2>
        <p className="text-muted-foreground">
          If you have any questions about this Privacy Policy, please contact us through our customer service channels or visit our contact page.
        </p>
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
                Privacy <span className="text-primary">Policy</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                Learn how we protect and manage your personal information.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <LegalPageContent
              page={page}
              fallbackTitle="Privacy Policy"
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
