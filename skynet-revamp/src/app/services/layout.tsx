// Force dynamic rendering for all services pages to prevent build timeouts
export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
