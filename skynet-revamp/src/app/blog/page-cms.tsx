// Example: Blog page with CMS integration
// Rename this to page.tsx when implementing CMS

import { fetchAPI, strapiQuery } from "@/lib/strapi"
import { BlogPost } from "@/types/strapi"
import { StrapiResponse, StrapiData } from "@/lib/strapi"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import BlogCard from "@/components/cms/blog-card"
import { Button } from "@/components/ui/button"

async function getBlogPosts(page: number = 1) {
  try {
    const response: StrapiResponse<StrapiData<BlogPost>[]> = await fetchAPI(
      "/posts",
      strapiQuery.build(
        strapiQuery.populate(["featuredImage", "author", "category"]),
        strapiQuery.sort("publishedAt:desc"),
        strapiQuery.pagination(page, 9),
      ),
    )

    return {
      posts: response.data.map((item) => ({
        ...item.attributes,
        id: item.id,
      })),
      pagination: response.meta.pagination,
    }
  } catch (error) {
    console.error("Failed to fetch blog posts:", error)
    return { posts: [], pagination: null }
  }
}

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1
  const { posts, pagination } = await getBlogPosts(currentPage)

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-muted/20 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
                Latest <span className="text-primary">News</span> & Updates
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light">
                Stay informed about the latest developments in logistics, shipping trends, and company updates.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-20 md:py-24 bg-white dark:bg-black">
          <div className="container">
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pageCount > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} asChild>
                      <a href={`/blog?page=${currentPage - 1}`}>Previous</a>
                    </Button>

                    <div className="flex items-center gap-1 mx-4">
                      {[...Array(pagination.pageCount)].map((_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? "default" : "ghost"}
                          size="sm"
                          className="w-10 h-10"
                          asChild
                        >
                          <a href={`/blog?page=${i + 1}`}>{i + 1}</a>
                        </Button>
                      ))}
                    </div>

                    <Button variant="outline" size="sm" disabled={currentPage === pagination.pageCount} asChild>
                      <a href={`/blog?page=${currentPage + 1}`}>Next</a>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-light">No blog posts available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                Stay <span className="text-primary">Updated</span>
              </h2>
              <p className="text-lg text-muted-foreground font-light mb-8">
                Subscribe to our newsletter for the latest logistics insights and company news.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-12 w-full rounded-full border border-input bg-background px-6 py-2 text-sm font-light placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
                <Button type="submit" className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 font-light">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
