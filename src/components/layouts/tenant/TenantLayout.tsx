"use client"

import { ReactNode } from "react"
import { useTenant } from "@/providers/TenantProvider"

interface TenantLayoutProps {
  children: ReactNode
}

/**
 * Tenant Portal Layout
 * Used for tenant-specific domains (subdomain or custom domain)
 */
export default function TenantLayout({ children }: TenantLayoutProps) {
  const { tenant } = useTenant()

  return <article>{children}</article>
}
