"use client"

import { useRoot } from "@/providers/TenantProvider"
import PaymentsManagement from "@/components/admin/payments/PaymentsManagement"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * PAYMENTS TEMPLATE RESOLVER
 * - Admin domain  → PaymentsManagement (all payment records)
 * - Tenant domain → redirect (payments are internal; tenants use /orders)
 * - Master domain → redirect home
 */
export default function PaymentsTemplateResolver() {
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (!adminConfig.isAdminDomain) {
      // Tenant clients don't have a direct /payments view — send to orders
      router.push(tenant ? "/orders" : "/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  if (adminConfig.isAdminDomain) {
    return <PaymentsManagement />
  }

  return null
}
