import { fetchAPI, StrapiData, StrapiResponse } from "./strapi"

// Re-export the type
export type { StrapiData } from "./strapi"

// Testimonial types
export interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
  featured: boolean
  avatar?: {
    data: {
      id: number
      attributes: {
        name: string
        url: string
        formats: {
          thumbnail?: { url: string }
          small?: { url: string }
        }
      }
    } | null
  }
}

/**
 * Fetch all testimonials from Strapi
 */
export async function fetchAllTestimonials() {
  try {
    const response = (await fetchAPI("/testimonials", {
      populate: "avatar",
      sort: "createdAt:desc",
    })) as StrapiResponse<StrapiData<Testimonial>[]>

    return response.data
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

/**
 * Fetch featured testimonials for homepage
 */
export async function fetchFeaturedTestimonials() {
  try {
    const response = (await fetchAPI("/testimonials", {
      "filters[featured][$eq]": true,
      populate: "avatar",
      sort: "createdAt:desc",
      "pagination[pageSize]": 10,
    })) as StrapiResponse<StrapiData<Testimonial>[]>

    return response.data
  } catch (error) {
    console.error("Error fetching featured testimonials:", error)
    return []
  }
}

/**
 * Get testimonial avatar URL
 */
export function getTestimonialAvatarUrl(testimonial: Testimonial): string | null {
  if (!testimonial.avatar?.data?.attributes?.url) return null

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || ""
  const avatarUrl = testimonial.avatar.data.attributes.url

  // Use thumbnail format if available, otherwise use original
  const thumbnailUrl = testimonial.avatar.data.attributes.formats?.thumbnail?.url
  const finalUrl = thumbnailUrl || avatarUrl

  // Return full URL
  return finalUrl.startsWith("http") ? finalUrl : `${baseUrl}${finalUrl}`
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
