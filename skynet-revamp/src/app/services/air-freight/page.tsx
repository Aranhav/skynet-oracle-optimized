import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Plane, Clock, Globe, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  "1-7 days transit time globally",
  "Real-time tracking and updates",
  "Priority handling for urgent shipments",
  "Customs clearance assistance",
  "Temperature-controlled options",
  "Door-to-door delivery service",
]

export default function AirFreightPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32">
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <Plane className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-light mb-6">Delivery By Air</h1>
              <p className="text-xl text-muted-foreground">
                Swift and secure air freight with transit times between 1-7 working days to over 150 destinations
                worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <Clock className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Fast Transit</h3>
                <p className="text-muted-foreground">1-7 days delivery to major destinations</p>
              </div>
              <div className="text-center">
                <Globe className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Global Reach</h3>
                <p className="text-muted-foreground">150+ destinations worldwide</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Secure Handling</h3>
                <p className="text-muted-foreground">Priority handling with insurance</p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-light mb-8 text-center">Key Features</h2>
              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-16">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700" asChild>
                <Link href="/quote">Get Air Freight Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
