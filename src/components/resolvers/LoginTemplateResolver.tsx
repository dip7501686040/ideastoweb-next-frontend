import { getServerTenant } from "@/lib/tenantContext"
import MasterLogin from "@/components/master/auth/MasterLogin"
import TenantLoginModern from "@/components/tenant/auth/TenantLoginModern"
import TenantLoginClassic from "@/components/tenant/auth/TenantLoginClassic"
import TenantLoginMinimal from "@/components/tenant/auth/TenantLoginMinimal"

/**
 * 🔐 SERVER-SIDE LOGIN TEMPLATE RESOLVER
 * Handles all tenant detection and template selection on the server
 * Ensures security by never exposing tenant detection logic to the client
 */
export default async function LoginTemplateResolver() {
  // Server-side tenant detection (happens once per request)
  const tenant = await getServerTenant()

  // MASTER LOGIN UI - No tenant detected
  if (!tenant) {
    return <MasterLogin />
  }

  // TENANT LOGIN UI - Load template dynamically
  // TODO: Fetch template preference from backend API based on tenant
  const template = process.env.NEXT_PUBLIC_DEFAULT_AUTH_TEMPLATE || "modern"

  // Render appropriate tenant template
  switch (template) {
    case "classic":
      return <TenantLoginClassic tenantCode={tenant.code} />

    case "minimal":
      return <TenantLoginMinimal tenantCode={tenant.code} />

    default:
      return <TenantLoginModern tenantCode={tenant.code} />
  }
}
