import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Mail, Globe, Shield, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  "Delivery to 190+ countries worldwide",
  "Express and economy service options",
  "Full customs documentation support",
  "Online tracking from pickup to delivery",
  "Competitive international rates",
  "Secure handling with proof of delivery",
]

export default function InternationalMailPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32">
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-light mb-6">International Mail</h1>
              <p className="text-xl text-muted-foreground">
                Reliable cross-border mail services connecting you to every corner of the world with speed and security.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <Globe className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Global Coverage</h3>
                <p className="text-muted-foreground">190+ countries served</p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Flexible Options</h3>
                <p className="text-muted-foreground">Express and economy services</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Customs Support</h3>
                <p className="text-muted-foreground">Complete documentation assistance</p>
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
                <Link href="/quote">Get International Mail Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
