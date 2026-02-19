/**
 * Resolve API key for a tenant.
 *
 * Strategy:
 * - Next.js requires explicit env var references (no dynamic access)
 * - We build a mapping at module load time with all possible tenant API keys
 * - Fall back to default NEXT_PUBLIC_API_KEY if tenant-specific key not found
 *
 * To add a tenant-specific API key, add to your .env:
 * NEXT_PUBLIC_API_KEY_<TENANTCODE>=your-api-key
 *
 * Example:
 * NEXT_PUBLIC_API_KEY_BEAUTY=beauty-salon-key
 * NEXT_PUBLIC_API_KEY_CLINIC=clinic-key
 */

// Build tenant API key mapping at initialization
// Add your tenant-specific keys here explicitly so Next.js can inline them
const TENANT_API_KEYS: Record<string, string> = {
  // Default/fallback key
  DEFAULT: process.env.NEXT_PUBLIC_API_KEY || "",

  // Tenant-specific keys - add more as needed
  // Next.js will inline these at build time
  BEAUTY: process.env.NEXT_PUBLIC_API_KEY_BEAUTY || "",
  CLINIC: process.env.NEXT_PUBLIC_API_KEY_CLINIC || "",
  SALON: process.env.NEXT_PUBLIC_API_KEY_SALON || "",
  SPA: process.env.NEXT_PUBLIC_API_KEY_SPA || "",
  GROK: process.env.NEXT_PUBLIC_API_KEY_GROK || ""
}

export function getApiKeyForTenant(tenantCode?: string): string {
  if (!tenantCode) return TENANT_API_KEYS.DEFAULT

  // Normalize tenant code (uppercase, replace non-alphanumeric with underscore)
  const normalized = tenantCode.toUpperCase().replace(/[^A-Z0-9]/g, "_")

  // Return tenant-specific key or fall back to default
  return TENANT_API_KEYS[normalized] || TENANT_API_KEYS.DEFAULT
}

export default getApiKeyForTenant
