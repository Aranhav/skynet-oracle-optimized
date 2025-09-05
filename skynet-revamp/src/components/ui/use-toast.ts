import { useState } from "react"

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([])
  return { toasts }
}
