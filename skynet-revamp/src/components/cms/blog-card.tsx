"use client"

import { motion } from "framer-motion"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { BlogPost } from "@/types/strapi"
import { getStrapiMedia } from "@/lib/strapi"

interface BlogCardProps {
  post: BlogPost & { id: number }
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const imageUrl = post.featuredImage?.data
    ? getStrapiMedia(post.featuredImage.data.attributes.url)
    : "/placeholder-blog.jpg"

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true }}
    >
      <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 group">
        <Link href={`/blog/${post.slug}`}>
          <div className="relative h-56 overflow-hidden">
            <Image
              src={imageUrl || "/placeholder-blog.jpg"}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {post.category?.data && (
              <Badge className="absolute top-4 left-4 bg-primary/90 hover:bg-primary text-white border-0">
                {post.category.data.attributes.name}
              </Badge>
            )}
          </div>

          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-light mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" strokeWidth={1.5} />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              {post.author?.data && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" strokeWidth={1.5} />
                  {post.author.data.attributes.name}
                </span>
              )}
            </div>

            <h3 className="text-xl font-light mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            <p className="text-muted-foreground font-light line-clamp-3 mb-6 text-justify">{post.excerpt}</p>

            <div className="flex items-center text-primary font-light">
              Read More
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </div>
          </div>
        </Link>
      </Card>
    </motion.article>
  )
}
