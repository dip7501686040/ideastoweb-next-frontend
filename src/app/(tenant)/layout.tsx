import { ReactNode } from "react"
import { getTenantContext } from "@/lib/tenantContext"
import { redirect } from "next/navigation"

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
      {/* Tenant branding header */}
      <div className="tenant-header bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">{tenant.code.charAt(0).toUpperCase()}</div>
              <h1 className="text-lg font-semibold text-gray-900">{tenant.code}</h1>
            </div>
            <div className="text-sm text-gray-500">{tenant.isSubdomain ? "Subdomain" : "Custom Domain"}</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="tenant-content">{children}</main>
    </div>
  )
}
