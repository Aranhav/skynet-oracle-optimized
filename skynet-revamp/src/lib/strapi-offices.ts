import { fetchAPI, strapiQuery, StrapiResponse, StrapiData } from "@/lib/strapi"
import { Office } from "@/types/strapi"

/**
 * Fetch all office locations from Strapi CMS
 */
export async function fetchOfficeLocations(): Promise<Office[]> {
  try {
    const params = strapiQuery.build(
      strapiQuery.populate(["addresses", "coordinates"]),
      strapiQuery.sort(["id:asc"]),
    )

    console.log("Fetching office locations from Strapi...")
    const response: StrapiResponse<StrapiData<Office>[]> = await fetchAPI("/office-locations", params)

    console.log("Strapi office locations response:", response)

    if (response.data && Array.isArray(response.data)) {
      const offices = response.data.map((item) => ({
        id: item.id,
        ...item.attributes,
      }))

      console.log("Parsed office locations:", offices)
      return offices
    }

    console.warn("No office locations data found, using fallback")
    return getFallbackOfficeData()
  } catch (error) {
    console.error("Error fetching office locations from Strapi:", error)
    console.log("Using fallback office data due to API error")

    // Fallback data if API fails
    return getFallbackOfficeData()
  }
}

/**
 * Fetch a specific office location by ID
 */
