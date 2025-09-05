"use client"

import React, { Component, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <AlertCircle className="w-16 h-16 text-destructive/50 mb-6" strokeWidth={1} />
          <h2 className="text-2xl font-light mb-4">Something went wrong</h2>
          <p className="text-muted-foreground font-light mb-8 text-center max-w-md">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <Button variant="outline" onClick={this.handleReset} className="rounded-full font-light">
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
