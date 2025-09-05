// Strapi Content Type Definitions

import { StrapiAttributes, StrapiData, StrapiMedia } from "@/lib/strapi"

// Service
export interface Service extends StrapiAttributes {
  title: string
  slug: string
  description: string
  shortDescription: string
  icon: "Plane" | "Truck" | "Package" | "Globe" | "ShoppingCart" | "Shield"
  features: Array<{
    id: number
    title: string
    description: string
  }>
  image: StrapiMedia
  order: number
  featured: boolean
  ctaText: string
  ctaLink: string
}

// Testimonial
export interface Testimonial extends StrapiAttributes {
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: StrapiMedia
  featured: boolean
}

// Blog Post
export interface BlogPost extends StrapiAttributes {
  title: string
  slug: string
  content: any // Can be string or rich text blocks array
  excerpt: string
  featuredImage: StrapiMedia
  author: {
    data: StrapiData<Author>
  }
  category: {
    data: StrapiData<Category>
  }
  tags: {
    data: StrapiData<Tag>[]
  }
  seo?: SEOComponent
}

// Author
export interface Author extends StrapiAttributes {
  name: string
  bio: string
  avatar: StrapiMedia
  email: string
}

// Category
export interface Category extends StrapiAttributes {
  name: string
  slug: string
  description: string
}

// Tag
export interface Tag extends StrapiAttributes {
  name: string
  slug: string
}

// Office Location
export interface Office extends StrapiAttributes {
  name: string
  city: string
  addresses: Array<{
    id: number
    type: string
    address: string
  }>
  phone: string
  email: string
  workingHours: string
  mapUrl: string
  coordinates: {
    lat: number
    lng: number
  }
  isHeadOffice: boolean
}

// FAQ
export interface FAQ extends StrapiAttributes {
  question: string
  answer: string
  category: "General" | "Shipping" | "Tracking" | "Pricing" | "Support"
  order: number
}

// Team Member
export interface TeamMember extends StrapiAttributes {
  name: string
  role: string
  bio: string
  photo: StrapiMedia
  department: "Leadership" | "Operations" | "Sales" | "Technology" | "Customer Service"
  order: number
}

// Job Listing
export interface Job extends StrapiAttributes {
  title: string
  department: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Internship"
  description: string
  requirements: string
  benefits: string
  applyUrl: string
  active: boolean
}

// Global Settings (Single Type)
export interface GlobalSettings {
  siteName: string
  siteDescription: string
  logo: StrapiMedia
  favicon: StrapiMedia
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  contact: {
    phone: string
    email: string
    address: string
    workingHours: string
  }
  seo: SEOComponent
}

// Shared Components
export interface SEOComponent {
  metaTitle: string
  metaDescription: string
  metaImage: StrapiMedia
  keywords: string
  metaRobots: string
  structuredData: any
  metaViewport: string
  canonicalURL: string
}

// Feature Component
export interface Feature {
  id: number
  title: string
  description: string
  icon?: string
}

// Stats Component
export interface Stat {
  id: number
  number: string
  label: string
  icon?: string
}

// Hero Component
export interface HeroContent {
  headline: string
  subheadline: string
  ctaButtons: Array<{
    text: string
    link: string
    variant: "primary" | "secondary"
  }>
  backgroundImage: StrapiMedia
  stats: Stat[]
}
