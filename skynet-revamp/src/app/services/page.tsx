import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { fetchAllServices, getServiceIconName } from "@/lib/strapi-services"
import Link from "next/link"
import * as Icons from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FAQSection from "@/components/common/FAQSection"

// Icon helper function
function getIcon(iconName: string) {
  const icon = Icons[getServiceIconName(iconName) as keyof typeof Icons]
  return icon || Icons.Package
}

export default async function ServicesPage() {
  const services = await fetchAllServices()

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-muted/20 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
                Our <span className="text-primary">Services</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                Comprehensive logistics solutions for businesses of all sizes. From express delivery to warehousing,
                we've got you covered.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 md:py-32 bg-white dark:bg-black">
          <div className="container">
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => {
                  const IconComponent = getIcon(service.attributes.icon)
                  const highlights = service.attributes.Highlights || []

                  return (
                    <Link key={service.id} href={`/services/${service.attributes.slug}`} className="block h-full">
                      <Card className="group h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-card cursor-pointer">
                        <CardContent className="p-8 h-full flex flex-col">
                          {/* Icon */}
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 p-3 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-full h-full text-primary" strokeWidth={1.5} />
                          </div>

                          {/* Content */}
                          <h3 className="text-xl font-light mb-2 font-heading">{service.attributes.title}</h3>
                          <p className="text-muted-foreground mb-4 flex-grow font-light">
                            {service.attributes.shortDescription}
                          </p>

                          {/* Features from Highlights */}
                          {highlights.length > 0 && (
                            <ul className="space-y-2 mb-6">
                              {highlights.slice(0, 3).map((highlight) => {
                                const HighlightIcon = getIcon(highlight.icon)
                                return (
                                  <li
                                    key={highlight.id}
                                    className="flex items-start text-sm text-muted-foreground font-light"
                                  >
                                    <HighlightIcon className="w-4 h-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                                    {highlight.title}
                                  </li>
                                )
                              })}
                            </ul>
                          )}

                          {/* CTA */}
                          <div className="inline-flex items-center text-primary text-sm font-light group-hover:translate-x-1 transition-transform mt-auto">
                            {service.attributes.ctaText || "Learn More"}
                            <Icons.ArrowRight className="w-4 h-4 ml-2" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-light">No services available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Shipping FAQs Section */}
        <FAQSection
          category="Shipping"
          title="Shipping FAQs"
          description="Find answers to common questions about our shipping services, delivery times, and more."
          limit={6}
          showViewAll={true}
          className="bg-gradient-to-b from-background to-muted/20"
        />

        {/* CTA Section */}
        <section className="py-24 md:py-32 bg-white dark:bg-black">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                Ready to Get <span className="text-primary">Started</span>?
              </h2>
              <p className="text-lg text-muted-foreground font-light mb-8">
                Contact our team to discuss your logistics needs.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full text-sm font-light h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Quote
                </a>
                <a
                  href="https://portal.skynetww.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full text-sm font-light h-12 px-8 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Customer Portal
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
