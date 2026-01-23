import { requireTenant } from "@/lib/tenantContext"
import { redirect } from "next/navigation"
import TenantLoginModern from "@/components/tenant/auth/TenantLoginModern"
import TenantLoginClassic from "@/components/tenant/auth/TenantLoginClassic"
import TenantLoginMinimal from "@/components/tenant/auth/TenantLoginMinimal"
import { UIServiceApi } from "@/api/UIServiceApi"
import { UITemplate } from "@/models/UIService"

/**
 * Tenant-specific login page with template support
 */
export default async function TenantLoginPage() {
  const tenant = await requireTenant()

  // TODO: Fetch tenant's UI service configuration from API
  // For now, default to modern template
  const template = UITemplate.AUTH_MODERN

  return <div className="min-h-screen bg-gray-50">{renderAuthTemplate(template, tenant.code)}</div>
}

function renderAuthTemplate(template: UITemplate, tenantCode: string) {
  switch (template) {
    case UITemplate.AUTH_MODERN:
      return <TenantLoginModern tenantCode={tenantCode} />
    case UITemplate.AUTH_CLASSIC:
      return <TenantLoginClassic tenantCode={tenantCode} />
    case UITemplate.AUTH_MINIMAL:
      return <TenantLoginMinimal tenantCode={tenantCode} />
    default:
      return <TenantLoginModern tenantCode={tenantCode} />
  }
}
