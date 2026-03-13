"use client"

import { useRoot } from "@/providers/TenantProvider"
import TenantPaymentPage from "@/components/tenant/payment/TenantPaymentPage"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * PAYMENT TEMPLATE RESOLVER
 * - Admin domain  → redirect (payment is tenant-only flow)
 * - Tenant domain → TenantPaymentPage (Stripe payment form)
 * - Master domain → redirect home
 */
export default function PaymentTemplateResolver() {
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (adminConfig.isAdminDomain || !tenant) {
      router.push("/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  if (tenant) {
    return <TenantPaymentPage />
  }

  return null
}
