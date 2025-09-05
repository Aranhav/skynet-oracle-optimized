"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { fetchServicesForNav } from "@/lib/strapi-services"
import { fetchGlobalSettings, GlobalSettings } from "@/lib/strapi-global"
import { fetchAllHeadOffices } from "@/lib/strapi-offices"
import { Office } from "@/types/strapi"

// Static footer links
const staticFooterLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blogs & Insights", href: "/blog" },
    { name: "Career", href: "/career" },
    { name: "Company Profile", href: "/company-profile" },
    { name: "Download Brochure", href: "/brochure" },
  ],
  support: [
    { name: "Track Shipment", href: "/track" },
    { name: "Rate Calculator", href: "/rate-calculator" },
    { name: "Find Office", href: "/contact#office-locations" },
    { name: "FAQs", href: "/faqs" },
    { name: "Contact Us", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Shipping Policy", href: "/refund" },
  ],
}

export default function Footer() {
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const [services, setServices] = useState<{ name: string; href: string; description: string }[]>([])
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null)
  const [headOffices, setHeadOffices] = useState<Office[]>([])

  useEffect(() => {
    // Fetch services for footer
    fetchServicesForNav()
      .then((data) => {
        console.log("Footer services fetched:", data)
        // Limit to 6 services for footer
        setServices(data.slice(0, 6))
      })
      .catch((error) => {
        console.error("Error fetching footer services:", error)
        // Set default services on error
        setServices([
          {
            name: "Delivery By Air",
            href: "/services/delivery-by-air",
            description: "Swift air freight services",
          },
          {
            name: "Road Transport",
            href: "/services/road-transport",
            description: "Reliable road delivery",
          },
          {
            name: "E-commerce Solutions",
            href: "/services/ecommerce",
            description: "Complete e-commerce solutions",
          },
          {
            name: "International Mail",
            href: "/services/international-mail",
            description: "Global mail services",
          },
          {
            name: "Dangerous Goods",
            href: "/services/dangerous-goods",
            description: "Specialized handling",
          },
          {
            name: "Returns Management",
            href: "/services/returns",
            description: "Easy returns process",
          },
        ])
      })

    // Fetch global settings
    fetchGlobalSettings()
      .then((data) => {
        setGlobalSettings(data)
      })
      .catch((error) => {
        console.error("Error fetching global settings:", error)
      })

    // Fetch all head office locations
    fetchAllHeadOffices()
      .then((data) => {
        setHeadOffices(data)
        console.log("All head offices data:", data)
      })
      .catch((error) => {
        console.error("Error fetching head offices:", error)
        setHeadOffices([])
      })
  }, [])

  // Combine dynamic services with static links
  const footerLinks = {
    services:
      services.length > 0
        ? services
        : [
            // Fallback static services
            { name: "Loading services...", href: "/services" },
          ],
    ...staticFooterLinks,
  }

  // Build social links - always show with fallback if needed
  const defaultSocialMedia = {
    facebook: "https://www.facebook.com/SkynetDL/",
    twitter: "https://x.com/WorlwideIndia",
    linkedin: "https://www.linkedin.com/company/skynet-india/",
    instagram: "https://www.instagram.com/skynetworldwideexpressindia/",
    youtube: "https://www.youtube.com/channel/UC1Mk2IhqJfT1GZhdBDkuqHw",
  }

  const socialMedia = globalSettings?.socialMedia || defaultSocialMedia

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: socialMedia.facebook || defaultSocialMedia.facebook,
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: socialMedia.twitter || defaultSocialMedia.twitter,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: socialMedia.linkedin || defaultSocialMedia.linkedin,
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: socialMedia.instagram || defaultSocialMedia.instagram,
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: socialMedia.youtube || defaultSocialMedia.youtube,
    },
  ].filter((link) => link.href) // Only include links with valid URLs

  return (
    <footer className="bg-muted/30 dark:bg-black/30 border-t">
      {/* Newsletter Section - Only show on homepage */}
      {isHomepage && (
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-light mb-4">Stay Updated</h3>
              <p className="text-muted-foreground font-light mb-8">
                Subscribe to our newsletter for logistics insights and exclusive offers
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input type="email" placeholder="Enter your email" className="flex-1 rounded-full px-6" required />
                <Button type="submit" className="rounded-full px-8">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-8">
              <Image src="/images/logo.png" alt="Skynet Express" width={140} height={40} className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground mb-6 font-light leading-relaxed whitespace-pre-line">
              {globalSettings?.siteDescription ||
                `Skynet Express India Private Limited
Your trusted logistics partner delivering excellence
across India and 209+ countries worldwide.`}
            </p>
            {/* Contact Info from CMS */}
            <div className="space-y-3 text-sm font-light">
              {headOffices && headOffices.length > 0 ? (
                <>
                  {/* Display all head offices */}
                  {headOffices.map((office, officeIndex) => (
                    <div key={office.id} className="space-y-2">
                      {officeIndex > 0 && <div className="border-t border-muted/20 pt-2" />}
                      
                      {/* Office name if multiple offices */}
                      {headOffices.length > 1 && (
                        <p className="text-xs font-medium text-muted-foreground/90">
                          {office.name}
                        </p>
                      )}
                      
                      {/* Display all addresses for this office sorted by ID */}
                      {office.addresses && office.addresses.sort((a, b) => a.id - b.id).map((addr, addrIndex) => (
                        <div key={addr.id} className="text-muted-foreground">
                          {addrIndex > 0 && (
                            <p className="text-xs text-muted-foreground/70 mb-1">
                              {addr.type}:
                            </p>
                          )}
                          {(() => {
                            const addressParts = addr.address.split(',').map(part => part.trim())
                            // Find the part with pincode (contains 6 digits)
                            const pincodeIndex = addressParts.findIndex(part => /\d{6}/.test(part))
                            
                            if (pincodeIndex !== -1 && pincodeIndex > 0) {
                              // Format: First parts on one line, city/state/country on second line
                              const firstLine = addressParts.slice(0, pincodeIndex).join(', ')
                              const secondLine = addressParts.slice(pincodeIndex).join(', ')
                              
                              return (
                                <>
                                  <p className="mb-0 text-xs">{firstLine}</p>
                                  <p className="text-xs">{secondLine}</p>
                                </>
                              )
                            } else {
                              // If no pincode found or at start, show compactly
                              if (addressParts.length > 3) {
                                const midPoint = Math.ceil(addressParts.length / 2)
                                return (
                                  <>
                                    <p className="mb-0 text-xs">{addressParts.slice(0, midPoint).join(', ')}</p>
                                    <p className="text-xs">{addressParts.slice(midPoint).join(', ')}</p>
                                  </>
                                )
                              } else {
                                return <p className="text-xs">{addr.address}</p>
                              }
                            }
                          })()}
                        </div>
                      ))}
                      
                      {/* Contact details for first office only */}
                      {officeIndex === 0 && (
                        <>
                          {office.phone && (
                            <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className="block hover:text-primary transition-colors text-xs">
                              {office.phone}
                            </a>
                          )}
                          {office.email && (
                            <a href={`mailto:${office.email.split(',')[0].trim()}`} className="block hover:text-primary transition-colors text-xs">
                              {office.email.split(',')[0].trim()}
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                // Fallback if CMS data is not available
                <>
                  <p className="text-muted-foreground">
                    JMK Tower, NH-8, Kapashera
                    <br />
                    New Delhi 110037, India
                  </p>
                  <a href="tel:+918808808500" className="block hover:text-primary transition-colors">
                    +91-8808808500
                  </a>
                  <a href="mailto:dm@skynetww.com" className="block hover:text-primary transition-colors">
                    dm@skynetww.com
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="font-light text-sm mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-light text-sm mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-light text-sm mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-light text-sm mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-12 opacity-20" />

        {/* Bottom Section */}
        <div className="space-y-8">
          {/* Company Credentials */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-light text-muted-foreground">
            <span>CIN: {globalSettings?.CIN || "U64100DL2015PTC279337"}</span>
            <span>GSTIN: {globalSettings?.GSTIN || "07AACCL8506B1ZU"}</span>
            <span>ISO {globalSettings?.ISO || "9001:2015 Certified"}</span>
          </div>

          {/* Copyright and Social */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs font-light text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} {globalSettings?.siteName || "Skynet India"} Express India Private Limited.
              All rights reserved.
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-6">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" strokeWidth={1.5} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
