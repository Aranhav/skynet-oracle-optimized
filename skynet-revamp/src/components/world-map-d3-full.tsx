"use client"

import { useEffect, useRef, useState } from "react"
import * as d3Geo from "d3-geo"
import * as d3Selection from "d3-selection"
import { feature } from "topojson-client"
import { motion } from "framer-motion"

// City data with coordinates
const cities = [
  { name: "Perth", lat: -31.9522, lng: 115.8614 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Melbourne", lat: -37.8136, lng: 144.9631 },
  { name: "Auckland", lat: -36.8485, lng: 174.7633 },
  { name: "Montreal", lat: 45.5017, lng: -73.5673 },
  { name: "Vancouver", lat: 49.2827, lng: -123.1207 },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Kuala Lumpur", lat: 3.139, lng: 101.6869 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Miami", lat: 25.7617, lng: -80.1918 },
  { name: "New York", lat: 40.6413, lng: -73.7781 },
  { name: "Kathmandu", lat: 27.7172, lng: 85.324 },
  { name: "Riyadh", lat: 24.7136, lng: 46.6753 },
  { name: "Manama", lat: 26.2285, lng: 50.586 },
  { name: "Kuwait City", lat: 29.3759, lng: 47.9774 },
  { name: "Doha", lat: 25.2854, lng: 51.531 },
  { name: "Muscat", lat: 23.5859, lng: 58.3847 },
  { name: "Colombo", lat: 6.9271, lng: 79.8612 },
  { name: "Beirut", lat: 33.8938, lng: 35.5018 },
  { name: "Khartoum", lat: 15.5007, lng: 32.5599 },
  { name: "Amman", lat: 31.9539, lng: 35.9106 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Tehran", lat: 35.6892, lng: 51.389 },
  { name: "Dhaka", lat: 23.8103, lng: 90.4125 },
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
  { name: "Tel Aviv", lat: 32.0853, lng: 34.7818 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { name: "Phnom Penh", lat: 11.5564, lng: 104.9282 },
  { name: "Taipei", lat: 25.033, lng: 121.5654 },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Brunei", lat: 4.5353, lng: 114.7277 },
  { name: "Manila", lat: 14.5995, lng: 120.9842 },
  { name: "Hanoi", lat: 21.0278, lng: 105.8342 },
  { name: "Shanghai", lat: 31.2304, lng: 121.4737 },
  { name: "Macao", lat: 22.1987, lng: 113.5439 },
  { name: "Seoul", lat: 37.5665, lng: 126.978 },
  { name: "Tokyo", lat: 35.6895, lng: 139.6917 },
  { name: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Brussels", lat: 50.8503, lng: 4.3517 },
  { name: "Luxembourg", lat: 49.6116, lng: 6.1319 },
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Vienna", lat: 48.2082, lng: 16.3738 },
  { name: "Prague", lat: 50.0755, lng: 14.4378 },
  { name: "Warsaw", lat: 52.2297, lng: 21.0122 },
  { name: "Budapest", lat: 47.4979, lng: 19.0402 },
  { name: "Dublin", lat: 53.3498, lng: -6.2603 },
  { name: "Vilnius", lat: 54.6872, lng: 25.2797 },
  { name: "Bratislava", lat: 48.1486, lng: 17.1077 },
  { name: "Riga", lat: 56.9496, lng: 24.1052 },
  { name: "Tallinn", lat: 59.437, lng: 24.7536 },
  { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Stockholm", lat: 59.3293, lng: 18.0686 },
  { name: "Lisbon", lat: 38.7223, lng: -9.1393 },
  { name: "Rome", lat: 41.9028, lng: 12.4964 },
  { name: "Helsinki", lat: 60.1699, lng: 24.9384 },
  { name: "Sofia", lat: 42.6977, lng: 23.3219 },
  { name: "Bucharest", lat: 44.4268, lng: 26.1025 },
  { name: "Athens", lat: 37.9838, lng: 23.7275 },
  { name: "Zagreb", lat: 45.815, lng: 15.9819 },
  { name: "Ljubljana", lat: 46.0569, lng: 14.5058 },
  { name: "Copenhagen", lat: 55.6761, lng: 12.5683 },
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
]

export default function WorldMapD3Full() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const [worldData, setWorldData] = useState<any>(null)

  // Delhi coordinates
  const delhiCoords = { lat: 28.6139, lng: 77.209 }

  // Load world topology data
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((response) => response.json())
      .then((data) => {
        setWorldData(data)
      })
  }, [])

  useEffect(() => {
    if (!svgRef.current || !worldData) return

    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width, height: width * 0.5 })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    // Clear any existing content
    d3Selection.select(svgRef.current).selectAll("*").remove()

    // Create projection
    const projection = d3Geo
      .geoNaturalEarth1()
      .scale(dimensions.width / 6.5)
      .translate([dimensions.width / 2, dimensions.height / 2])

    const pathGenerator = d3Geo.geoPath().projection(projection)
    const svg = d3Selection.select(svgRef.current)

    // Add styles for glowing dots
    const defs = svg.append("defs")

    // Add glow filter
    const filter = defs.append("filter").attr("id", "glow")

    filter.append("feGaussianBlur").attr("stdDeviation", "1.5").attr("result", "coloredBlur")

    const feMerge = filter.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // Add CSS styles for glowing and fading animation
    const style = defs.append("style").text(`
        @keyframes glow-fade {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.4;
          }
        }
        @keyframes glow-fade-delhi {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
        .city-dot {
          animation: glow-fade 3s ease-in-out infinite;
        }
        .city-dot-delhi {
          animation: glow-fade-delhi 2.5s ease-in-out infinite;
        }
        .flight-path {
          stroke-dasharray: 4, 6;
          animation: dash-flow 1.5s linear infinite;
        }
        @keyframes dash-flow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -10;
          }
        }
      `)

    // Draw countries
    const countries = feature(worldData, worldData.objects.countries) as any

    svg
      .append("g")
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#F2D9D9")
      .attr("stroke", "#F2D9D9")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.9)

    // Add flight paths from Delhi
    const flightPathsGroup = svg.append("g").attr("class", "flight-paths")
    const delhiProjected = projection([delhiCoords.lng, delhiCoords.lat])

    if (delhiProjected) {
      cities.forEach((city, index) => {
        if (city.name === "Delhi") return

        const targetProjected = projection([city.lng, city.lat])
        if (!targetProjected) return

        // Create curved path using quadratic curve
        const dx = targetProjected[0] - delhiProjected[0]
        const dy = targetProjected[1] - delhiProjected[1]
        const dr = Math.sqrt(dx * dx + dy * dy)

        // Create curved path using quadratic bezier
        const midX = (delhiProjected[0] + targetProjected[0]) / 2
        const midY = (delhiProjected[1] + targetProjected[1]) / 2 - dr * 0.15

        const path = flightPathsGroup
          .append("path")
          .attr(
            "d",
            `M${delhiProjected[0]},${delhiProjected[1]} Q${midX},${midY} ${targetProjected[0]},${targetProjected[1]}`,
          )
          .attr("fill", "none")
          .attr("stroke", "#ef4444")
          .attr("stroke-width", 0.6)
          .attr("opacity", 0.3)
          .attr("class", "flight-path")
      })
    }

    // Add city dots
    const citiesGroup = svg.append("g")

    cities.forEach((city, index) => {
      const coords = projection([city.lng, city.lat])
      if (!coords) return

      const cityGroup = citiesGroup.append("g")

      // Glowing dot
      cityGroup
        .append("circle")
        .attr("cx", coords[0])
        .attr("cy", coords[1])
        .attr("r", city.name === "Delhi" ? 5 : 3)
        .attr("fill", "#ef4444")
        .attr("filter", "url(#glow)")
        .attr("class", city.name === "Delhi" ? "city-dot-delhi" : "city-dot")

      // Invisible hover area
      cityGroup
        .append("circle")
        .attr("cx", coords[0])
        .attr("cy", coords[1])
        .attr("r", 10)
        .attr("fill", "transparent")
        .attr("cursor", "pointer")
        .on("mouseenter", () => setHoveredCity(city.name))
        .on("mouseleave", () => setHoveredCity(null))
    })

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions.width, dimensions.height, worldData])

  // Render tooltips
  const renderTooltip = () => {
    if (!hoveredCity || !worldData) return null

    const city = cities.find((c) => c.name === hoveredCity)
    if (!city) return null

    const projection = d3Geo
      .geoNaturalEarth1()
      .scale(dimensions.width / 6.5)
      .translate([dimensions.width / 2, dimensions.height / 2])

    const coords = projection([city.lng, city.lat])
    if (!coords) return null

    return (
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <rect
          x={coords[0] - 40}
          y={coords[1] - 30}
          width="80"
          height="22"
          rx="3"
          fill="white"
          stroke="#e5e5e5"
          strokeWidth="0.5"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
        />
        <text
          x={coords[0]}
          y={coords[1] - 15}
          textAnchor="middle"
          className="text-xs font-medium fill-current pointer-events-none"
          style={{ fontSize: "11px" }}
        >
          {city.name}
        </text>
      </motion.g>
    )
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black rounded-3xl overflow-hidden p-4">
      {!worldData ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </div>
      ) : (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {renderTooltip()}
        </svg>
      )}

      {/* Stats */}
      <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-light text-primary">209</p>
            <p className="text-xs text-muted-foreground">Countries</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-light text-primary">24/7</p>
            <p className="text-xs text-muted-foreground">Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
