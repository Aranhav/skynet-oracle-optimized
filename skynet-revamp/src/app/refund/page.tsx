"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import LegalPageContent from "@/components/common/LegalPageContent"
import { fetchLegalPage, LegalPage } from "@/lib/strapi-legal"

export default function RefundPage() {
  const [page, setPage] = useState<LegalPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLegalPage("refund")
      .then((data) => {
        setPage(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error loading refund policy:", error)
        setIsLoading(false)
      })
  }, [])
  // Fallback content if CMS is not available
  const fallbackContent = (
    <div className="prose prose-gray max-w-none">
      <p className="text-muted-foreground mb-6">Last updated: January 2024</p>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">1. Cancellation Policy</h2>
        <p className="text-muted-foreground mb-4">
          Shipments can be cancelled before pickup without any charges. Once the shipment is picked up, cancellation
          charges may apply based on the distance traveled and service type.
        </p>
        <ul className="list-disc pl-6 text-muted-foreground mb-4">
          <li>Before pickup: No charges</li>
          <li>After pickup (within same city): 25% of shipping cost</li>
          <li>After pickup (inter-city/international): 50% of shipping cost</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">2. Refund Process</h2>
        <p className="text-muted-foreground mb-4">
          Refunds for eligible cancellations will be processed within 7-10 business days. The refund will be credited to
          the original payment method used during booking.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">3. Service Failure Refunds</h2>
        <p className="text-muted-foreground mb-4">
          In case of service failure on our part (lost shipment, excessive delay beyond committed timeline), we offer:
        </p>
        <ul className="list-disc pl-6 text-muted-foreground mb-4">
          <li>Full refund of shipping charges</li>
          <li>Compensation as per declared value (subject to terms)</li>
          <li>Priority handling for future shipments</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">4. Non-Refundable Services</h2>
        <p className="text-muted-foreground mb-4">The following services are non-refundable:</p>
        <ul className="list-disc pl-6 text-muted-foreground mb-4">
          <li>Express same-day delivery (after pickup)</li>
          <li>Special handling charges</li>
          <li>Insurance premiums</li>
          <li>Customs duties and taxes</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">5. How to Request a Refund</h2>
        <p className="text-muted-foreground mb-4">To request a refund or cancellation:</p>
        <ol className="list-decimal pl-6 text-muted-foreground mb-4">
          <li>Log in to your account on our website</li>
          <li>Go to 'My Shipments' section</li>
          <li>Select the shipment and click 'Cancel/Refund'</li>
          <li>Or contact our customer service</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-light mb-4">6. Contact Us</h2>
        <p className="text-muted-foreground">For refund-related queries, please</p>
        <p className="text-muted-foreground mt-2">
          <Link href="/contact" className="text-primary hover:underline">
            Visit our contact page
          </Link>
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
                Shipping <span className="text-primary">Policy</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light">Our comprehensive shipping terms and policies.</p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <LegalPageContent
              page={page}
              fallbackTitle="Shipping Policy"
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
