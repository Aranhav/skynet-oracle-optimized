// Utility to parse Strapi's rich text block format to HTML

interface TextNode {
  type: "text"
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

interface LinkNode {
  type: "link"
  url: string
  children: (TextNode | any)[]
}

interface BlockNode {
  type: "paragraph" | "heading" | "list" | "list-item" | "quote" | "code" | "image"
  level?: number
  format?: "ordered" | "unordered"
  image?: {
    url: string
    alternativeText?: string
    width?: number
    height?: number
  }
  children: (TextNode | LinkNode | BlockNode)[]
}

type RichTextNode = BlockNode | TextNode | LinkNode

/**
 * Convert Strapi rich text blocks to HTML
 */
export function parseRichText(content: RichTextNode[] | string | undefined): string {
  // If content is already a string (old format), return it
  if (typeof content === "string") {
    return content
  }

  // If no content, return empty
  if (!content || !Array.isArray(content)) {
    return ""
  }

  return content.map((node) => parseNode(node)).join("")
}

function parseNode(node: RichTextNode): string {
  if (!node) return ""

  switch (node.type) {
    case "paragraph":
      const content = parseChildren(node.children)
      // Don't wrap empty paragraphs
      return content.trim() ? `<p>${content}</p>` : ""

    case "heading":
      const level = node.level || 1
      return `<h${level}>${parseChildren(node.children)}</h${level}>`

    case "list":
      const tag = node.format === "ordered" ? "ol" : "ul"
      const listItems = parseChildren(node.children)
      return listItems ? `<${tag}>${listItems}</${tag}>` : ""

    case "list-item":
      return `<li>${parseChildren(node.children)}</li>`

    case "quote":
      return `<blockquote>${parseChildren(node.children)}</blockquote>`

    case "code":
      return `<pre><code>${parseChildren(node.children)}</code></pre>`

    case "image":
      if (node.image) {
        const alt = node.image.alternativeText || ""
        const width = node.image.width ? ` width="${node.image.width}"` : ""
        const height = node.image.height ? ` height="${node.image.height}"` : ""
        return `<img src="${node.image.url}" alt="${alt}"${width}${height} />`
      }
      return ""

    case "link":
      return `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${parseChildren(node.children)}</a>`

    case "text":
      return parseTextNode(node)

    default:
      // For unknown types, try to parse children if they exist
      if ("children" in node && Array.isArray(node.children)) {
        return parseChildren(node.children)
      }
      return ""
  }
}

function parseChildren(children: RichTextNode[]): string {
  if (!children || !Array.isArray(children)) return ""
  return children.map((child) => parseNode(child)).join("")
}

function parseTextNode(node: TextNode): string {
  let text = node.text || ""

  // Escape HTML entities
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

  // Apply formatting
  if (node.bold) text = `<strong>${text}</strong>`
  if (node.italic) text = `<em>${text}</em>`
  if (node.underline) text = `<u>${text}</u>`
  if (node.strikethrough) text = `<s>${text}</s>`
  if (node.code) text = `<code>${text}</code>`

  return text
}
