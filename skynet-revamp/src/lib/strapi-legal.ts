import { fetchAPI } from "./strapi"

// Types for Legal Pages
export interface LegalPage {
  id: number
  title: string
  slug: string
  lastUpdated: string
  pageType: string
  sections: TextSection[]
}

export interface TextSection {
  id: number
  __component: "legal.text-section"
  heading: string
  content: string
}

/**
 * Fetch a legal page by type
 * Note: The CMS uses different pageType values than our routes
 */
export async function fetchLegalPage(pageType: "privacy" | "terms" | "refund"): Promise<LegalPage | null> {
  try {
    // Map our route types to CMS pageType values
    const pageTypeMap: Record<string, string> = {
      privacy: "privacy_policy",
      terms: "terms&Condition",
      refund: "refund_policy",
    }

    const cmsPageType = pageTypeMap[pageType]

    const response = await fetchAPI("/legal-pages", {
      filters: { pageType: { $eq: cmsPageType } },
      populate: "*",
    })

    if (!response.data || response.data.length === 0) {
      console.error(`No legal page found for type: ${pageType} (CMS type: ${cmsPageType})`)
      return null
    }

    const page = response.data[0]
    return {
      id: page.id,
      title: page.attributes.title,
      slug: page.attributes.slug,
      lastUpdated: page.attributes.lastUpdated,
      pageType: page.attributes.pageType,
      sections: page.attributes.sections || [],
    }
  } catch (error) {
    console.error(`Error fetching legal page ${pageType}:`, error)
    return null
  }
}

/**
 * Extract text from rich text content
 */
export function extractTextFromRichText(richText: any): string {
  if (!richText) return ""

  if (typeof richText === "string") {
    return richText
  }

  if (Array.isArray(richText)) {
    return richText
      .map((block) => {
        if (block.type === "paragraph" && block.children) {
          return block.children.map((child: any) => child.text || "").join("")
        }
        return ""
      })
      .join("\n")
  }

  return ""
}
