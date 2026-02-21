"use client"

import MasterLayout from "@/components/layouts/master/MasterLayout"
import { useRoot } from "@/providers/TenantProvider"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

interface MasterLayoutProps {
  children: ReactNode
}

/**
 * (master) Route Group Layout
 * Ensures only master domain can access these routes
 * Uses useRoot() to access context detected once in root layout
 */
export default function RootMasterLayout({ children }: MasterLayoutProps) {
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    // Redirect if tenant or admin domain detected
    if (tenant || adminConfig.isAdminDomain) {
      router.push("/")
    }
  }, [tenant, adminConfig, router])

  // Don't render if not master domain
  if (tenant || adminConfig.isAdminDomain) {
    return null
  }

  return <MasterLayout>{children}</MasterLayout>
}
