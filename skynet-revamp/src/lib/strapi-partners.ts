import { fetchAPI, StrapiData, StrapiResponse } from "./strapi"

// Re-export the type
export type { StrapiData } from "./strapi"

// Partner types
export interface Partner {
  name: string
  logo: {
    data: {
      id: number
      attributes: {
        name: string
        url: string
        formats: {
          thumbnail?: { url: string }
          small?: { url: string }
          medium?: { url: string }
          large?: { url: string }
        }
      }
    }
  }
  website?: string
  featured: boolean
  order: number
  category?: "technology" | "logistics" | "ecommerce" | "financial" | "other"
}

/**
 * Fetch all partners from Strapi
 */
export async function fetchAllPartners() {
  try {
    const response = (await fetchAPI("/partners", {
      populate: "logo",
      sort: "order:asc",
    })) as StrapiResponse<StrapiData<Partner>[]>

    return response.data
  } catch (error) {
    console.error("Error fetching partners:", error)
    // Return empty array on error (including 403 Forbidden)
    return []
  }
}

/**
 * Fetch featured partners for homepage
 */
export async function fetchFeaturedPartners() {
  try {
    const response = (await fetchAPI("/partners", {
      "filters[featured][$eq]": true,
      populate: "logo",
      sort: "order:asc",
      "pagination[pageSize]": 20,
    })) as StrapiResponse<StrapiData<Partner>[]>

    return response.data
  } catch (error) {
    console.error("Error fetching featured partners:", error)
    // Return empty array on error (including 403 Forbidden)
    return []
  }
}

/**
 * Get partner logo URL
 */
export function getPartnerLogoUrl(partner: Partner): string | null {
  if (!partner.logo?.data?.attributes?.url) return null

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || ""
  const logoUrl = partner.logo.data.attributes.url

  // Use small format if available, otherwise use original
  const smallUrl = partner.logo.data.attributes.formats?.small?.url
  const finalUrl = smallUrl || logoUrl

  // Return full URL
  return finalUrl.startsWith("http") ? finalUrl : `${baseUrl}${finalUrl}`
}
