import { requireTenant } from "@/lib/tenantContext"
import TenantProductGrid from "@/components/tenant/products/TenantProductGrid"
import { UITemplate } from "@/models/UIService"

/**
 * 🛍️ SERVER-SIDE PRODUCTS TEMPLATE RESOLVER
 * Requires tenant context (redirects if on master domain)
 * All tenant validation happens on the server
 */
export default async function ProductsTemplateResolver() {
  // Server-side tenant requirement (redirects to / if no tenant)
  const tenant = await requireTenant()

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
