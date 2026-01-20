"use client"

import { useState, useEffect } from "react"
import { serviceApi } from "@/api/ServiceApi"
import { Service, EnabledService } from "@/models/Service"

interface ServiceManagementProps {
  tenantCode: string
}

export default function ServiceManagement({ tenantCode }: ServiceManagementProps) {
  const [allServices, setAllServices] = useState<Service[]>([])
  const [enabledServices, setEnabledServices] = useState<EnabledService[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    loadData()
  }, [tenantCode])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [services, enabled] = await Promise.all([serviceApi.getAllServices(tenantCode), serviceApi.getEnabledServices(tenantCode)])
      setAllServices(services)
      setEnabledServices(enabled)
    } catch (err: any) {
      setError(err.message || "Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  const handleApplyService = async (serviceCode: string) => {
    try {
      setApplying(serviceCode)
      setError("")
      setSuccessMessage("")

      const response = await serviceApi.applyServiceToTenant({
        tenantCode,
        serviceCode
      })

      setSuccessMessage(`${response.message}\n\nApplied: ${response.appliedServices.map((s) => s.name).join(", ")}`)
      await loadData()
    } catch (err: any) {
      setError(err.message || "Failed to apply service")
    } finally {
      setApplying(null)
    }
  }

  const handleRemoveService = async (serviceCode: string) => {
    if (!confirm(`Are you sure you want to remove the "${serviceCode}" service?`)) return

    try {
      setRemoving(serviceCode)
      setError("")
      setSuccessMessage("")

      await serviceApi.removeServiceFromTenant(tenantCode, serviceCode)
      setSuccessMessage(`Service "${serviceCode}" removed successfully`)
      await loadData()
    } catch (err: any) {
      setError(err.message || "Failed to remove service")
    } finally {
      setRemoving(null)
    }
  }

  const isServiceEnabled = (serviceCode: string) => {
    // Fallback to enabledServices list
    return enabledServices.some((es) => es.code === serviceCode)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Management</h2>
        <p className="text-sm text-gray-600">
          Apply and manage services for tenant: <code className="bg-gray-100 px-2 py-1 rounded text-blue-600 font-mono">{tenantCode}</code>
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-700 whitespace-pre-line">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Enabled Services */}
      {enabledServices.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Enabled Services ({enabledServices.length})</h3>
          <div className="space-y-2">
            {enabledServices.map((enabled, idx) => (
              <div key={`enabled-${enabled.code ?? enabled.name ?? idx}-${enabled.id ?? idx}`} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">{enabled.name}</p>
                    <p className="text-xs text-gray-600">
                      Code: {enabled.code} • Enabled: {new Date(enabled.enabledAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveService(enabled.code)}
                  disabled={removing === enabled.code}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                >
                  {removing === enabled.code ? "Removing..." : "Remove"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Services (only those NOT applied) */}
      {(() => {
        const available = allServices.filter((s) => !isServiceEnabled(s.code))

        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📦 Available Services ({available.length})</h3>

            {available.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">No available services</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {available.map((service) => {
                  return (
                    <div key={`service-${service.code}-${service.id}`} className={`border-2 rounded-lg p-4 flex flex-col h-full border-gray-200 bg-white`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-bold text-gray-900">{service.name}</h4>
                          </div>
                          <p className="text-xs text-gray-600 font-mono mt-1">{service.code}</p>
                        </div>
                      </div>

                      {service.description && <p className="text-sm text-gray-700 mb-3">{service.description}</p>}

                      {service.dependencies && service.dependencies.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Dependencies:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.dependencies.map((dep) => (
                              <span key={`${service.code}-dep-${dep}`} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded border border-blue-200">
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleApplyService(service.code)}
                        disabled={applying === service.code}
                        className="mt-auto w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {applying === service.code ? "Applying..." : "Apply Service"}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })()}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 text-sm mb-2">💡 How it works</h4>
        <ul className="space-y-1 text-xs text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Auto-Dependency Resolution:</strong> When you apply a service, all its dependencies are automatically applied in the correct order
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Migration Execution:</strong> Database migrations are automatically run for each service module
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Circular Dependency Detection:</strong> The system prevents circular dependencies between services
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>Safe Removal:</strong> You cannot remove a service if other enabled services depend on it
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
