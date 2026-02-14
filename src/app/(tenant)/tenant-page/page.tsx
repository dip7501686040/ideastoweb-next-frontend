import { requireTenant } from "@/lib/tenantContext"
import { ServiceApi } from "@/api/ServiceApi"
import { UIServiceApi } from "@/api/UIServiceApi"
import { UITemplate } from "@/models/UIService"
import TenantDashboardModern from "@/components/tenant/dashboard/TenantDashboardModern"
import TenantDashboardClassic from "@/components/tenant/dashboard/TenantDashboardClassic"
import TenantDashboardMinimal from "@/components/tenant/dashboard/TenantDashboardMinimal"

/**
 * Tenant root page - Template-based dashboard for all tenants
 * Shows available services using the configured dashboard template
 */
export default async function TenantRootPage() {
  const tenant = await requireTenant()

  // TODO: Fetch tenant's UI service configuration from API
  // Example: const uiConfig = await uiServiceApi.getTenantUIConfig(tenant.code, 'dashboard')
  // const dashboardTemplate = uiConfig?.template || UITemplate.DASHBOARD_MODERN

  // For demo: Use environment variable to test different templates
  // Set in .env.local: NEXT_PUBLIC_DEFAULT_DASHBOARD_TEMPLATE=dashboard-classic
  const envTemplate = process.env.NEXT_PUBLIC_DEFAULT_DASHBOARD_TEMPLATE as UITemplate
  const dashboardTemplate = envTemplate || UITemplate.DASHBOARD_MODERN

  // Render the appropriate dashboard template
  return renderDashboardTemplate(dashboardTemplate, {
    tenantCode: tenant.code,
    tenantName: tenant.code
  })
}

function renderDashboardTemplate(template: UITemplate, props: { tenantCode: string; tenantName: string }) {
  switch (template) {
    case UITemplate.DASHBOARD_MODERN:
      return <TenantDashboardModern {...props} />
    case UITemplate.DASHBOARD_CLASSIC:
      return <TenantDashboardClassic {...props} />
    case UITemplate.DASHBOARD_MINIMAL:
      return <TenantDashboardMinimal {...props} />
    default:
      return <TenantDashboardModern {...props} />
  }
}
