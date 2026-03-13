"use client"

import { useRoot } from "@/providers/TenantProvider"
import CheckoutPage from "@/components/tenant/checkout/CheckoutPage"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * CHECKOUT TEMPLATE RESOLVER
 * - Admin domain  → redirect (no checkout for admins)
 * - Tenant domain → CheckoutPage
 * - Master domain → redirect home
 */
export default function CheckoutTemplateResolver() {
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (adminConfig.isAdminDomain || !tenant) {
      router.push("/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  if (tenant) {
    return <CheckoutPage />
  }

  return null
}
