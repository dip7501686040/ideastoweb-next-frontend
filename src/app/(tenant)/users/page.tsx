import { requireTenant } from "@/lib/tenantContext"
import TenantUserTable from "@/components/tenant/users/TenantUserTable"
import { UITemplate } from "@/models/UIService"

/**
 * Tenant-specific user management page with template support
 */
export default async function TenantUsersPage() {
  const tenant = await requireTenant()

  // TODO: Fetch tenant's UI service configuration from API
  const template = UITemplate.USER_TABLE

  return <div className="min-h-screen bg-gray-50">{renderUserTemplate(template, tenant.code)}</div>
}

function renderUserTemplate(template: UITemplate, tenantCode: string) {
  switch (template) {
    case UITemplate.USER_TABLE:
      return <TenantUserTable tenantCode={tenantCode} />
    case UITemplate.USER_GRID:
      // TODO: Implement TenantUserGrid
      return <TenantUserTable tenantCode={tenantCode} />
    case UITemplate.USER_LIST:
      // TODO: Implement TenantUserList
      return <TenantUserTable tenantCode={tenantCode} />
    default:
      return <TenantUserTable tenantCode={tenantCode} />
  }
}
