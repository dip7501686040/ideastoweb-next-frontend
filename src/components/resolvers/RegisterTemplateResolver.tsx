import { getServerTenant } from "@/lib/tenantContext"
import TenantRegisterModern from "@/components/tenant/auth/TenantRegisterModern"

/**
 * 📝 SERVER-SIDE REGISTER TEMPLATE RESOLVER
 * Handles all tenant detection and template selection on the server
 * Note: Registration is only available for tenants, not master portal
 */
export default async function RegisterTemplateResolver() {
  // Server-side tenant detection (happens once per request)
  const tenant = await getServerTenant()

  // Redirect or show error if no tenant (master domain)
  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Not Available</h1>
          <p className="text-gray-600">Registration is only available on tenant domains.</p>
        </div>
      </div>
    )
  }

  // TENANT REGISTER UI - Load template dynamically
  // TODO: Fetch template preference from backend API based on tenant
  const template = process.env.NEXT_PUBLIC_DEFAULT_AUTH_TEMPLATE || "modern"

  // For now, we only have modern template for registration
  // TODO: Create TenantRegisterClassic and TenantRegisterMinimal
  return <TenantRegisterModern tenantCode={tenant.code} />
}
