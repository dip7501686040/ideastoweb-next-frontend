"use client"

import { useRoot } from "@/providers/TenantProvider"
import TenantUserTable from "@/components/tenant/users/TenantUserTable"
import { UITemplate } from "@/models/UIService"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * 👥 USERS TEMPLATE RESOLVER
 * Requires tenant context (redirects if on master domain)
 * Uses root context established once in root layout
 */
export default function UsersTemplateResolver() {
  // TODO: Fetch tenant's UI service configuration from API
  // Example: const uiConfig = await uiServiceApi.getTenantUIConfig(tenant.code, 'users')
  const template = process.env.NEXT_PUBLIC_DEFAULT_USERS_TEMPLATE || UITemplate.USER_TABLE

  // Render appropriate template
  return (
    <div className="min-h-screen bg-gray-50">
      <TenantUserTable />
    </div>
  )
}
