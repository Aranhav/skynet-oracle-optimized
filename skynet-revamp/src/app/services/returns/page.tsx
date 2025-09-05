import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { RotateCcw, Globe, Zap, Package, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  "Seamless cross-border returns management",
  "Pre-printed return labels available",
  "Multiple drop-off location options",
  "Real-time return tracking system",
  "Flexible return policies support",
  "Integration with e-commerce platforms",
]

export const dynamic = "force-dynamic"

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32">
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <RotateCcw className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-light mb-6">Worldwide Returns</h1>
              <p className="text-xl text-muted-foreground">
                Streamlined international returns service making cross-border commerce easier for businesses and
                customers alike.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <Globe className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Global Returns</h3>
                <p className="text-muted-foreground">From anywhere in the world</p>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Fast Processing</h3>
                <p className="text-muted-foreground">Quick turnaround times</p>
              </div>
              <div className="text-center">
                <Package className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Easy Drop-off</h3>
                <p className="text-muted-foreground">Multiple convenient locations</p>
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
                <Link href="/quote">Get Returns Solution Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
