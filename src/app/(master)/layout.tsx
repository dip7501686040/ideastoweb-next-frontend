import { requireMaster } from "@/lib/tenantContext"
import { ReactNode } from "react"

interface MasterLayoutProps {
  children: ReactNode
}

/**
 * (master) Route Group Layout
 * This is just a pass-through layout
 * Actual master UI comes from root layout's MasterLayout component
 */
export default async function MasterLayout({ children }: MasterLayoutProps) {
  await requireMaster() // Ensure this layout is only accessible when no tenant is detected (master context)
  return <>{children}</>
}
