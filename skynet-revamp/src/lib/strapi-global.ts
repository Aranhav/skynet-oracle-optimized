import { fetchAPI, StrapiMedia, getImageUrl } from "./strapi"

// Types for Global Settings
export interface GlobalSettings {
  siteName: string
  siteDescription: string
  CIN: string
  GSTIN: string
  ISO: string
  logo?: StrapiMedia
  favicon?: StrapiMedia
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
}

/**
 * Fetch global settings from Strapi
 */
export async function fetchGlobalSettings(): Promise<GlobalSettings | null> {
  try {
    const response = await fetchAPI("/global-settings", {
      populate: "*",
    })

    if (!response.data || response.data.length === 0) {
      console.error("No global settings found")
      return null
    }

    const settings = response.data[0].attributes
    return {
      siteName: settings.siteName || "Skynet India",
      siteDescription: settings.siteDescription || "",
      CIN: settings.CIN || "",
      GSTIN: settings.GSTIN || "",
      ISO: settings.ISO || "",
      logo: settings.logo || null,
      favicon: settings.favicon || null,
      socialMedia: settings.socialMedia
        ? {
            facebook: settings.socialMedia.facebook,
            twitter: settings.socialMedia.twitter,
            instagram: settings.socialMedia.instagram,
            linkedin: settings.socialMedia.linkedin,
            youtube: settings.socialMedia.youtube,
          }
        : {},
    }
  } catch (error) {
    console.error("Error fetching global settings:", error)
    // Return fallback values
    return {
      siteName: "Skynet India",
      siteDescription:
        "Your trusted logistics partner delivering excellence across India and 209+ countries worldwide.",
      CIN: "U64100DL2015PTC279337",
      GSTIN: "07AACCL8506B1ZU",
      ISO: "9001:2015 Certified",
      socialMedia: {
        facebook: "https://www.facebook.com/skynetworldwideexpress",
        twitter: "https://twitter.com/skynetww",
        instagram: "https://www.instagram.com/skynetworldwideexpress",
        linkedin: "https://www.linkedin.com/company/skynet-worldwide-express",
        youtube: "https://www.youtube.com/channel/skynetworldwideexpress",
      },
    }
  }
}

/**
 * Get favicon URL from global settings
 */
export function getFaviconUrl(favicon: StrapiMedia | null | undefined): string | null {
  if (!favicon || !favicon.data) return null
  return getImageUrl(favicon)
}

/**
 * Get logo URL from global settings
 */
export function getLogoUrl(logo: StrapiMedia | null | undefined): string | null {
  if (!logo || !logo.data) return null
  return getImageUrl(logo)
}
