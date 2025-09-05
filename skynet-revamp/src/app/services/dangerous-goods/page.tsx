import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { AlertTriangle, Shield, FileCheck, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  "IATA certified dangerous goods handling",
  "Full compliance with international regulations",
  "Specialized packaging and labeling services",
  "Expert documentation preparation",
  "Trained and certified handling staff",
  "End-to-end safety monitoring",
]

export default function DangerousGoodsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32">
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <AlertTriangle className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-light mb-6">Dangerous Goods</h1>
              <p className="text-xl text-muted-foreground">
                Expert handling and transportation of hazardous materials with full regulatory compliance and maximum
                safety standards.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <Shield className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Safety First</h3>
                <p className="text-muted-foreground">Maximum protection protocols</p>
              </div>
              <div className="text-center">
                <FileCheck className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Full Compliance</h3>
                <p className="text-muted-foreground">IATA & regulatory standards</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Expert Team</h3>
                <p className="text-muted-foreground">Certified handling specialists</p>
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
                <Link href="/quote">Get Dangerous Goods Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
