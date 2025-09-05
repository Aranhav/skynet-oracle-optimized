"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { fetchAPI, strapiQuery } from "@/lib/strapi"
import { BlogPost } from "@/types/strapi"
import { StrapiResponse, StrapiData } from "@/lib/strapi"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { notFound } from "next/navigation"
import Image from "next/image"
import { getStrapiMedia } from "@/lib/strapi"
import { parseRichText } from "@/lib/strapi-rich-text"
import { Calendar, User, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BlogCard from "@/components/cms/blog-card"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch the blog post
        const response: StrapiResponse<StrapiData<BlogPost>[]> = await fetchAPI(
          "/blog-posts",
          strapiQuery.build(strapiQuery.populate(["featuredImage", "author", "category", "tags", "content"]), {
            "filters[slug][$eq]": slug,
          })
        )

        if (response.data.length === 0) {
          setError("Blog post not found")
          return
        }

        const blogPost = {
          ...response.data[0].attributes,
          id: response.data[0].id,
        }
        setPost(blogPost)

        // Fetch related posts if category exists
        if (blogPost.category?.data?.id) {
          try {
            const relatedResponse: StrapiResponse<StrapiData<BlogPost>[]> = await fetchAPI(
              "/blog-posts",
              strapiQuery.build(
                strapiQuery.populate(["featuredImage", "author", "category"]),
                {
                  "filters[category][id][$eq]": blogPost.category.data.id,
                  "filters[id][$ne]": blogPost.id,
                },
                strapiQuery.pagination(1, 3)
              )
            )

            setRelatedPosts(relatedResponse.data.map((item) => ({
              ...item.attributes,
              id: item.id,
            })))
          } catch (err) {
            console.error("Failed to fetch related posts:", err)
          }
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error)
        setError("Failed to load blog post")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadPost()
    }
  }, [slug])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20">
          <div className="container py-24">
            <p className="text-center text-muted-foreground">Loading blog post...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !post) {
    notFound()
  }

  const imageUrl = post.featuredImage?.data?.attributes?.url
  const authorName = post.author?.data?.attributes?.name || "Skynet Team"
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recent"

  const readingTime = post.content
    ? Math.ceil(JSON.stringify(post.content).split(" ").length / 200)
    : 5

  const parsedContent = post.content ? parseRichText(post.content) : ""

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted/20 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Back Button and Category */}
              <div className="flex items-center gap-4 mb-8">
                <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
                
                {/* Category Badge */}
                {post.category?.data && (
                  <Badge variant="secondary">
                    {post.category.data.attributes.name}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">{post.title}</h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {imageUrl && (
          <section className="pb-12 bg-background">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                  <Image
                    src={getStrapiMedia(imageUrl) || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-12 md:py-16 bg-white dark:bg-black">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div
                className="prose prose-lg dark:prose-invert max-w-none font-light"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />

              {/* Tags */}
              {post.tags?.data && post.tags.data.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.data.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.attributes.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/20">
            <div className="container">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-light mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light mb-4">Stay Updated</h2>
              <p className="text-lg text-muted-foreground mb-8 font-light">
                Get the latest insights and updates from Skynet India delivered to your inbox.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg" className="font-light">
                  <Link href="/blog">View More Articles</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-light">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}