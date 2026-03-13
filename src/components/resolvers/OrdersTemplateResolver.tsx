"use client"

import { useRoot } from "@/providers/TenantProvider"
import OrderListPage from "@/components/tenant/orders/OrderListPage"
import OrdersManagement from "@/components/admin/orders/OrdersManagement"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * ORDERS TEMPLATE RESOLVER
 * - Admin domain  → OrdersManagement (all orders)
 * - Tenant domain → OrderListPage (my orders)
 * - Master domain → redirect home
 */
export default function OrdersTemplateResolver() {
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (!adminConfig.isAdminDomain && !tenant) {
      router.push("/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  if (adminConfig.isAdminDomain) {
    return <OrdersManagement />
  }

  if (tenant) {
    return <OrderListPage />
  }

  return null
}
