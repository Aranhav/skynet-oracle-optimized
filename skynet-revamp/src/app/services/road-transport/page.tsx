import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Truck, MapPin, IndianRupee, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  "Pan India coverage with 10,000+ pin codes",
  "Real-time GPS tracking",
  "Cost-effective pricing",
  "Safe and secure transportation",
  "Flexible pickup and delivery options",
  "Express and economy options available",
]

export const dynamic = "force-dynamic"

export default function RoadTransportPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32">
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <Truck className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-light mb-6">Delivery By Road</h1>
              <p className="text-xl text-muted-foreground">
                Cost-effective road transport solutions for reliable delivery across domestic and regional routes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Pan India Coverage</h3>
                <p className="text-muted-foreground">10,000+ pin codes served</p>
              </div>
              <div className="text-center">
                <IndianRupee className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Affordable Rates</h3>
                <p className="text-muted-foreground">Best prices for surface transport</p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Timely Delivery</h3>
                <p className="text-muted-foreground">On-time delivery guarantee</p>
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
                <Link href="/quote">Get Road Transport Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
