import { fetchAPI, StrapiData, StrapiResponse, strapiQuery } from "./strapi"

// Re-export the type
export type { StrapiData } from "./strapi"

// Service types
export interface ServiceHighlight {
  id: number
  title: string
  description: string
  icon: string
}

export interface Service {
  title: string
  slug: string
  shortDescription: string
  description: string
  icon: string
  order: number
  featured: boolean
  ctaText: string
  ctaLink: string
  category?: string
  Highlights?: ServiceHighlight[]
  image?: {
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
  related_services?: {
    data: StrapiData<Service>[]
  }
}

/**
 * Fetch all services from Strapi
 */
export async function fetchAllServices() {
  try {
    const response = (await fetchAPI("/services", {
      populate: "*",
      sort: "order:asc",
    })) as StrapiResponse<StrapiData<Service>[]>

    return response.data
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

/**
 * Fetch featured services for homepage
 */
export async function fetchFeaturedServices() {
  try {
    const response = (await fetchAPI("/services", {
      "filters[featured][$eq]": true,
      populate: "*",
      sort: "order:asc",
      "pagination[pageSize]": 6,
    })) as StrapiResponse<StrapiData<Service>[]>

    return response.data
  } catch (error) {
    console.error("Error fetching featured services:", error)
    return []
  }
}

/**
 * Fetch services for navigation dropdown
 */
export async function fetchServicesForNav() {
  try {
    // Fetch with image data for dropdown
    const response = (await fetchAPI("/services", {
      populate: "image",
      sort: "order:asc",
      "pagination[pageSize]": 10,
    })) as StrapiResponse<StrapiData<Service>[]>

    return response.data.map((service) => ({
      name: service.attributes.title,
      href: `/services/${service.attributes.slug}`,
      description: service.attributes.shortDescription,
      icon: service.attributes.icon,
      image: service.attributes.image?.data?.attributes?.url || null,
    }))
  } catch (error) {
    console.error("Error fetching services for nav:", error)
    // Return default services if API fails
    return [
      {
        name: "Delivery By Air",
        href: "/services/delivery-by-air",
        description: "Swift and secure air freight",
        icon: "Plane",
        image: null,
      },
      {
        name: "Road Transport",
        href: "/services/road-transport",
        description: "Cost-effective road delivery",
        icon: "Truck",
        image: null,
      },
      {
        name: "E-commerce Solutions",
        href: "/services/ecommerce",
        description: "End-to-end logistics",
        icon: "ShoppingCart",
        image: null,
      },
    ]
  }
}

/**
 * Fetch single service by slug
 */
export async function fetchServiceBySlug(slug: string) {
  try {
    const response = (await fetchAPI("/services", {
      "filters[slug][$eq]": slug,
      populate: "Highlights,image,related_services.Highlights,related_services.image",
    })) as StrapiResponse<StrapiData<Service>[]>

    if (response.data.length === 0) {
      return null
    }

    return response.data[0]
  } catch (error) {
    console.error("Error fetching service by slug:", error)
    return null
  }
}

/**
 * Get service icon component name
 */
export function getServiceIconName(icon: string): string {
  // Map Strapi icon names to Lucide icon component names
  const iconMap: Record<string, string> = {
    Plane: "Plane",
    Truck: "Truck",
    Package: "Package",
    Globe: "Globe",
    ShoppingCart: "ShoppingCart",
    Shield: "Shield",
    Clock: "Clock",
    MapPin: "MapPin",
    Zap: "Zap",
    Heart: "Heart",
    Compass: "Compass",
    Mail: "Mail",
    Warehouse: "Warehouse",
    ArrowRepeat: "RefreshCw",
    CreditCard: "CreditCard",
    Code: "Code",
    FileText: "FileText",
    Layers: "Layers",
    Thermometer: "Thermometer",
    BarChart: "BarChart",
    Headphones: "Headphones",
  }

  return iconMap[icon] || "Package"
}
