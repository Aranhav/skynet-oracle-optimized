/**
 * Strapi CMS Rate Management Integration
 * This file handles fetching shipping rates from Strapi CMS
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://skynet-cms.onrender.com"

export interface ShippingRate {
  id: number
  attributes: {
    from_country: string
    destination_country: string
    weight_from: number
    weight_to: number
    rate_inr: number
    serviceDays?: string
    service_type?: string
    zone?: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface StrapiResponse<T> {
  data: T[]
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

/**
 * Fetch all unique destination countries from rates
 */
export async function getDestinationCountries(): Promise<string[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/shipping-rates?` + `fields[0]=destination_country&` + `pagination[pageSize]=200`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!response.ok) {
      console.error("Failed to fetch countries")
      return []
    }

    const data: StrapiResponse<ShippingRate> = await response.json()

    // Extract unique countries
    const countries = new Set<string>()
    data.data.forEach((rate) => {
      if (rate.attributes.destination_country) {
        countries.add(rate.attributes.destination_country)
      }
    })

    return Array.from(countries).sort()
  } catch (error) {
    console.error("Error fetching countries:", error)
    return []
  }
}

/**
 * Calculate shipping rate based on destination and weight
 */
export async function calculateShippingRate(destination: string, weightInKg: number): Promise<ShippingRate | null> {
  try {
    // Query for rates that match the weight range
    const response = await fetch(
      `${STRAPI_URL}/api/shipping-rates?` +
        `filters[from_country][$eq]=India&` +
        `filters[destination_country][$eq]=${encodeURIComponent(destination)}&` +
        `filters[weight_from][$lte]=${weightInKg}&` +
        `filters[weight_to][$gte]=${weightInKg}&` +
        `sort[0]=rate_inr:asc`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Always fetch fresh rates
      },
    )

    if (!response.ok) {
      console.error("Failed to fetch rates")
      return null
    }

    const data: StrapiResponse<ShippingRate> = await response.json()

    // Return the first (cheapest) rate that matches
    return data.data.length > 0 ? data.data[0] : null
  } catch (error) {
    console.error("Error calculating rate:", error)
    return null
  }
}

/**
 * Get all rates for a specific destination (for rate table display)
 */
export async function getRatesForDestination(destination: string): Promise<ShippingRate[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/shipping-rates?` +
        `filters[from_country][$eq]=India&` +
        `filters[destination_country][$eq]=${encodeURIComponent(destination)}&` +
        `sort[0]=weight_from:asc&` +
        `pagination[pageSize]=100`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!response.ok) {
      console.error("Failed to fetch rates for destination")
      return []
    }

    const data: StrapiResponse<ShippingRate> = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching rates:", error)
    return []
  }
}

/**
 * Format weight range for display
 */
export function formatWeightRange(from: number, to: number): string {
  if (from < 1 && to < 1) {
    // Show in grams for small weights
    return `${from * 1000}g - ${to * 1000}g`
  } else if (to >= 50) {
    // For large weights, show as "X kg+"
    return `${from} kg+`
  } else {
    // Standard kg display
    return `${from} - ${to} kg`
  }
}

/**
 * Format rate for display
 */
export function formatRate(rate: number): string {
  return `₹${rate.toLocaleString("en-IN")}`
}
