"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { tenantApi } from "@/api/TenantApi"
import { Tenant } from "@/models/Tenant"

export default function TenantList() {
  const router = useRouter()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await tenantApi.getMyTenants()
      setTenants(data)
    } catch (err: any) {
      setError(err.message || "Failed to load tenants")
    } finally {
      setLoading(false)
    }
  }

  const handleCardDoubleClick = (tenantCode: string) => {
    router.push(`/dashboard/tenants/${tenantCode}`)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Loading tenants...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Tenants</h2>
        <button onClick={loadTenants} className="text-sm text-blue-600 hover:text-blue-700 font-medium" title="Refresh">
          🔄 Refresh
        </button>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-4 text-gray-600">No tenants yet</p>
          <p className="text-sm text-gray-500 mt-1">Register your first tenant above to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              onDoubleClick={() => handleCardDoubleClick(tenant.tenantCode)}
              className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5 hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer"
              title="Double-click to manage services"
            >
              {/* Tenant Icon */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-blue-600 font-medium">Double-click</span>
                </div>
              </div>

              {/* Tenant Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 truncate" title={tenant.name}>
                  {tenant.name}
                </h3>
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 mr-2">Code:</span>
                  <code className="bg-white px-2 py-1 rounded text-blue-600 font-mono text-xs border border-blue-200">{tenant.tenantCode}</code>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Created {new Date(tenant.createdAt || "").toLocaleDateString()}</span>
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
