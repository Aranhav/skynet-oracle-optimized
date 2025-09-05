import * as React from "react"

export const Avatar = ({ children, className = "" }: any) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>
)

export const AvatarImage = ({ src, alt }: any) => (
  <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />
)

export const AvatarFallback = ({ children }: any) => (
  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">{children}</div>
)
