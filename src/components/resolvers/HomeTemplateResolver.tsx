"use client"

import { useRoot } from "@/providers/TenantProvider"
import MasterHome from "@/components/master/home/MasterHome"
import TenantHomeModern from "@/components/tenant/home/TenantHomeModern"
import TenantHomeClassic from "@/components/tenant/home/TenantHomeClassic"
import TenantHomeMinimal from "@/components/tenant/home/TenantHomeMinimal"

/**
 * 🏠 HOME TEMPLATE RESOLVER
 * Uses root context established once in root layout
 * No duplicate tenant detection - cleaner and more efficient
 */
export default function HomeTemplateResolver() {
  const { tenant } = useRoot()

  // MASTER HOME UI - No tenant detected
  if (!tenant) {
    return <MasterHome />
  }

  // TENANT HOME UI - Load template dynamically
  // TODO: Fetch template preference from backend API based on tenant
  const template = process.env.NEXT_PUBLIC_DEFAULT_HOME_TEMPLATE || "modern"

  // Render appropriate tenant template
  switch (template) {
    case "classic":
      return <TenantHomeClassic tenantCode={tenant.code} />

    case "minimal":
      return <TenantHomeMinimal tenantCode={tenant.code} />

    default:
      return <TenantHomeModern tenantCode={tenant.code} />
  }
}
