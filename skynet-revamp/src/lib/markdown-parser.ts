import React from "react"

/**
 * Parse markdown text and return React elements
 * Supports:
 * - **bold text**
 * - Line breaks
 * - Paragraphs
 */
export function parseMarkdownText(text: string): React.ReactNode {
  if (!text) return null

  // Split text into paragraphs
  const paragraphs = text.split("\n\n")

  return paragraphs.map((paragraph, pIndex) => {
    if (!paragraph.trim()) return null

    // Parse bold text within each paragraph
    const parts = paragraph.split(/(\*\*[^*]+\*\*)/)
    const parsedParts = parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Bold text
        return React.createElement(
          "strong",
          { key: `${pIndex}-${index}`, className: "font-semibold" },
          part.slice(2, -2)
        )
      }
      // Regular text - preserve line breaks within paragraph
      const lines = part.split("\n")
      return lines.map((line, lineIndex) => {
        if (lineIndex === lines.length - 1) {
          return line // Last line doesn't need a break
        }
        return React.createElement(
          React.Fragment,
          { key: `${pIndex}-${index}-${lineIndex}` },
          line,
          React.createElement("br")
        )
      })
    })

    // Wrap in paragraph if it's not the last paragraph
    if (pIndex < paragraphs.length - 1) {
      return React.createElement(
        "span",
        { key: pIndex },
        parsedParts,
        React.createElement("br"),
        React.createElement("br")
      )
    }
    return parsedParts
  })
}

/**
 * Parse markdown text for inline display (no paragraphs)
 */
export function parseMarkdownInline(text: string): React.ReactNode {
  if (!text) return null

  // Parse bold text
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      // Bold text
      return React.createElement(
        "strong",
        { key: index, className: "font-semibold" },
        part.slice(2, -2)
      )
    }
    return part
  })
}