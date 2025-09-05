import { fetchAPI, strapiQuery, StrapiResponse, StrapiData } from "@/lib/strapi"
import { FAQ } from "@/types/strapi"

/**
 * Helper function to extract text from rich text blocks
 */
function extractTextFromRichText(node: any): string {
  if (!node) return ""

  // If it's already a string, return it
  if (typeof node === "string") {
    return node
  }

  // If it's a text node
  if (node.type === "text" && node.text) {
    return node.text
  }

  // If it has children, recursively extract text
  if (node.children && Array.isArray(node.children)) {
    return node.children.map((child: any) => extractTextFromRichText(child)).join("")
  }

  // If it has a value property (some rich text formats)
  if (node.value && typeof node.value === "string") {
    return node.value
  }

  return ""
}

/**
 * Fetch all FAQs from Strapi CMS
 */
export async function fetchFAQs(category?: string): Promise<FAQ[]> {
  try {
    const queryParts: Record<string, any>[] = [
      strapiQuery.populate(["category"]), 
      strapiQuery.sort(["order:asc", "createdAt:desc"])
    ]

    if (category) {
      queryParts.push(strapiQuery.filters({ category: { $eq: category } }))
    }

    const params = strapiQuery.build(...queryParts)

    const response: StrapiResponse<StrapiData<FAQ>[]> = await fetchAPI("/faqs", params)

    if (response.data && Array.isArray(response.data)) {
      // Successfully fetched FAQs from CMS
      const faqs = response.data.map((item) => {
        // Check if answer is rich text and convert to string
        let answer: any = item.attributes.answer

        // Handle different answer formats
        if (!answer) {
          answer = "No answer available"
        } else if (typeof answer === "string") {
          // Already a string, use as is
          answer = answer.trim()
        } else if (typeof answer === "object" && answer !== null && !Array.isArray(answer)) {
          // If answer is a single rich text object, extract text
          if (answer.type && answer.children) {
            answer = extractTextFromRichText(answer)
          } else if (answer.text) {
            answer = answer.text
          } else {
            answer = JSON.stringify(answer) // Fallback for debugging
          }
        } else if (Array.isArray(answer)) {
          // If answer is an array of rich text blocks, parse them
          answer = answer
            .map((block: any) => extractTextFromRichText(block))
            .filter((text: string) => text)
            .join(" ")
        } else {
          answer = String(answer) // Fallback conversion
        }

        return {
          id: item.id,
          ...item.attributes,
          answer: answer || "No answer available",
        }
      })

      return faqs
    }

    // No FAQs data found
    return []
  } catch (error) {
    console.error("Error fetching FAQs from Strapi:", error)
    // Return empty array if API fails - no fallback
    return []
  }
}

/**
 * Search FAQs by keyword
 */
export async function searchFAQs(keyword: string): Promise<FAQ[]> {
  try {
    const params = strapiQuery.build(
      strapiQuery.populate(["category"]),
      strapiQuery.sort(["order:asc", "createdAt:desc"]),
      strapiQuery.filters({
        $or: [{ question: { $containsi: keyword } }, { answer: { $containsi: keyword } }],
      }),
    )

    const response: StrapiResponse<StrapiData<FAQ>[]> = await fetchAPI("/faqs", params)

    if (response.data && Array.isArray(response.data)) {
      return response.data.map((item) => {
        // Check if answer is rich text and convert to string
        let answer: any = item.attributes.answer

        // Handle different answer formats
        if (!answer) {
          answer = "No answer available"
        } else if (typeof answer === "string") {
          // Already a string, use as is
          answer = answer.trim()
        } else if (typeof answer === "object" && answer !== null && !Array.isArray(answer)) {
          // If answer is a single rich text object, extract text
          if (answer.type && answer.children) {
            answer = extractTextFromRichText(answer)
          } else if (answer.text) {
            answer = answer.text
          } else {
            answer = JSON.stringify(answer) // Fallback for debugging
          }
        } else if (Array.isArray(answer)) {
          // If answer is an array of rich text blocks, parse them
          answer = answer
            .map((block: any) => extractTextFromRichText(block))
            .filter((text: string) => text)
            .join(" ")
        } else {
          answer = String(answer) // Fallback conversion
        }

        return {
          id: item.id,
          ...item.attributes,
          answer: answer || "No answer available",
        }
      })
    }

    return []
  } catch (error) {
    console.error("Error searching FAQs:", error)
    return []
  }
}

/**
 * Get unique FAQ categories
 */
export async function getFAQCategories(): Promise<string[]> {
  try {
    const faqs = await fetchFAQs()
    const categories = [...new Set(faqs.map((faq) => faq.category))]
    return categories.sort()
  } catch (error) {
    console.error("Error getting FAQ categories:", error)
    return []
  }
}
