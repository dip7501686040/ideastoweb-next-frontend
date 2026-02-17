import { requireTenant } from "@/lib/tenantContext"
import { ReactNode } from "react"

interface TenantLayoutProps {
  children: ReactNode
}

/**
 * (tenant) Route Group Layout
 * This is just a pass-through layout
 * Actual tenant UI comes from root layout's TenantLayout component
 */
export default async function TenantLayout({ children }: TenantLayoutProps) {
  // Detect tenant once from hostname
  await requireTenant() // This will throw if no tenant is detected, ensuring this layout is only used for tenant routes
  return <>{children}</>
}
