import Link from "next/link"
import { Logo } from "./logo"

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm">
      <Link href="/" className="flex items-center justify-center">
        <Logo />
        <span className="sr-only">Skynet WW</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
          About Us
        </Link>
        <Link href="/services" className="text-sm font-medium hover:underline underline-offset-4">
          Services
        </Link>
        <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
          Contact
        </Link>
        <Link
          href="/track"
          className="inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Track Shipment
        </Link>
      </nav>
    </header>
  )
}
