"use client"

import { useRoot } from "@/providers/TenantProvider"
import AdminPaymentDetail from "@/components/admin/payments/AdminPaymentDetail"
import { useRouter } from "next/navigation"
import { useEffect, use } from "react"

/**
 * PAYMENT DETAIL PAGE — /payments/[id]
 * - Admin domain  → AdminPaymentDetail
 * - Tenant domain → redirect to /orders (not exposed to tenants directly)
 * - Master domain → redirect home
 */
export default function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (!adminConfig.isAdminDomain) {
      router.push(tenant ? "/orders" : "/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  if (adminConfig.isAdminDomain) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AdminPaymentDetail paymentId={id} />
      </div>
    )
  }

  return null
}
