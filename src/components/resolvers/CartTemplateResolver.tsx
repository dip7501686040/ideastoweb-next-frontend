"use client"

import { useRoot } from "@/providers/TenantProvider"
import CartPage from "@/components/tenant/cart/CartPage"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * CART TEMPLATE RESOLVER
 * - Admin domain  → redirect to dashboard (cart is tenant-only)
 * - Tenant domain → CartPage (shopping cart)
 * - Master domain → redirect home
 */
export default function CartTemplateResolver() {
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (adminConfig.isAdminDomain || !tenant) {
      router.push("/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  if (tenant) {
    return <CartPage />
  }

  return null
}
