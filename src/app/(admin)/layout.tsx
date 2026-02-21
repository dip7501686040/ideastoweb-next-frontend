"use client"

import AdminLayout from "@/components/layouts/admin/AdminLayout"
import { useRoot } from "@/providers/TenantProvider"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

/**
 * (admin) Route Group Layout
 * Ensures only admin domains can access these routes
 * Uses useRoot() to access context detected once in root layout
 */
export default function RootAdminLayout({ children }: AdminLayoutProps) {
  const { adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    // Redirect if no admin config detected
    if (!adminConfig.isAdminDomain) {
      router.push("/")
    }
  }, [adminConfig, router])

  // Don't render if no admin config
  if (!adminConfig.isAdminDomain) {
    return null
  }

  return <AdminLayout>{children}</AdminLayout>
}
