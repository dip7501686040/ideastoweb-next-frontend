"use client"

import { useRoot } from "@/providers/TenantProvider"
import TenantProductGrid from "@/components/tenant/products/TenantProductGrid"
import ProductsManagement from "@/components/admin/products/ProductsManagement"
import TenantServiceGuard from "@/components/admin/TenantServiceGuard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * 🛍️ PRODUCTS TEMPLATE RESOLVER
 * Single resolver for all domain contexts — follows DashboardTemplateResolver pattern.
 *
 * - Admin domain  → ProductsManagement wrapped in TenantServiceGuard("product")
 * - Tenant domain → TenantProductGrid (client-facing catalog)
 * - Master domain → redirect to home (no products context)
 */
export default function ProductsTemplateResolver() {
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    // Master domain: no products context — redirect home
    if (!adminConfig.isAdminDomain && !tenant) {
      router.push("/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  // ADMIN DOMAIN — full product management (CRUD)
  if (adminConfig.isAdminDomain) {
    return (
      <TenantServiceGuard serviceCode="product">
        <ProductsManagement />
      </TenantServiceGuard>
    )
  }

  // TENANT DOMAIN — client-facing product grid
  if (tenant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TenantProductGrid tenantCode={tenant.code} />
      </div>
    )
  }

  // Master domain: nothing to render while redirect is in flight
  return null
}
