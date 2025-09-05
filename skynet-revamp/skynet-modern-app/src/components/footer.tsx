import Link from "next/link"
import { Logo } from "./logo"

export function Footer() {
  return (
    <footer className="bg-gray-100 p-6 md:py-12 w-full">
      <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
        <div className="grid gap-1">
          <h3 className="font-semibold">Company</h3>
          <Link href="/about">About Us</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/careers">Careers</Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Services</h3>
          <Link href="/services/air-freight">Air Freight</Link>
          <Link href="/services/road-transport">Road Transport</Link>
          <Link href="/services/ecommerce">eCommerce</Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Resources</h3>
          <Link href="/faqs">FAQs</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Legal</h3>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
        <div className="flex items-start">
          <Logo />
        </div>
      </div>
    </footer>
  )
}
