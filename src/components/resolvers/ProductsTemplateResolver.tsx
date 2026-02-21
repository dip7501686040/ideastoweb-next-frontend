"use client"

import { useRoot } from "@/providers/TenantProvider"
import TenantProductGrid from "@/components/tenant/products/TenantProductGrid"
import { UITemplate } from "@/models/UIService"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * 🛍️ PRODUCTS TEMPLATE RESOLVER
 * Requires tenant context (redirects if on master domain)
 * Uses root context established once in root layout
 */
export default function ProductsTemplateResolver() {
  const { tenant } = useRoot()
  const router = useRouter()

  useEffect(() => {
    // Redirect to home if no tenant detected
    if (!tenant) {
      router.push("/")
    }
  }, [tenant, router])

  // Don't render if no tenant
  if (!tenant) {
    return null
  }

  // TODO: Fetch tenant's UI service configuration from API
  // Example: const uiConfig = await uiServiceApi.getTenantUIConfig(tenant.code, 'products')
  const template = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTS_TEMPLATE || UITemplate.PRODUCT_GRID

  // Render appropriate template
  return (
    <div className="min-h-screen bg-gray-50">
      <TenantProductGrid tenantCode={tenant.code} />
    </div>
  )
}
