import HeroSection from "@/components/sections/hero"
import AboutUsSection from "@/components/sections/about-us"
import NetworkSection from "@/components/sections/network"
import CoreStrengthsSection from "@/components/sections/core-strengths"
import ServicesSection from "@/components/sections/services"
import BrandsSection from "@/components/sections/brands"
import GlobalPresenceSection from "@/components/sections/global-presence"
import ExperienceSection from "@/components/sections/experience"
import PartnerWithUsSection from "@/components/sections/partner-with-us"
import TestimonialsSection from "@/components/sections/testimonials"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-black dark:via-gray-950/50 dark:to-black">
        {/* 1. Hero Section - White background */}
        <HeroSection />

        {/* 2. Services Section - Light gray background */}
        <div className="bg-gradient-to-b from-transparent via-gray-50 to-transparent dark:from-transparent dark:via-gray-950 dark:to-transparent">
          <ServicesSection />
        </div>

        {/* 3. Trusted by Leading Brands - White background */}
        <BrandsSection />

        {/* 4. Daily Flights, Dependable Deliveries - Light gray background */}
        <div className="bg-gradient-to-b from-transparent via-gray-50 to-transparent dark:from-transparent dark:via-gray-950 dark:to-transparent">
          <GlobalPresenceSection />
        </div>

        {/* 5. About Us Section - White background */}
        <AboutUsSection />

        {/* 6. Network Section - Light gray background */}
        <div className="bg-gradient-to-b from-transparent via-gray-50 to-transparent dark:from-transparent dark:via-gray-950 dark:to-transparent">
          <NetworkSection />
        </div>

        {/* 7. Core Strengths Section - White background */}
        <CoreStrengthsSection />

        {/* 8. Experience Section - Light gray background */}
        <div className="bg-gradient-to-b from-transparent via-gray-50 to-transparent dark:from-transparent dark:via-gray-950 dark:to-transparent">
          <ExperienceSection />
        </div>

        {/* 9. Testimonials Section - White background */}
        <TestimonialsSection />

        {/* 10. Partner With Us Section - Light gray background */}
        <div className="bg-gradient-to-b from-transparent via-gray-50 to-transparent dark:from-transparent dark:via-gray-950 dark:to-transparent">
          <PartnerWithUsSection />
        </div>
      </main>
      <Footer />
    </>
  )
}
