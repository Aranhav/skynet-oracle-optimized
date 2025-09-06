// Strapi API integration utilities
const strapiUrl = typeof window === "undefined" 
  ? (process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337")
  : (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:3000")

interface FetchOptions extends RequestInit {
  params?: Record<string, any>
}

/**
 * Fetch data from Strapi API
 * @param path - API endpoint path (e.g., '/services', '/posts')
 * @param urlParamsObject - Query parameters for the request
 * @param options - Additional fetch options
 */
export async function fetchAPI(path: string, urlParamsObject: Record<string, any> = {}, options: FetchOptions = {}) {
  try {
    // Merge default options (No API token needed - public endpoints)
    const mergedOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Build query string with proper handling for nested objects
    const queryParams = new URLSearchParams()

    Object.entries(urlParamsObject).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "filters" && typeof value === "object") {
          // Handle filters object according to Strapi v4 format
          Object.entries(value).forEach(([filterKey, filterValue]) => {
            if (typeof filterValue === "object" && filterValue !== null) {
              // Handle nested filter objects (e.g., { $eq: 'value' })
              Object.entries(filterValue).forEach(([operator, operandValue]) => {
                queryParams.append(`filters[${filterKey}][${operator}]`, String(operandValue))
              })
            } else {
              queryParams.append(`filters[${filterKey}]`, String(filterValue))
            }
          })
        } else if (key === "populate") {
          // Handle populate parameter specially for components
          if (value === "*" || value === "deep") {
            queryParams.append("populate", "*")
          } else if (Array.isArray(value)) {
            value.forEach(field => queryParams.append("populate", field))
          } else {
            queryParams.append("populate", String(value))
          }
        } else if (typeof value === "object") {
          queryParams.append(key, JSON.stringify(value))
        } else {
          queryParams.append(key, String(value))
        }
      }
    })

    const queryString = queryParams.toString()

    const requestUrl = `${strapiUrl}/api${path}${queryString ? `?${queryString}` : ""}`

    console.log("Strapi request URL:", requestUrl)

    // Only add next revalidate on server-side
    const fetchOptions = typeof window === "undefined" ? { ...mergedOptions, next: { revalidate: 60 } } : mergedOptions

    const response = await fetch(requestUrl, fetchOptions)

    if (!response.ok) {
      console.error("Strapi API Error:", response.status, response.statusText)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Strapi fetch error:", error)
    throw error
  }
}

/**
 * Get the Strapi media URL
 * @param url - Media URL from Strapi
 */
export function getStrapiMedia(url: string | null) {
  if (!url) return null

  // Return the full URL if it's already absolute
  if (url.startsWith("http") || url.startsWith("//")) {
    return url
  }

  // Otherwise, prepend the Strapi URL
  return `${strapiUrl}${url}`
}

/**
 * Helper to build Strapi query parameters
 */
export const strapiQuery = {
  // Populate specific fields - fixed for components
  populate: (fields: string | string[]) => {
    // For '*' or deep population, return as is
    if (fields === '*' || fields === 'deep') {
      return { populate: '*' }
    }
    // For array of fields, join them
    if (Array.isArray(fields)) {
      return { populate: fields.join(",") }
    }
    // For single field
    return { populate: fields }
  },

  // Filter results
  filters: (filters: Record<string, any>) => ({
    filters,
  }),

  // Sort results
  sort: (fields: string | string[]) => ({
    sort: Array.isArray(fields) ? fields.join(",") : fields,
  }),

  // Pagination
  pagination: (page: number = 1, pageSize: number = 25) => ({
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
  }),

  // Combine multiple query options
  build: (...queries: Record<string, any>[]) => {
    return queries.reduce((acc, query) => ({ ...acc, ...query }), {})
  },
}

// Type definitions for Strapi responses
export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiAttributes {
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface StrapiData<T> {
  id: number
  attributes: T & StrapiAttributes
}

export interface StrapiMedia {
  data: {
    id: number
    attributes: {
      name: string
      alternativeText: string
      caption: string
      width: number
      height: number
      formats: Record<string, any>
      url: string
    }
  }
}

/**
 * Get image URL from Strapi media object
 */
export function getImageUrl(media: StrapiMedia | null | undefined): string | null {
  if (!media || !media.data || !media.data.attributes) return null
  
  // Return the direct URL if it's from Cloudinary or external
  if (media.data.attributes.url) {
    return getStrapiMedia(media.data.attributes.url)
  }
  
  return null
}
