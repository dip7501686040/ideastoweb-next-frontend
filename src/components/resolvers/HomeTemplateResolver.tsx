import { getServerTenant } from "@/lib/tenantContext"
import MasterHome from "@/components/master/home/MasterHome"
import TenantHomeModern from "@/components/tenant/home/TenantHomeModern"
import TenantHomeClassic from "@/components/tenant/home/TenantHomeClassic"
import TenantHomeMinimal from "@/components/tenant/home/TenantHomeMinimal"

/**
 * 🏠 SERVER-SIDE HOME TEMPLATE RESOLVER
 * Handles all tenant detection and template selection on the server
 * Ensures security by never exposing tenant detection logic to the client
 */
export default async function HomeTemplateResolver() {
  // Server-side tenant detection (happens once per request)
  const tenant = await getServerTenant()

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
