import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

export function formatTrackingNumber(trackingNumber: string): string {
  // Format: XXXX-XXXX-XXXX
  return trackingNumber.replace(/(\w{4})(\w{4})(\w{4})/, "$1-$2-$3")
}

export function calculateDeliveryDays(
  origin: string,
  destination: string,
  serviceType: "express" | "standard" | "economy",
): number {
  // Simplified calculation - in real app, this would use an API
  const baseDays = {
    express: 1,
    standard: 3,
    economy: 5,
  }

  // Add days for different cities
  const isMetroOrigin = ["delhi", "mumbai", "bangalore", "chennai", "kolkata"].includes(origin.toLowerCase())
  const isMetroDestination = ["delhi", "mumbai", "bangalore", "chennai", "kolkata"].includes(destination.toLowerCase())

  let days = baseDays[serviceType]
  if (!isMetroOrigin) days += 1
  if (!isMetroDestination) days += 1

  return days
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateTrackingNumber(): string {
  const prefix = "SKY"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    "picked-up": "bg-blue-500",
    "in-transit": "bg-orange-500",
    "out-for-delivery": "bg-purple-500",
    delivered: "bg-green-500",
    failed: "bg-red-500",
  }
  return statusColors[status] || "bg-gray-500"
}

export function getStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    pending: "Pickup Pending",
    "picked-up": "Picked Up",
    "in-transit": "In Transit",
    "out-for-delivery": "Out for Delivery",
    delivered: "Delivered",
    failed: "Delivery Failed",
  }
  return statusTexts[status] || status
}
