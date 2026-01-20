"use client"

import { useParams, useRouter } from "next/navigation"
import ServiceManagement from "@/components/tenant/ServiceManagement"

export default function TenantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tenantCode = params.tenantCode as string

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button onClick={() => router.push("/dashboard")} className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Back to Dashboard">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tenant: {tenantCode}</h1>
              <p className="text-sm text-gray-600 mt-1">Manage services and configurations</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ServiceManagement tenantCode={tenantCode} />
      </main>
    </div>
  )
}
