// Demo mode wrapper for Strapi API
import { fetchAPI as originalFetchAPI } from "./strapi"

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export async function fetchAPI(path: string, urlParamsObject: Record<string, any> = {}, options: any = {}) {
  // In demo mode, use local API routes
  if (DEMO_MODE) {
    // Use real CMS when DEMO_MODE is false
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const mockPath = path.replace("/api", "/api/mock")

    try {
      const response = await fetch(`${baseUrl}${mockPath}`)
      if (!response.ok) {
        console.error(`Demo API error: ${response.status}`)
        // Return mock data directly
        if (path.includes("services")) {
          return {
            data: [
              {
                id: 1,
                attributes: {
                  title: "Express Delivery",
                  slug: "express-delivery",
                  shortDescription: "Fast and reliable delivery across India",
                  icon: "Zap",
                  featured: true,
                  order: 1,
                },
              },
            ],
            meta: { pagination: { total: 1 } },
          }
        }
      }
      return await response.json()
    } catch (error) {
      console.error("Demo API error:", error)
      return { data: [], meta: { pagination: { total: 0 } } }
    }
  }

  // Otherwise use real Strapi API
  return originalFetchAPI(path, urlParamsObject, options)
}

export { getStrapiMedia, strapiQuery } from "./strapi"
