// Skynet Tracking API Service

import { TrackingResponse } from "@/types/tracking"

export async function trackShipment(awbNumber: string): Promise<TrackingResponse> {
  try {
    // Clean the tracking number (remove spaces, special characters)
    const cleanedAwb = awbNumber.trim().replace(/[^a-zA-Z0-9]/g, "")

    if (!cleanedAwb) {
      throw new Error("Please enter a valid tracking number")
    }

    // Use our API route to avoid CORS issues
    const response = await fetch(`/api/track?awbNo=${cleanedAwb}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // Disable caching to get real-time updates
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch tracking information")
    }

    const data: TrackingResponse = await response.json()

    // The API returns 200 even for errors, so check the data status
    if (data.data?.status === "ERROR") {
      throw new Error(data.data.message || "Tracking number not found")
    }

    return data
  } catch (error) {
    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unexpected error occurred while tracking your shipment")
  }
}

// Format date from API format (DD-MMM-YYYY) to more readable format
export function formatTrackingDate(dateStr: string, timeStr?: string): string {
  if (!dateStr) return ""

  try {
    // Parse the date (e.g., "14-JUN-2025")
    const [day, month, year] = dateStr.split("-")
    const monthNames: Record<string, number> = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    }

    const date = new Date(parseInt(year), monthNames[month.toUpperCase()] || 0, parseInt(day))

    if (timeStr) {
      const [hours, minutes, seconds] = timeStr.split(":")
      date.setHours(parseInt(hours) || 0)
      date.setMinutes(parseInt(minutes) || 0)
      date.setSeconds(parseInt(seconds) || 0)
    }

    // Return formatted date
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(timeStr && { hour: "2-digit", minute: "2-digit" }),
    }

    return date.toLocaleDateString("en-US", options)
  } catch (error) {
    return dateStr // Return original if parsing fails
  }
}

// Calculate estimated delivery based on destination and current status
export function getEstimatedDelivery(destination: string, bookingDate: string): string {
  // This is a simplified estimation - in production, this would use real routing data
  const transitDays: Record<string, number> = {
    INDIA: 2,
    BANGLADESH: 3,
    "SRI LANKA": 3,
    NEPAL: 3,
    "UNITED STATES": 7,
    "UNITED KINGDOM": 6,
    AUSTRALIA: 8,
    CANADA: 7,
    SINGAPORE: 4,
    MALAYSIA: 4,
    UAE: 5,
    "SAUDI ARABIA": 5,
    // Default for other countries
    DEFAULT: 7,
  }

  try {
    const [day, month, year] = bookingDate.split("-")
    const monthNames: Record<string, number> = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    }

    const date = new Date(parseInt(year), monthNames[month.toUpperCase()] || 0, parseInt(day))

    const days = transitDays[destination.toUpperCase()] || transitDays.DEFAULT
    date.setDate(date.getDate() + days)

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    return "Calculating..."
  }
}
