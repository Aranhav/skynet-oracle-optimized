import * as React from "react"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        className={`flex h-11 w-full rounded-xl border border-input/60 bg-muted/40 px-4 py-2 text-sm font-light ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm ${className}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"
