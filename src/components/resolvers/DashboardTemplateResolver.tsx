"use client"

import { useRoot } from "@/providers/TenantProvider"
import { UITemplate } from "@/models/UIService"
import TenantDashboardModern from "@/components/tenant/dashboard/TenantDashboardModern"
import TenantDashboardClassic from "@/components/tenant/dashboard/TenantDashboardClassic"
import TenantDashboardMinimal from "@/components/tenant/dashboard/TenantDashboardMinimal"
import MasterDashboardTemplate from "@/components/master/dashboard/MasterDashboardTemplate"
import AdminDashboardTemplate from "@/components/admin/dashboard/AdminDashboardTemplate"

/**
 * 📊 DASHBOARD TEMPLATE RESOLVER
 * Uses root context established once in root layout
 * No duplicate tenant detection - cleaner and more efficient
 */
export default function DashboardTemplateResolver() {
  const { tenant, adminConfig } = useRoot()

  // ADMIN DASHBOARD UI - Admin subdomain detected
  if (adminConfig.isAdminDomain) {
    return <AdminDashboardTemplate />
  }

  // MASTER DASHBOARD UI - No tenant detected
  if (!tenant) {
    return <MasterDashboardTemplate />
  }

  // TENANT DASHBOARD UI - Load template dynamically
  // TODO: Fetch tenant's UI service configuration from API
  // Example: const uiConfig = await uiServiceApi.getTenantUIConfig(tenant.code, 'dashboard')
  // const dashboardTemplate = uiConfig?.template || UITemplate.DASHBOARD_MODERN

  // Use environment variable to test different templates
  // Set in .env.local: NEXT_PUBLIC_DEFAULT_DASHBOARD_TEMPLATE=dashboard-classic
  const envTemplate = process.env.NEXT_PUBLIC_DEFAULT_DASHBOARD_TEMPLATE as UITemplate
  const dashboardTemplate = envTemplate || UITemplate.DASHBOARD_MODERN

  // Prepare props for dashboard components
  const dashboardProps = {
    tenantCode: tenant.code,
    tenantName: tenant.code
  }

  // Render appropriate tenant dashboard template
  switch (dashboardTemplate) {
    case UITemplate.DASHBOARD_CLASSIC:
      return <TenantDashboardClassic {...dashboardProps} />

    case UITemplate.DASHBOARD_MINIMAL:
      return <TenantDashboardMinimal {...dashboardProps} />

    default:
      return <TenantDashboardModern {...dashboardProps} />
  }
}
