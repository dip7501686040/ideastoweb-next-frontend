/**
 * Server-side tenant context utilities
 */

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getTenantFromHost, TenantConfig, getAdminConfig, AdminConfig } from "./tenant"

/**
 * Get tenant information from request headers (Server Component)
 */
export async function getTenantContext(): Promise<TenantConfig | null> {
  const headersList = await headers()
  const hostname = headersList.get("host") || ""

  return getTenantFromHost(hostname)
}

/**
 * Get tenant information from request headers (alias for consistency)
 */
export async function getServerTenant(): Promise<TenantConfig | null> {
  const host = (await headers()).get("host") || ""
  return getTenantFromHost(host)
}

/**
 * Get tenant code from request headers (Server Component)
 */
export async function getCurrentTenant(): Promise<TenantConfig | null> {
  const tenant = await getTenantContext()
  return tenant || null
}

/**
 * Require tenant context or redirect
 */
export async function requireTenant(): Promise<TenantConfig> {
  const tenant = await getServerTenant()

  if (!tenant) {
    redirect("/")
  }

  return tenant
}
/**
 * Require master context or redirect
 */
export async function requireMaster(): Promise<TenantConfig | null> {
  const tenant = await getServerTenant()

  if (tenant) {
    redirect("/")
  }

  return tenant
}

/**
 * Get admin configuration from request headers (Server Component)
 */
export async function getServerAdminConfig(): Promise<AdminConfig> {
  const host = (await headers()).get("host") || ""
  return getAdminConfig(host)
}
