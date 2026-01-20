"use client"

import { useState } from "react"
import { tenantApi } from "@/api/TenantApi"
import { TenantRegistrationResponse } from "@/models/Tenant"

export default function TenantManagement() {
  const [tenantCode, setTenantCode] = useState("")
  const [tenantName, setTenantName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<TenantRegistrationResponse | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleRegisterTenant = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(null)

    try {
      const response = await tenantApi.registerTenant({
        tenantCode: tenantCode.toLowerCase().trim(),
        name: tenantName.trim()
      })

      setSuccess(response)
      setTenantCode("")
      setTenantName("")
      setShowApiKey(true)
    } catch (err: any) {
      setError(err.message || "Failed to register tenant")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleTestApiKey = async () => {
    if (!success?.apiKey) return

    try {
      const response = await tenantApi.testProtectedRoute(success.apiKey)
      alert(`✅ Success: ${response.message}`)
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tenant Management</h2>

      {/* Registration Form */}
      <form onSubmit={handleRegisterTenant} className="space-y-4 mb-6">
        <div>
          <label htmlFor="tenantCode" className="block text-sm font-medium text-gray-700 mb-1">
            Tenant Code
          </label>
          <input
            type="text"
            id="tenantCode"
            value={tenantCode}
            onChange={(e) => setTenantCode(e.target.value)}
            placeholder="e.g., acme, test123"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            required
            pattern="[a-z0-9]+"
            title="Only lowercase letters and numbers allowed"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">Only lowercase letters and numbers</p>
        </div>

        <div>
          <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700 mb-1">
            Tenant Name
          </label>
          <input
            type="text"
            id="tenantName"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            placeholder="e.g., ACME Corporation"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
          {loading ? "Registering..." : "Register Tenant"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message with API Key */}
      {success && (
        <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-start mb-4">
            <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-900 mb-2">Tenant Registered Successfully! 🎉</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Tenant ID:</span>
                  <p className="font-mono text-gray-900 mt-1 bg-white px-3 py-2 rounded border border-gray-200">{success.tenantId}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Tenant Code:</span>
                  <p className="font-mono text-gray-900 mt-1 bg-white px-3 py-2 rounded border border-gray-200">{success.tenantCode}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">API Key:</span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input type={showApiKey ? "text" : "password"} value={success.apiKey} readOnly className="w-full font-mono text-xs text-gray-900 bg-white px-3 py-2 rounded border border-gray-200 pr-20" />
                      <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs">
                        {showApiKey ? "Hide" : "Show"}
                      </button>
                    </div>
                    <button onClick={() => copyToClipboard(success.apiKey)} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors" title="Copy to clipboard">
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800 font-semibold">⚠️ Important: Save this API key now!</p>
                <p className="text-xs text-yellow-700 mt-1">This key will not be shown again. Store it securely.</p>
              </div>

              {/* Test Button */}
              <button onClick={handleTestApiKey} className="mt-4 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded transition-colors">
                🧪 Test API Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 text-sm mb-2">What happens when you register a tenant?</h4>
        <ul className="space-y-1 text-xs text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Creates a new dedicated database: <code className="bg-white px-1 rounded">tenant_&lt;code&gt;</code>
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Generates a unique 64-character API key</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Stores hashed API key for secure authentication</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Returns the API key only once (cannot be retrieved later)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
