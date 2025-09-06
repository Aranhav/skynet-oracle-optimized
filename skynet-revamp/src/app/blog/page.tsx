"use client"

import { useState, useEffect } from "react"
import { fetchAPI, strapiQuery } from "@/lib/strapi"
import { BlogPost } from "@/types/strapi"
import { StrapiResponse, StrapiData } from "@/lib/strapi"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import BlogCard from "@/components/cms/blog-card"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  const [posts, setPosts] = useState<(BlogPost & { id: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true)
        setError(null)
        
        const response: StrapiResponse<StrapiData<BlogPost>[]> = await fetchAPI(
          "/blog-posts",
          {
            populate: "*",
            "pagination[page]": 1,
            "pagination[pageSize]": 100,
            sort: "createdAt:desc",
          }
        )

        if (response.data) {
          setPosts(response.data.map((item) => ({
            ...item.attributes,
            id: item.id,
          })))
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error)
        setError("Failed to load blog posts")
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-muted/20 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
                Latest <span className="text-primary">Blogs</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                Stay informed about the latest developments in logistics, shipping trends, and company updates through
                our blog posts.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-24 md:py-32 bg-white dark:bg-black">
          <div className="container">
            {loading ? (
              <div className="text-center">
                <p className="text-muted-foreground">Loading blog posts...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground font-light text-lg">No blog posts available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}