import { getServerTenant } from "@/lib/tenantContext"
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm"

/**
 * 🔑 SERVER-SIDE FORGOT PASSWORD TEMPLATE RESOLVER
 * Handles all tenant detection on the server
 * Currently uses same form for both master and tenant
 */
export default async function ForgotPasswordTemplateResolver() {
  // Server-side tenant detection (happens once per request)
  const tenant = await getServerTenant()

  // Common forgot password form for both master and tenant
  // TODO: Create separate master/tenant templates if needed
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
        <p className="text-gray-600 mt-2">{tenant ? `Reset your ${tenant.code} account password` : "Reset your master account password"}</p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
