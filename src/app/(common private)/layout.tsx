"use client"

import AdminLayout from "@/components/layouts/admin/AdminLayout"
import MasterLayout from "@/components/layouts/master/MasterLayout"
import TenantLayout from "@/components/layouts/tenant/TenantLayout"
import { useRoot } from "@/providers/TenantProvider"
import { ReactNode } from "react"

interface CommonPrivateLayoutProps {
  children: ReactNode
}

/**
 * (common private) Route Group Layout
 * Handles conditional layout rendering based on domain context
 * Uses useRoot() to access context detected once in root layout
 * - Admin domains → AdminLayout
 * - Tenant domains → TenantLayout
 * - Master domain → MasterLayout
 */
export default function CommonPrivateLayout({ children }: CommonPrivateLayoutProps) {
  const { tenant, adminConfig } = useRoot()

  // Admin domain (admin.myapp.com or admin.tenant.myapp.com)
  if (adminConfig.isAdminDomain) {
    return <AdminLayout>{children}</AdminLayout>
  }

  // Tenant domain (subdomain or custom domain)
  if (tenant) {
    return <TenantLayout>{children}</TenantLayout>
  }

  // Master domain (main domain)
  return <MasterLayout>{children}</MasterLayout>
}
