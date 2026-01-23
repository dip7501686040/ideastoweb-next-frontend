import { requireTenant } from "@/lib/tenantContext"
import TenantProductGrid from "@/components/tenant/products/TenantProductGrid"
import { UITemplate } from "@/models/UIService"

/**
 * Tenant-specific products page with template support
 */
export default async function TenantProductsPage() {
  const tenant = await requireTenant()

  // TODO: Fetch tenant's UI service configuration from API
  const template = UITemplate.PRODUCT_GRID

  return <div className="min-h-screen bg-gray-50">{renderProductTemplate(template, tenant.code)}</div>
}

function renderProductTemplate(template: UITemplate, tenantCode: string) {
  switch (template) {
    case UITemplate.PRODUCT_GRID:
      return <TenantProductGrid tenantCode={tenantCode} />
    case UITemplate.PRODUCT_LIST:
      // TODO: Implement TenantProductList
      return <TenantProductGrid tenantCode={tenantCode} />
    case UITemplate.PRODUCT_CARDS:
      // TODO: Implement TenantProductCards
      return <TenantProductGrid tenantCode={tenantCode} />
    default:
      return <TenantProductGrid tenantCode={tenantCode} />
  }
}
