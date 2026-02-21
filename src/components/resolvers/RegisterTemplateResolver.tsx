"use client"

import { useRoot } from "@/providers/TenantProvider"
import TenantRegisterModern from "@/components/tenant/auth/TenantRegisterModern"
import MasterRegister from "../master/auth/MasterRegister"

/**
 * 📝 REGISTER TEMPLATE RESOLVER
 * Uses root context established once in root layout
 * Note: Registration is only available for tenants, not master portal
 */
export default function RegisterTemplateResolver() {
  const { tenant } = useRoot()

  // Redirect or show error if no tenant (master domain)
  if (!tenant) {
    return <MasterRegister />
  }

  // TENANT REGISTER UI - Load template dynamically
  // TODO: Fetch template preference from backend API based on tenant
  const template = process.env.NEXT_PUBLIC_DEFAULT_AUTH_TEMPLATE || "modern"

  // For now, we only have modern template for registration
  // TODO: Create TenantRegisterClassic and TenantRegisterMinimal
  return <TenantRegisterModern tenantCode={tenant.code} />
}
