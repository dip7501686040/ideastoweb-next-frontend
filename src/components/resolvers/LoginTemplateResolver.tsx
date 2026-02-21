"use client"

import { useRoot } from "@/providers/TenantProvider"
import MasterLogin from "@/components/master/auth/MasterLogin"
import TenantLoginModern from "@/components/tenant/auth/TenantLoginModern"
import TenantLoginClassic from "@/components/tenant/auth/TenantLoginClassic"
import TenantLoginMinimal from "@/components/tenant/auth/TenantLoginMinimal"
import { AdminLoginForm } from "@/components/admin/auth/AdminLoginForm"

/**
 * 🔐 LOGIN TEMPLATE RESOLVER
 * Uses root context established once in root layout
 * No duplicate tenant detection - cleaner and more efficient
 */
export default function LoginTemplateResolver() {
  const { tenant, adminConfig } = useRoot()

  // ADMIN LOGIN UI - Admin subdomain detected
  if (adminConfig.isAdminDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <AdminLoginForm />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div>
      </div>
    )
  }

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
