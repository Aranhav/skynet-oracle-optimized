"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Sun, Moon, Package, Phone, MapPin, Clock, Globe, User } from "lucide-react"
import * as Icons from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { fetchServicesForNav, getServiceIconName } from "@/lib/strapi-services"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [services, setServices] = useState<{ name: string; href: string; description: string; icon?: string; image?: string | null }[]>([])
  // Base navigation without services
  const baseNavigation = [
    { name: "Tracking", href: "/track" },
    { name: "About Us", href: "/about" },
  ]

  const endNavigation = [
    { name: "Blogs & Insights", href: "/blog" },
    { name: "Career", href: "/career" },
    { name: "Contact Us", href: "/contact" },
  ]

  // Combine navigation with dynamic services
  const navigation = [
    ...baseNavigation,
    {
      name: "Services",
      href: "/services",
      children:
        services.length > 0
          ? services
          : [
              // Fallback if API fails
              {
                name: "Loading...",
                href: "/services",
                description: "Services are loading",
                icon: "Package",
                image: null,
              },
            ],
    },
    ...endNavigation,
  ]

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)

    // Fetch services for navigation
    fetchServicesForNav()
      .then((data) => {
        console.log("Nav services fetched:", data)
        setServices(data)
      })
      .catch((error) => {
        console.error("Error fetching nav services:", error)
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
            name: "E-commerce",
            href: "/services/ecommerce",
            description: "Complete e-commerce solutions",
          },
        ])
      })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "border-b shadow-sm backdrop-blur-xl bg-gradient-to-b from-background/95 to-background/85"
          : "backdrop-blur-md bg-gradient-to-b from-background/70 to-background/40",
      )}
    >
      <nav className="container flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.png" alt="Skynet Express" width={140} height={40} className="h-10 w-auto" priority />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navigation.map((item) => (
              <NavigationMenuItem key={item.name}>
                {'children' in item ? (
                  <>
                    <NavigationMenuTrigger className="text-sm font-light">{item.name}</NavigationMenuTrigger>
                    <NavigationMenuContent className="border shadow-xl backdrop-blur-xl bg-background/95 border-border/20">
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[600px] md:grid-cols-2">
                        {'children' in item && item.children.map((child) => {
                          const IconComponent = (child.icon ? Icons[getServiceIconName(child.icon) as keyof typeof Icons] : Icons.Package) as any
                          return (
                            <li key={child.name}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className="flex gap-3 p-3 space-y-1 leading-none no-underline rounded-md transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 p-2">
                                    {IconComponent && <IconComponent className="w-full h-full text-primary" strokeWidth={1.5} />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm font-light leading-none mb-1">{child.name}</div>
                                    {child.description && (
                                      <p className="text-xs leading-snug line-clamp-2 text-muted-foreground">
                                        {child.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          )
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="inline-flex justify-center items-center px-4 py-2 w-max h-10 text-sm font-light rounded-md transition-colors group hover:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    {item.name}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Actions */}
        <div className="flex gap-6 items-center">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8"
            >
              <Sun className="w-4 h-4 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {/* Customer Login Button */}
          <Button
            className="hidden px-6 text-sm font-light text-white rounded-full sm:flex bg-primary hover:bg-primary/90"
            size="sm"
            asChild
          >
            <a href="https://portal.skynetww.com/" target="_blank" rel="noopener noreferrer">
              <User className="mr-2 w-4 h-4" />
              Customer Login
            </a>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className={cn("h-5 w-5", isMobileMenuOpen && "hidden")} />
            <X className={cn("h-5 w-5", !isMobileMenuOpen && "hidden")} />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t lg:hidden bg-background"
          >
            <nav className="container py-4">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {'children' in item ? (
                      <details className="group">
                        <summary className="flex justify-between items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground">
                          {item.name}
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="pl-6 mt-2 space-y-1">
                          {'children' in item && item.children.map((child) => (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className="block px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="pt-4 mt-4 border-t">
                <Button className="w-full text-white bg-primary hover:bg-primary/90" size="sm" asChild>
                  <a href="https://portal.skynetww.com/" target="_blank" rel="noopener noreferrer">
                    <User className="mr-2 w-4 h-4" />
                    Customer Login
                  </a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
