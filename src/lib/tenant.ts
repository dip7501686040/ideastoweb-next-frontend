/**
 * Tenant utility functions for domain-based routing
 */

export interface TenantConfig {
  code: string
  domain: string
  customDomain?: string
  isSubdomain: boolean
}

export interface AdminConfig {
  isAdminDomain: boolean
  isMasterAdmin: boolean // admin.myapp.com
  isTenantAdmin: boolean // admin.tenant.myapp.com
  tenantCode?: string // tenant code if tenant admin
}

/**
 * Detect admin subdomain configuration
 * Supports admin.myapp.com (master admin) and admin.tenant.myapp.com (tenant admin)
 */
export function getAdminConfig(hostname: string): AdminConfig {
  // Remove port if present
  const host = hostname.split(":")[0]

  // Define your main domain
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "localhost"

  // Check if it's an admin subdomain
  if (host.includes(mainDomain) && host !== mainDomain) {
    const parts = host.replace(`.${mainDomain}`, "").split(".")

    // admin.myapp.com → ["admin"]
    // admin.tenant.myapp.com → ["admin", "tenant"]

    if (parts.length === 1 && parts[0] === "admin") {
      // Master admin: admin.myapp.com
      return {
        isAdminDomain: true,
        isMasterAdmin: true,
        isTenantAdmin: false
      }
    }

    if (parts.length === 2 && parts[0] === "admin") {
      // Tenant admin: admin.tenant.myapp.com
      return {
        isAdminDomain: true,
        isMasterAdmin: false,
        isTenantAdmin: true,
        tenantCode: parts[1]
      }
    }
  }

  return {
    isAdminDomain: false,
    isMasterAdmin: false,
    isTenantAdmin: false
  }
}

/**
 * Extract tenant information from hostname
 * Supports both subdomain (tenant.example.com) and custom domain (customdomain.com)
 */
export function getTenantFromHost(hostname: string): TenantConfig | null {
  // Remove port if present
  const host = hostname.split(":")[0]

  // Define your main domain
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "localhost"

  // Check if it's a subdomain
  if (host.includes(mainDomain) && host !== mainDomain) {
    const subdomain = host.replace(`.${mainDomain}`, "")

    // Skip www, admin, and common subdomains
    if (subdomain && subdomain !== "www" && subdomain !== "api" && subdomain !== "admin" && !subdomain.startsWith("admin.")) {
      return {
        code: subdomain,
        domain: host,
        isSubdomain: true
      }
    }
  }

  // Check if it's a custom domain (not the main domain)
  if (host !== mainDomain && !host.includes(mainDomain)) {
    return {
      code: host.replace(/\./g, "-"), // Convert domain to code
      domain: host,
      customDomain: host,
      isSubdomain: false
    }
  }

  return null
}

/**
 * Check if current request is for a tenant
 */
export function isTenantRequest(hostname: string): boolean {
  return getTenantFromHost(hostname) !== null
}

/**
 * Get tenant code from request
 */
export function getTenantCode(hostname: string): string | null {
  const tenant = getTenantFromHost(hostname)
  return tenant?.code || null
}

/**
 * Build tenant URL
 */
export function buildTenantUrl(tenantCode: string, path: string = "/"): string {
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "localhost"
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const port = process.env.NODE_ENV === "production" ? "" : ":3000"

  return `${protocol}://${tenantCode}.${mainDomain}${port}${path}`
}
