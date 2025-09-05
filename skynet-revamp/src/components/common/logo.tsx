import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  className?: string
  variant?: "default" | "white"
}

export default function Logo({ className = "", variant = "default" }: LogoProps) {
  return (
    <Link href="/" className={`block ${className}`}>
      <div className="flex items-center">
        {/* Text-based logo for now - replace with actual logo image */}
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span className="text-3xl font-black tracking-tight text-red-600 dark:text-red-500">SKY</span>
            <span className="text-3xl font-black tracking-tight text-red-600 dark:text-red-500 italic">NET</span>
          </div>
          <div className="text-[10px] font-bold tracking-[0.3em] text-red-600 dark:text-red-500 -mt-1">
            WORLDWIDE EXPRESS
          </div>
          <div className="text-[8px] font-medium tracking-wider text-red-600/80 dark:text-red-500/80 italic">
            The Partnership that delivers
          </div>
        </div>
      </div>
    </Link>
  )
}

// Compact version for mobile
export function LogoCompact({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`block ${className}`}>
      <div className="flex items-center">
        <span className="text-2xl font-black tracking-tight text-red-600 dark:text-red-500">SKY</span>
        <span className="text-2xl font-black tracking-tight text-red-600 dark:text-red-500 italic">NET</span>
      </div>
    </Link>
  )
}
