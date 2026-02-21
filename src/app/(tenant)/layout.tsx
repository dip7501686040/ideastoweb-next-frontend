"use client"

import TenantLayout from "@/components/layouts/tenant/TenantLayout"
import { useRoot } from "@/providers/TenantProvider"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

interface TenantLayoutProps {
  children: ReactNode
}

/**
 * (tenant) Route Group Layout
 * Ensures only tenant domains can access these routes
 * Uses useRoot() to access context detected once in root layout
 */
export default function RootTenantLayout({ children }: TenantLayoutProps) {
  const { tenant } = useRoot()
  const router = useRouter()

  useEffect(() => {
    // Redirect if no tenant detected
    if (!tenant) {
      router.push("/")
    }
  }, [tenant, router])

  // Don't render if no tenant
  if (!tenant) {
    return null
  }

  return <TenantLayout>{children}</TenantLayout>
}
