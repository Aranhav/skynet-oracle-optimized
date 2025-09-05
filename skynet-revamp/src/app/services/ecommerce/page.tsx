import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ShoppingCart, Package, TrendingUp, RotateCcw, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  "Integration with major e-commerce platforms",
  "Same-day and next-day delivery options",
  "Cash on delivery (COD) services",
  "Automated order tracking and notifications",
  "Bulk shipping discounts available",
  "Returns management solutions",
]

export default function EcommercePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32">
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <ShoppingCart className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-light mb-6">E-commerce Delivery</h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive logistics solutions for online businesses, from first mile to last mile delivery with
                seamless integration.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <Package className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Fast Fulfillment</h3>
                <p className="text-muted-foreground">Same-day dispatch for orders</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Scale Your Business</h3>
                <p className="text-muted-foreground">Grow with flexible solutions</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">Easy Returns</h3>
                <p className="text-muted-foreground">Hassle-free returns process</p>
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
                <Link href="/quote">Get E-commerce Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
