import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if Strapi is accessible
    const strapiUrl = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL
    let strapiStatus = 'unknown'
    
    if (strapiUrl) {
      try {
        const response = await fetch(`${strapiUrl}/api/global-settings`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })
        strapiStatus = response.ok ? 'connected' : 'error'
      } catch (error) {
        strapiStatus = 'disconnected'
      }
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      service: 'skynet-frontend',
      checks: {
        strapi: strapiStatus,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      }
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}