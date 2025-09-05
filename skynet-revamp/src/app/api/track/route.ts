// API route to proxy tracking requests to avoid CORS issues

import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const awbNo = searchParams.get("awbNo")

  if (!awbNo) {
    return NextResponse.json({ error: "Tracking number is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://tracks.skynetww.com/api/SkyLinkTracking/GetSkyLinkTracks?AWBNO=${awbNo}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Skynet-Website/1.0",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Tracking API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Tracking API error:", error)
    return NextResponse.json({ error: "Failed to fetch tracking information" }, { status: 500 })
  }
}