export async function fetchOfficeLocation(id: number): Promise<Office | null> {
  try {
    const params = strapiQuery.build(strapiQuery.populate(["addresses"]))

    const response: StrapiResponse<StrapiData<Office>> = await fetchAPI(`/office-locations/${id}`, params)

    if (response.data) {
      return {
        id: response.data.id,
        ...response.data.attributes,
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching office location:", error)
    return null
  }
}

/**
 * Fetch the head office location from Strapi CMS
 */
export async function fetchHeadOffice(): Promise<Office | null> {
  try {
    const params = strapiQuery.build(
      strapiQuery.populate(["addresses", "coordinates"]),
      { "filters[isHeadOffice][$eq]": true }
    )

    console.log("Fetching head office from Strapi...")
    const response: StrapiResponse<StrapiData<Office>[]> = await fetchAPI("/office-locations", params)

    if (response.data && response.data.length > 0) {
      const headOffice = {
        id: response.data[0].id,
        ...response.data[0].attributes,
      }
      console.log("Head office fetched:", headOffice)
      return headOffice
    }

    console.warn("No head office found in CMS, using fallback")
    // Return the fallback head office
    const fallbackOffices = getFallbackOfficeData()
    return fallbackOffices.find(office => office.isHeadOffice) || null
  } catch (error) {
    console.error("Error fetching head office from Strapi:", error)
    // Return the fallback head office
    const fallbackOffices = getFallbackOfficeData()
    return fallbackOffices.find(office => office.isHeadOffice) || null
  }
}

/**
 * Fetch ALL offices marked as head office from Strapi CMS
 */
export async function fetchAllHeadOffices(): Promise<Office[]> {
  try {
    const params = strapiQuery.build(
      strapiQuery.populate(["addresses", "coordinates"]),
      { "filters[isHeadOffice][$eq]": true },
      strapiQuery.sort(["id:asc"])
    )

    console.log("Fetching all head offices from Strapi...")
    const response: StrapiResponse<StrapiData<Office>[]> = await fetchAPI("/office-locations", params)

    if (response.data && response.data.length > 0) {
      const headOffices = response.data.map(item => ({
        id: item.id,
        ...item.attributes,
      }))
      console.log("All head offices fetched:", headOffices)
      return headOffices
    }

    console.warn("No head offices found in CMS, using fallback")
    // Return the fallback head offices
    const fallbackOffices = getFallbackOfficeData()
    return fallbackOffices.filter(office => office.isHeadOffice)
  } catch (error) {
    console.error("Error fetching head offices from Strapi:", error)
    // Return the fallback head offices
    const fallbackOffices = getFallbackOfficeData()
    return fallbackOffices.filter(office => office.isHeadOffice)
  }
}

/**
 * Fallback office data (existing hardcoded data as backup)
 */
function getFallbackOfficeData(): Office[] {
  return [
    {
      id: 1,
      name: "New Delhi (Head Office)",
      city: "New Delhi",
      addresses: [
        {
          id: 1,
          type: "Head Office",
          address: "JMK Tower, NH-8, Mustatil No. 44, Killa No. 5, Kapashera, New Delhi 110037, India.",
        },
        {
          id: 2,
          type: "Branch Office",
          address: "A-96, Road No. 4, Street No. 7, Mahipalpur Ext., New Delhi-110037, India.",
        },
        {
          id: 3,
          type: "Operations Hub",
          address: "15/15, next to shiv mandir, telephone exchange road, Samalka, New Delhi - 110037, India.",
        },
      ],
      phone: "+91-8808808500",
      email: "dm@skynetww.com,infoindia@skynetworldwide.com",
      workingHours: "Mon - Sat: 10.00AM - 07.00PM",
      mapUrl: "",
      coordinates: {
        lat: 28.5355,
        lng: 77.1345,
      },
      isHeadOffice: true,
      createdAt: "",
      updatedAt: "",
      publishedAt: "",
    },
    {
      id: 2,
      name: "West Hub (Mumbai)",
      city: "Mumbai",
      addresses: [
        {
          id: 4,
          type: "Office",
          address:
            "Gala No.7, Indo Saigon Industrial Estate, Marol Naka, Andheri Kurla Road, Andheri East, Mumbai-400059",
        },
      ],
      phone: "+91 - 92055 77402",
      email: "mumbai@skynetww.com",
      workingHours: "Mon - Sat: 10.00AM - 07.00PM",
      mapUrl: "",
      coordinates: {
        lat: 19.1197,
        lng: 72.8863,
      },
      isHeadOffice: false,
      createdAt: "",
      updatedAt: "",
      publishedAt: "",
    },
    {
      id: 3,
      name: "Gujarat Hub (Ahmedabad)",
      city: "Ahmedabad",
      addresses: [
        {
          id: 5,
          type: "Office",
          address: "Sky International Pvt Ltd. Gr. Floor, Shann Complex B/H Sakar 2, Ellis Bridge Ahmedabad.",
        },
      ],
      phone: "+91-79-26577100",
      email: "ahmedabad@skynetww.com",
      workingHours: "Mon - Sat: 10.00AM - 07.00PM",
      mapUrl: "",
      coordinates: {
        lat: 23.0225,
        lng: 72.5714,
      },
      isHeadOffice: false,
      createdAt: "",
      updatedAt: "",
      publishedAt: "",
    },
  ]
}

/**
 * Transform office data for UI components
 */
export function transformOfficeForUI(office: Office) {
  const hasValidCoordinates = !!(office.coordinates?.lat && office.coordinates?.lng)

  return {
    id: office.id ? office.id.toString() : "0",
    name: office.name || "Office Location",
    company: office.isHeadOffice ? "Skynet Express India Private Limited" : "SKYNET EXPRESS INDIA P.LTD",
    addresses: office.addresses ? office.addresses.sort((a, b) => a.id - b.id).map((addr) => addr.address) : ["Address not available"],
    phone: office.phone || "Phone not available",
    email: office.email ? office.email.split(",").map((e) => e.trim()) : [],
    lat: hasValidCoordinates ? office.coordinates.lat : null,
    lng: hasValidCoordinates ? office.coordinates.lng : null,
    mapUrl: office.mapUrl || "",
    workingHours: office.workingHours || "Mon - Sat: 10.00AM - 07.00PM",
    isHeadOffice: office.isHeadOffice || false,
    hasCoordinates: hasValidCoordinates,
  }
}
