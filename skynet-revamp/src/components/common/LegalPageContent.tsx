"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { LegalPage, TextSection } from "@/lib/strapi-legal"
import { parseMarkdownText } from "@/lib/markdown-parser"

interface LegalPageContentProps {
  page: LegalPage | null
  fallbackTitle: string
  fallbackContent: React.ReactNode
  isLoading?: boolean
}

export default function LegalPageContent({ page, fallbackTitle, fallbackContent, isLoading }: LegalPageContentProps) {
  // Disable right-click on legal pages
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", handleContextMenu)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-muted/50 rounded-lg w-3/4 mb-12"></div>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-8 bg-muted/50 rounded-lg w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted/30 rounded-lg w-full"></div>
                <div className="h-4 bg-muted/30 rounded-lg w-5/6"></div>
                <div className="h-4 bg-muted/30 rounded-lg w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // If no CMS content, show fallback
  if (!page) {
    return fallbackContent
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <p className="text-muted-foreground font-light mb-6">Last updated: {page.lastUpdated}</p>

      <div className="prose prose-gray max-w-none">
        {page.sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.3) }}
            viewport={{ once: true }}
          >
            {renderTextSection(section, index)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function renderTextSection(section: TextSection, index: number) {
  // Clean up content - remove excessive line breaks
  const cleanContent = section.content
    .split("\n")
    .map((line) => line.trim())
    .filter((line, i, arr) => {
      // Remove multiple consecutive empty lines
      if (line === "") {
        return i === 0 || arr[i - 1] !== ""
      }
      return true
    })
    .join("\n")

  // Check if this is the first section and if it's just an intro paragraph
  const isFirstSection = index === 0
  const hasNoHeading = !section.heading || section.heading.trim() === ""
  const isDuplicateHeading =
    section.heading &&
    (section.heading.toLowerCase().includes("privacy policy") ||
      section.heading.toLowerCase().includes("terms") ||
      section.heading.toLowerCase().includes("shipping policy"))

  return (
    <>
      {/* Only show heading if it's not empty and not a duplicate of page title */}
      {section.heading && !isDuplicateHeading && !hasNoHeading && (
        <h3 className={`text-2xl font-light ${isFirstSection ? "mt-0" : "mt-8"} mb-4 text-primary`}>
          {section.heading}
        </h3>
      )}
      <div
        className={`text-muted-foreground font-light leading-relaxed ${!section.heading || isDuplicateHeading ? "" : ""}`}
      >
        {cleanContent.split("\n").map((paragraph, i) => {
          // Skip empty paragraphs
          if (!paragraph.trim()) {
            return null
          }

          // Handle headers with ##
          if (paragraph.startsWith("##")) {
            const headerText = paragraph.replace(/^#+\s*/, "").trim()
            return (
              <h4 key={`${index}-${i}`} className="text-lg font-light text-primary mt-6 mb-3">
                {parseMarkdownText(headerText)}
              </h4>
            )
          }

          // Handle bullet points with - or *
          if (paragraph.startsWith("-") || paragraph.startsWith("*")) {
            const bulletText = paragraph.substring(1).trim()
            return (
              <ul key={`${index}-${i}`} className="list-disc pl-6 mb-3 space-y-1">
                <li className="leading-relaxed">{parseMarkdownText(bulletText)}</li>
              </ul>
            )
          }

          // Handle numbered lists
          if (paragraph.match(/^\d+\./)) {
            const listText = paragraph.replace(/^\d+\./, "").trim()
            return (
              <ol key={`${index}-${i}`} className="list-decimal pl-6 mb-3 space-y-1">
                <li className="leading-relaxed">{parseMarkdownText(listText)}</li>
              </ol>
            )
          }

          // Regular paragraphs with markdown parsing
          return (
            <p key={`${index}-${i}`} className="mb-4 leading-relaxed">
              {parseMarkdownText(paragraph)}
            </p>
          )
        })}
      </div>
    </>
  )
}
