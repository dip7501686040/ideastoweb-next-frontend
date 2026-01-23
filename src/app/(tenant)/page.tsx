import { requireTenant } from "@/lib/tenantContext"
import { ServiceApi } from "@/api/ServiceApi"
import Link from "next/link"

/**
 * Tenant root page - Common dashboard for all tenants
 * Shows available services or initial setup message if no services enabled
 */
export default async function TenantRootPage() {
  const tenant = await requireTenant()

  // Fetch enabled services for this tenant
  const serviceApi = new ServiceApi()
  let enabledServices: any[] = []

  try {
    enabledServices = await serviceApi.getEnabledServices(tenant.code)
  } catch (error) {
    console.error("Failed to fetch enabled services:", error)
  }

  // Check if tenant has any services enabled
  const hasServices = enabledServices.length > 0

  // Map service codes to their UI paths
  const serviceUIMap: Record<string, { path: string; icon: string; color: string }> = {
    auth: {
      path: "/auth/login",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      color: "blue"
    },
    user: {
      path: "/users",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      color: "green"
    },
    product: {
      path: "/products",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      color: "purple"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasServices ? (
          /* Initial Landing Page - No Services */
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-2xl">
              {/* Logo/Icon */}
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-4xl font-bold text-white">{tenant.code.charAt(0).toUpperCase()}</span>
                </div>
              </div>

              {/* Welcome Message */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to {tenant.code}!</h1>
              <p className="text-xl text-gray-600 mb-8">Your tenant portal is ready, but no services have been enabled yet.</p>

              {/* Information Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-left">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🚀 Getting Started</h2>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">1.</span>
                    <span>Your administrator needs to enable services for your tenant from the main dashboard</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">2.</span>
                    <span>Once services are enabled, you'll see them listed here with access links</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">3.</span>
                    <span>Services include: Authentication, User Management, Products, and more</span>
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">📋 Tenant Information</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>
                    <strong>Tenant Code:</strong> <code className="bg-white px-2 py-0.5 rounded font-mono">{tenant.code}</code>
                  </p>
                  <p>
                    <strong>Portal URL:</strong>{" "}
                    <code className="bg-white px-2 py-0.5 rounded font-mono text-xs break-all">
                      {`http://${tenant.code}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "localhost"}${process.env.NODE_ENV === "production" ? "" : ":3000"}`}
                    </code>
                  </p>
                </div>
              </div>

              {/* Help Text */}
              <p className="mt-8 text-sm text-gray-500">Need help? Contact your system administrator to enable services.</p>
            </div>
          </div>
        ) : (
          /* Normal Dashboard - With Services */
          <>
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to {tenant.code}</h1>
              <p className="text-gray-600">Your tenant dashboard - Access your services and manage your application</p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enabledServices.map((service) => {
                const uiInfo = serviceUIMap[service.code] || {
                  path: "/settings",
                  icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                  color: "gray"
                }

                const colorClasses = {
                  blue: "bg-blue-100 text-blue-600 hover:border-blue-500",
                  green: "bg-green-100 text-green-600 hover:border-green-500",
                  purple: "bg-purple-100 text-purple-600 hover:border-purple-500",
                  gray: "bg-gray-100 text-gray-600 hover:border-gray-500"
                }

                return (
                  <Link
                    key={service.code}
                    href={uiInfo.path}
                    className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-transparent ${colorClasses[uiInfo.color as keyof typeof colorClasses]}`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 ${colorClasses[uiInfo.color as keyof typeof colorClasses].split(" ")[0]} rounded-lg flex items-center justify-center`}>
                        <svg className={`w-6 h-6 ${colorClasses[uiInfo.color as keyof typeof colorClasses].split(" ")[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={uiInfo.icon} />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600 text-sm">{service.description || `Manage ${service.name.toLowerCase()}`}</p>
                    <p className="text-xs text-gray-500 mt-2">Enabled: {new Date(service.enabledAt).toLocaleDateString()}</p>
                  </Link>
                )
              })}

              {/* Settings Link (Always Available) */}
              <Link href="/settings" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-transparent hover:border-gray-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
                <p className="text-gray-600 text-sm">Configure tenant settings and preferences</p>
              </Link>
            </div>

            {/* Info Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Tenant Information</h3>
                  <div className="mt-2 text-sm text-blue-700 space-y-1">
                    <p>
                      <strong>Tenant Code:</strong> {tenant.code}
                    </p>
                    <p>
                      <strong>Enabled Services:</strong> {enabledServices.length}
                    </p>
                    <p>
                      <strong>Portal URL:</strong>{" "}
                      <code className="bg-white px-1 py-0.5 rounded text-xs">{`http://${tenant.code}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "localhost"}${process.env.NODE_ENV === "production" ? "" : ":3000"}`}</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
