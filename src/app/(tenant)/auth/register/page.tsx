import { requireTenant } from "@/lib/tenantContext"
import TenantRegisterModern from "@/components/tenant/auth/TenantRegisterModern"
import { UITemplate } from "@/models/UIService"

/**
 * Tenant-specific registration page
 */
export default async function TenantRegisterPage() {
  const tenant = await requireTenant()

  // TODO: Fetch tenant's UI service configuration from API
  const template = UITemplate.AUTH_MODERN

  return (
    <div className="min-h-screen bg-gray-50">
      <TenantRegisterModern tenantCode={tenant.code} />
    </div>
  )
}
