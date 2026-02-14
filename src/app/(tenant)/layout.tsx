import { ReactNode } from "react"
import { getTenantContext } from "@/lib/tenantContext"
import { redirect } from "next/navigation"
import Link from "next/link"

interface TenantLayoutProps {
  children: ReactNode
}

/**
 * Root layout for tenant-specific pages
 * Validates tenant context and provides tenant-wide layout
 */
export default async function TenantLayout({ children }: TenantLayoutProps) {
  // Get tenant context from domain
  const tenant = await getTenantContext()

  // Redirect to main app if no tenant context
  if (!tenant) {
    redirect("/dashboard")
  }

  return (
    <div className="tenant-layout">
      {/* Main content */}
      <main className="tenant-content">{children}</main>
    </div>
  )
}
