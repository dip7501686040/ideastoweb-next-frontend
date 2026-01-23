/**
 * Server-side tenant context utilities
 */

import { headers } from "next/headers"
import { getTenantFromHost, TenantConfig } from "./tenant"

/**
 * Get tenant information from request headers (Server Component)
 */
export async function getTenantContext(): Promise<TenantConfig | null> {
  const headersList = await headers()
  const hostname = headersList.get("host") || ""

  return getTenantFromHost(hostname)
}

/**
 * Get tenant code from request headers (Server Component)
 */
export async function getCurrentTenantCode(): Promise<string | null> {
  const tenant = await getTenantContext()
  return tenant?.code || null
}

/**
 * Require tenant context or throw error
 */
export async function requireTenant(): Promise<TenantConfig> {
  const tenant = await getTenantContext()

  if (!tenant) {
    throw new Error("Tenant context required")
  }

  return tenant
}
