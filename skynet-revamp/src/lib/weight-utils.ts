/**
 * Utility functions for weight conversion and formatting
 */

export interface ParsedWeight {
  value: number
  unit: "g" | "kg"
  displayValue: string
}

/**
 * Parse weight string from API and convert to appropriate unit
 * API may send weight as "1000", "1000g", "1.5kg", etc.
 */
export function parseWeight(weightString: string): ParsedWeight {
  // Remove any whitespace
  const cleanWeight = weightString.trim()

  // Check if it contains unit
  const kgMatch = cleanWeight.match(/^([\d.]+)\s*kg$/i)
  const gMatch = cleanWeight.match(/^([\d.]+)\s*g$/i)

  let value: number
  let unit: "g" | "kg"

  if (kgMatch) {
    // Weight is in kg
    value = parseFloat(kgMatch[1])
    unit = "kg"
  } else if (gMatch) {
    // Weight is in grams
    value = parseFloat(gMatch[1])
    unit = "g"
  } else {
    // No unit specified, need smarter logic
    value = parseFloat(cleanWeight)

    // Check for common patterns
    // Values with .000 format are likely kg (like "11.000")
    // Values that are whole numbers > 500 are likely grams
    if (cleanWeight.includes(".000")) {
      unit = "kg"
    } else if (!cleanWeight.includes(".") && value >= 500) {
      unit = "g"
    } else if (value < 50) {
      // Small values are likely kg
      unit = "kg"
    } else if (value >= 50 && value < 500 && cleanWeight.includes(".")) {
      // Mid-range decimals are likely kg
      unit = "kg"
    } else {
      // Default for values 50-499 without decimals
      unit = "g"
    }
  }

  // Convert to display format
  if (unit === "g" && value >= 1000) {
    // Convert grams to kg for display if >= 1000g
    return {
      value,
      unit: "g",
      displayValue: `${(value / 1000).toFixed(2)} kg`,
    }
  } else if (unit === "g") {
    return {
      value,
      unit: "g",
      displayValue: `${Math.round(value)} g`,
    }
  } else {
    // Already in kg
    // Remove unnecessary decimals for whole numbers
    const displayValue = Number.isInteger(value) ? `${value} kg` : `${value.toFixed(2)} kg`

    return {
      value,
      unit: "kg",
      displayValue,
    }
  }
}

/**
 * Convert weight between units
 */
export function convertWeight(value: number, fromUnit: "g" | "kg", toUnit: "g" | "kg"): number {
  if (fromUnit === toUnit) return value

  if (fromUnit === "kg" && toUnit === "g") {
    return value * 1000
  } else if (fromUnit === "g" && toUnit === "kg") {
    return value / 1000
  }

  return value
}

/**
 * Format weight for display
 */
export function formatWeight(value: number, unit: "g" | "kg"): string {
  if (unit === "g") {
    return `${value} g`
  } else {
    return `${value.toFixed(2)} kg`
  }
}
