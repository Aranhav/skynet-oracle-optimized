import { fetchAPI, StrapiData, StrapiResponse } from "./strapi"

// Re-export the type
export type { StrapiData } from "./strapi"

// Rate types
export interface Rate {
  fromCountry: string
  toCountry: string
  weightMin: number
  weightMax: number
  rate: number
  serviceDays?: string
  active: boolean
}

// Country list for dropdown
export const countries = [
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Dubai",
  "Saudi Arabia",
  "Kuwait",
  "Singapore",
  "Hong Kong",
  "New Zealand",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Japan",
  "South Korea",
  "China",
  "Malaysia",
  "Thailand",
  "Indonesia",
  "Philippines",
  "Vietnam",
  "South Africa",
  "Egypt",
  "Nigeria",
  "Kenya",
  "Morocco",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
]

/**
 * Calculate shipping rate based on destination and weight
 */
export async function calculateRate(toCountry: string, weight: number) {
  try {
    const response = (await fetchAPI("/rates", {
      "filters[toCountry][$eq]": toCountry,
      "filters[weightMin][$lte]": weight,
      "filters[weightMax][$gte]": weight,
      "filters[active][$eq]": true,
      "pagination[pageSize]": 1,
    })) as StrapiResponse<StrapiData<Rate>[]>

    if (response.data.length > 0) {
      return response.data[0]
    }

    return null
  } catch (error) {
    console.error("Error calculating rate:", error)
    return null
  }
}

/**
 * Get all available destination countries
 */
export async function getAvailableCountries() {
  try {
    const response = (await fetchAPI("/rates", {
      "fields[0]": "toCountry",
      "filters[active][$eq]": true,
      "pagination[pageSize]": 100,
    })) as StrapiResponse<StrapiData<Rate>[]>

    const uniqueCountries = new Set(response.data.map((item) => item.attributes.toCountry))
    return Array.from(uniqueCountries).sort()
  } catch (error) {
    console.error("Error fetching countries:", error)
    return countries // Return default list as fallback
  }
}
