import { requireTenant } from "@/lib/tenantContext"
import TenantUserTable from "@/components/tenant/users/TenantUserTable"
import { UITemplate } from "@/models/UIService"

/**
 * 👥 SERVER-SIDE USERS TEMPLATE RESOLVER
 * Requires tenant context (redirects if on master domain)
 * All tenant validation happens on the server
 */
export default async function UsersTemplateResolver() {
  // Server-side tenant requirement (redirects to / if no tenant)
  const tenant = await requireTenant()

  // TODO: Fetch tenant's UI service configuration from API
  // Example: const uiConfig = await uiServiceApi.getTenantUIConfig(tenant.code, 'users')
  const template = process.env.NEXT_PUBLIC_DEFAULT_USERS_TEMPLATE || UITemplate.USER_TABLE

  // Render appropriate template
  return (
    <div className="min-h-screen bg-gray-50">
      <TenantUserTable tenantCode={tenant.code} />
    </div>
  )
}
