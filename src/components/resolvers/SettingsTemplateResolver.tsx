"use client"

import { useRoot } from "@/providers/TenantProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import TenantSettingTemplate from "@/components/tenant/settings/TenantSettingTemplate"
import AdminTenantSetting from "@/components/admin/settings/AdminTenantSetting"
import { TenantConfig } from "@/lib/tenant"

/**
 * ⚙️ SETTINGS TEMPLATE RESOLVER
 * Requires tenant context (redirects if on master domain)
 * Uses root context established once in root layout
 */
export default function SettingsTemplateResolver() {
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if no tenant AND not an admin domain
    // Admin domains (admin.tenant.localhost) have tenant=null by design
    if (!tenant && !adminConfig.isAdminDomain) {
      router.push("/")
    }
  }, [tenant, adminConfig, router])

  // For tenant admin: derive TenantConfig from adminConfig if tenant is null
  const effectiveTenant: TenantConfig | null = tenant ?? (adminConfig.isTenantAdmin && adminConfig.tenantCode ? { code: adminConfig.tenantCode, domain: "", isSubdomain: true } : null)

  if (!effectiveTenant) {
    return null
  }

  if (adminConfig.isTenantAdmin) {
    return <AdminTenantSetting tenant={effectiveTenant} />
  }

  return <TenantSettingTemplate tenant={effectiveTenant} />
}
