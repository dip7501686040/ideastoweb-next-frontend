"use client"

import { useRoot } from "@/providers/TenantProvider"
import OrderDetailsPage from "@/components/tenant/orders/OrderDetailsPage"
import AdminOrderDetail from "@/components/admin/orders/AdminOrderDetail"
import { useRouter } from "next/navigation"
import { useEffect, use } from "react"

/**
 * ORDER DETAIL PAGE — /orders/[id]
 * - Admin domain  → AdminOrderDetail
 * - Tenant domain → OrderDetailsPage
 * - Master domain → redirect home
 */
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (!adminConfig.isAdminDomain && !tenant) {
      router.push("/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  if (adminConfig.isAdminDomain) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AdminOrderDetail orderId={id} />
      </div>
    )
  }

  if (tenant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <OrderDetailsPage orderId={id} />
      </div>
    )
  }

  return null
}
