import { notFound } from "next/navigation"
import Image from "next/image"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { fetchServiceBySlug, getServiceIconName } from "@/lib/strapi-services"
import { getStrapiMedia } from "@/lib/strapi"
import * as Icons from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ServicePageProps {
  params: { slug: string }
}

// Icon helper function
function getIcon(iconName: string) {
  const icon = Icons[getServiceIconName(iconName) as keyof typeof Icons]
  return icon || Icons.Package
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await fetchServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

  const IconComponent = getIcon(service.attributes.icon)
  const highlights = service.attributes.Highlights || []
  const hasImage = service.attributes.image?.data?.attributes?.url
  const imageUrl = hasImage
    ? getStrapiMedia(service.attributes.image.data.attributes.url) || service.attributes.image.data.attributes.url
    : null

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        {hasImage ? (
          <section className="relative min-h-[60vh] flex items-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <Image src={imageUrl} alt={service.attributes.title} fill className="object-cover" priority />
              <div className="absolute inset-0 top-16 bg-gradient-to-b from-transparent dark:from-black/80 dark:top-0 via-black/75 to-black/70" />
            </div>
            {/* from-black/80 via-black/75 to-black/70 */}
            {/* Content on top of image */}
            <div className="container relative z-10 py-32 pt-48">
              <div className="mx-auto max-w-4xl text-center">
                <div className="p-5 mx-auto mb-6 w-20 h-20 rounded-2xl backdrop-blur-sm bg-white/10">
                  <IconComponent className="w-full h-full text-white" />
                </div>
                <h1 className="mb-6 text-5xl font-light text-white md:text-6xl">{service.attributes.title}</h1>
                <p className="mx-auto max-w-2xl text-xl text-gray-200">{service.attributes.shortDescription}</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-32 pt-48">
            <div className="container">
              <div className="mx-auto mb-16 max-w-4xl text-center">
                <div className="p-4 mx-auto mb-6 w-16 h-16 rounded-2xl bg-primary/10">
                  <IconComponent className="w-full h-full text-primary" />
                </div>
                <h1 className="mb-6 text-5xl font-light md:text-6xl">{service.attributes.title}</h1>
                <p className="text-xl text-muted-foreground">{service.attributes.shortDescription}</p>
              </div>
            </div>
          </section>
        )}

        {/* Rest of the content */}
        <section className="py-20">
          <div className="container">
            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="grid gap-8 mx-auto mb-16 max-w-5xl md:grid-cols-3">
                {highlights.map((highlight) => {
                  const HighlightIcon = getIcon(highlight.icon)
                  return (
                    <div key={highlight.id} className="text-center">
                      <div className="p-3 mx-auto mb-4 w-14 h-14 rounded-2xl bg-primary/10">
                        <HighlightIcon className="w-full h-full text-primary" />
                      </div>
                      <h3 className="mb-2 text-xl font-light text-foreground">{highlight.title}</h3>
                      <p className="text-muted-foreground">{highlight.description}</p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Description */}
            {service.attributes.description && (
              <div className="mx-auto max-w-3xl">
                <div className="space-y-4">
                  {service.attributes.description.split("\n").map((paragraph, index) => {
                    if (paragraph.startsWith("##")) {
                      return (
                        <h2 key={index} className="mt-12 mb-8 text-3xl font-light text-center text-foreground">
                          {paragraph.replace("##", "").trim()}
                        </h2>
                      )
                    } else if (paragraph.startsWith("-")) {
                      return (
                        <div key={index} className="flex gap-3 items-start mb-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                          <span className="text-lg text-foreground">{paragraph.replace("-", "").trim()}</span>
                        </div>
                      )
                    } else if (paragraph.trim()) {
                      // Parse bold text with **text**
                      const parsedText = paragraph.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return (
                            <strong key={i} className="font-semibold">
                              {part.slice(2, -2)}
                            </strong>
                          )
                        }
                        return part
                      })
                      
                      return (
                        <p key={index} className="mb-4 text-lg text-muted-foreground">
                          {parsedText}
                        </p>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 text-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700" asChild>
                <Link href="/quote">{service.attributes.ctaText || "Get Quote"}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Related Services */}
        {service.attributes.related_services?.data.length > 0 && (
          <section className="py-20 bg-gray-50 dark:bg-gray-950">
            <div className="container">
              <h2 className="mb-12 text-3xl font-light text-center">Related Services</h2>
              <div className="grid gap-8 mx-auto max-w-5xl md:grid-cols-3">
                {service.attributes.related_services.data.map((related) => {
                  const RelatedIcon = getIcon(related.attributes.icon)
                  return (
                    <Link
                      key={related.id}
                      href={`/services/${related.attributes.slug}`}
                      className="block p-8 bg-white rounded-xl transition-shadow dark:bg-black hover:shadow-lg group"
                    >
                      <div className="p-3 mb-6 w-14 h-14 rounded-2xl transition-transform duration-300 bg-primary/10 group-hover:scale-110">
                        <RelatedIcon className="w-full h-full text-primary" />
                      </div>
                      <h3 className="mb-4 text-xl font-light">{related.attributes.title}</h3>
                      <p className="mb-6 text-muted-foreground line-clamp-3">{related.attributes.shortDescription}</p>
                      <div className="inline-flex items-center text-sm font-light transition-transform text-primary group-hover:translate-x-1">
                        Learn More
                        <Icons.ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

// Temporarily disable static generation to fix build timeout
// Services will be rendered at runtime instead
export const dynamic = 'force-dynamic'

// Uncomment this when Strapi API is fully configured
// export async function generateStaticParams() {
//   try {
//     const apiUrl = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL
//     if (!apiUrl) {
//       console.warn('Strapi API URL not configured, skipping static generation')
//       return []
//     }

//     const response = await fetch(`${apiUrl}/api/services`, {
//       next: { revalidate: 3600 }
//     })
    
//     if (!response.ok) {
//       console.warn('Failed to fetch services for static generation')
//       return []
//     }

//     const data = await response.json()
//     return data.data?.map((service: any) => ({
//       slug: service.attributes.slug,
//     })) || []
//   } catch (error) {
//     console.error('Error generating static params:', error)
//     return []
//   }
// }
