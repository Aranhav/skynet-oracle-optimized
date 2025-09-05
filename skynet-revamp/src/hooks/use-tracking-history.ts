// Hook to manage tracking history in localStorage

import { useState, useEffect } from "react"

const STORAGE_KEY = "skynet-tracking-history"
const MAX_HISTORY_ITEMS = 10

export interface TrackingHistoryItem {
  trackingNumber: string
  timestamp: number
  destination?: string
  status?: string
}

export function useTrackingHistory() {
  const [history, setHistory] = useState<TrackingHistoryItem[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as TrackingHistoryItem[]
        // Sort by timestamp, newest first
        setHistory(parsed.sort((a, b) => b.timestamp - a.timestamp))
      }
    } catch (error) {
      console.error("Failed to load tracking history:", error)
    }
  }, [])

  // Add a new tracking number to history
  const addToHistory = (item: Omit<TrackingHistoryItem, "timestamp">) => {
    const newItem: TrackingHistoryItem = {
      ...item,
      timestamp: Date.now(),
    }

    setHistory((prev) => {
      // Remove duplicates
      const filtered = prev.filter((h) => h.trackingNumber !== item.trackingNumber)

      // Add new item at the beginning
      const updated = [newItem, ...filtered]

      // Keep only the most recent items
      const trimmed = updated.slice(0, MAX_HISTORY_ITEMS)

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
      } catch (error) {
        console.error("Failed to save tracking history:", error)
      }

      return trimmed
    })
  }

  // Remove an item from history
  const removeFromHistory = (trackingNumber: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.trackingNumber !== trackingNumber)

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
      } catch (error) {
        console.error("Failed to update tracking history:", error)
      }

      return filtered
    })
  }

  // Clear all history
  const clearHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Failed to clear tracking history:", error)
    }
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
