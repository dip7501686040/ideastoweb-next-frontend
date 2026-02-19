"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import ServiceManagement from "@/components/tenant/ServiceManagement"
import { tenantApi } from "@/api/TenantApi"

export default function TenantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tenantCode = params.tenantCode as string
  const [deleting, setDeleting] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/dashboard/tenants/${tenantCode}/deployment`)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                title="Configure Infrastructure"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
                Infrastructure
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ServiceManagement tenantCode={tenantCode} />

        {/* Danger Zone */}
        <section className="mt-12 max-w-2xl">
          <div className="bg-white shadow rounded-md p-6 border border-red-100">
            <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
            <p className="text-sm text-gray-600 mt-2">Deleting a tenant is irreversible — it will remove the tenant and its database.</p>
            <div className="mt-4">
              <button
                onClick={async () => {
                  if (!confirm(`Are you sure you want to delete tenant '${tenantCode}'? This cannot be undone.`)) return
                  try {
                    setDeleting(true)
                    await tenantApi.deleteTenant(tenantCode)
                    router.push("/dashboard")
                  } catch (err) {
                    // minimal error handling — inform the user
                    // eslint-disable-next-line no-alert
                    alert("Failed to delete tenant. Please try again.")
                  } finally {
                    setDeleting(false)
                  }
                }}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
                title="Delete tenant"
              >
                {deleting ? "Deleting…" : "Delete Tenant"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
