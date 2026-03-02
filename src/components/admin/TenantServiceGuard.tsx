"use client"

import { useEnabledServices } from "@/hooks/useEnabledServices"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"

interface TenantServiceGuardProps {
  /** The service code required to access this page (e.g. "user", "rbac") */
  serviceCode: string
  children: ReactNode
}

/**
 * Wraps a page and redirects tenant admins to /dashboard if the required
 * service is not enabled on their tenant. Master admins always pass through.
 */
export default function TenantServiceGuard({ serviceCode, children }: TenantServiceGuardProps) {
  const { hasService, loading, isTenantAdmin } = useEnabledServices()
  const router = useRouter()

  useEffect(() => {
    if (!isTenantAdmin || loading) return
    if (!hasService(serviceCode)) {
      router.replace("/dashboard")
    }
  }, [isTenantAdmin, loading, hasService, serviceCode, router])

  // Master admin: always render
  if (!isTenantAdmin) return <>{children}</>

  // Tenant admin: wait for service check
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!hasService(serviceCode)) return null // redirect in flight

  return <>{children}</>
}
