import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-red-600">SKYNET</span>
      <span className="text-2xl font-bold text-gray-800">WW</span>
    </Link>
  )
}
