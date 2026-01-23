"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TenantApi } from "@/api/TenantApi"
import { Tenant } from "@/models/Tenant"
import TenantDeploymentConfig from "@/components/admin/TenantDeploymentConfig"
import Link from "next/link"
import { TokenManager } from "@/lib/tokenManager"

export default function TenantDeploymentPage() {
  const params = useParams()
  const router = useRouter()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        // Check authentication
        const user = TokenManager.getUserFromToken()
        if (!user) {
          router.push("/login")
          return
        }

        const tenantApi = new TenantApi()
        const tenantData = await tenantApi.getTenantByCode(params.tenantCode as string)
        setTenant(tenantData)
      } catch (err: any) {
        setError(err.message || "Failed to load tenant")
      } finally {
        setLoading(false)
      }
    }

    fetchTenant()
  }, [params.tenantCode, router])

  const handleSave = async (config: any) => {
    try {
      const tenantApi = new TenantApi()
      // Update using tenant ID from the loaded tenant object
      await tenantApi.updateDeploymentConfig(tenant!.id, config)
      // Reload tenant data
      const updatedTenant = await tenantApi.getTenantByCode(params.tenantCode as string)
      setTenant(updatedTenant)
    } catch (err: any) {
      alert("Failed to save configuration: " + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tenant configuration...</p>
        </div>
      </div>
    )
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Tenant</h2>
          <p className="text-gray-600 mb-4">{error || "Tenant not found"}</p>
          <button onClick={() => router.push("/dashboard/tenants")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Tenants
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => router.push(`/dashboard/tenants/${tenant.tenantCode}`)} className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← Back to Tenant
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">Deployment Configuration</h1>
          <p className="text-gray-600 mt-2">
            Manage infrastructure and routing for <strong>{tenant.name}</strong> ({tenant.tenantCode})
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Multi-Region Architecture</h3>
              <p className="text-sm text-blue-800">
                Configure tenant-specific infrastructure isolation. Changes take effect after saving and may require DNS updates. See{" "}
                <Link href="/docs/multi-region" className="underline">
                  Multi-Region Architecture Guide
                </Link>{" "}
                for details.
              </p>
            </div>
          </div>
        </div>

        {/* Current Tenant Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tenant Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Code</label>
              <div className="text-lg font-mono bg-gray-50 px-3 py-2 rounded">{tenant.tenantCode}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
              <div className="text-lg bg-gray-50 px-3 py-2 rounded">{tenant.name}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Frontend URL</label>
              <a href={tenant.getFrontendUrl()} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                {tenant.getFrontendUrl()}
              </a>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Backend URL</label>
              <div className="text-sm text-gray-600">{tenant.getBackendUrl()}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Infrastructure Type</label>
              <div className="flex items-center gap-2">
                {tenant.hasDedicatedInfrastructure() ? <span className="text-sm text-green-600 font-medium">✓ Dedicated</span> : <span className="text-sm text-gray-600">Shared</span>}
              </div>
            </div>
          </div>

          {tenant.hasDedicatedInfrastructure() && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">{tenant.getDeploymentSummary()}</p>
            </div>
          )}
        </div>

        {/* Deployment Configuration Component */}
        <TenantDeploymentConfig tenant={tenant} onSave={handleSave} />

        {/* Documentation Links */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Related Documentation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/docs/multi-region" className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
              <h3 className="font-semibold text-blue-600 mb-2">📖 Multi-Region Architecture</h3>
              <p className="text-sm text-gray-600">Learn about isolation levels, deployment patterns, and migration strategies</p>
            </Link>

            <Link href="/docs/kubernetes" className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
              <h3 className="font-semibold text-blue-600 mb-2">⚙️ Kubernetes Setup</h3>
              <p className="text-sm text-gray-600">Configure namespaces, pods, clusters for tenant isolation</p>
            </Link>

            <Link href="/docs/dns-setup" className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
              <h3 className="font-semibold text-blue-600 mb-2">🌐 DNS & Load Balancer</h3>
              <p className="text-sm text-gray-600">Set up DNS records and ingress for tenant routing</p>
            </Link>

            <Link href="/docs/migration" className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
              <h3 className="font-semibold text-blue-600 mb-2">🚀 Migration Guide</h3>
              <p className="text-sm text-gray-600">Step-by-step process for moving tenants to dedicated infrastructure</p>
            </Link>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Important Notes</h3>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li>Changes to deployment configuration may cause temporary service interruption</li>
                <li>Always test configuration changes in staging environment first</li>
                <li>DNS changes may take 5-60 minutes to propagate</li>
                <li>Ensure target infrastructure is provisioned before updating configuration</li>
                <li>Monitor tenant health metrics closely after migration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
