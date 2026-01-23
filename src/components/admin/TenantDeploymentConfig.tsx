"use client"

import { useState } from "react"
import { Tenant, TenantDeploymentConfig } from "@/models/Tenant"
import { PlacementStrategy, determineTenantPlacement, validateRoutingConfig, planTenantMigration, InfrastructureConfig } from "@/lib/routing"

interface TenantDeploymentConfigProps {
  tenant: Tenant
  onSave: (config: TenantDeploymentConfig) => Promise<void>
}

// Mock infrastructure - replace with API call in production
const mockInfrastructure: InfrastructureConfig = {
  clusters: [
    {
      id: "cluster-us-east-1",
      name: "US East Cluster",
      region: "us-east-1",
      capacity: 100,
      currentLoad: 45,
      frontendUrl: "https://fe-us-east.yourapp.com",
      backendUrl: "https://api-us-east.yourapp.com"
    },
    {
      id: "cluster-eu-west-1",
      name: "EU West Cluster",
      region: "eu-west-1",
      capacity: 100,
      currentLoad: 30,
      frontendUrl: "https://fe-eu-west.yourapp.com",
      backendUrl: "https://api-eu-west.yourapp.com"
    },
    {
      id: "cluster-ap-south-1",
      name: "Asia Pacific Cluster",
      region: "ap-south-1",
      capacity: 50,
      currentLoad: 20,
      frontendUrl: "https://fe-ap-south.yourapp.com",
      backendUrl: "https://api-ap-south.yourapp.com"
    }
  ],
  regions: [
    {
      id: "us-east-1",
      name: "us-east-1",
      displayName: "US East (N. Virginia)",
      clusters: ["cluster-us-east-1"],
      dataResidency: false
    },
    {
      id: "eu-west-1",
      name: "eu-west-1",
      displayName: "EU West (Ireland)",
      clusters: ["cluster-eu-west-1"],
      dataResidency: true
    },
    {
      id: "ap-south-1",
      name: "ap-south-1",
      displayName: "Asia Pacific (Mumbai)",
      clusters: ["cluster-ap-south-1"],
      dataResidency: false
    }
  ],
  defaultCluster: "cluster-us-east-1",
  defaultRegion: "us-east-1"
}

export default function TenantDeploymentConfigComponent({ tenant, onSave }: TenantDeploymentConfigProps) {
  const [config, setConfig] = useState<TenantDeploymentConfig>(tenant.deploymentConfig || { isolationLevel: "shared" })
  const [strategy, setStrategy] = useState<PlacementStrategy>("shared")
  const [saving, setSaving] = useState(false)
  const [showMigrationPlan, setShowMigrationPlan] = useState(false)

  const validation = validateRoutingConfig(config)
  const migrationPlan = planTenantMigration(tenant, config)

  const handleApplyStrategy = () => {
    const newConfig = determineTenantPlacement(strategy, mockInfrastructure, {
      region: config.frontendRegion,
      dedicatedResources: strategy === "dedicated"
    })
    setConfig(newConfig)
  }

  const handleSave = async () => {
    if (!validation.valid) return

    setSaving(true)
    try {
      await onSave(config)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Current Deployment</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isolation Level</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{config.isolationLevel || "shared"}</span>
              {tenant.hasDedicatedInfrastructure() && <span className="text-green-600 text-sm">✓ Dedicated Infrastructure</span>}
            </div>
          </div>

          {tenant.hasDedicatedInfrastructure() && <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">{tenant.getDeploymentSummary()}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frontend URL</label>
              <input type="url" value={tenant.getFrontendUrl()} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backend URL</label>
              <input type="url" value={tenant.getBackendUrl()} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Change Deployment Strategy</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Placement Strategy</label>
            <select value={strategy} onChange={(e) => setStrategy(e.target.value as PlacementStrategy)} className="w-full px-3 py-2 border rounded-lg">
              <option value="shared">Shared - All tenants on default cluster</option>
              <option value="balanced">Balanced - Distribute by load</option>
              <option value="dedicated">Dedicated - Own cluster/resources</option>
              <option value="region-specific">Region Specific - Compliance/locality</option>
            </select>
          </div>

          <button onClick={handleApplyStrategy} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Apply Strategy
          </button>
        </div>
      </div>

      {/* Manual Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Manual Configuration</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isolation Level</label>
            <select
              value={config.isolationLevel}
              onChange={(e) =>
                setConfig({
                  ...config,
                  isolationLevel: e.target.value as any
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="shared">Shared</option>
              <option value="pod">Pod Level</option>
              <option value="cluster">Cluster Level</option>
              <option value="region">Region Level</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frontend Base URL</label>
              <input
                type="url"
                value={config.frontendBaseUrl || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    frontendBaseUrl: e.target.value
                  })
                }
                placeholder="https://tenant1.yourapp.com"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backend Base URL</label>
              <input
                type="url"
                value={config.backendBaseUrl || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    backendBaseUrl: e.target.value
                  })
                }
                placeholder="https://api-tenant1.yourapp.com"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frontend Region</label>
              <select
                value={config.frontendRegion || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    frontendRegion: e.target.value
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Default</option>
                {mockInfrastructure.regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backend Region</label>
              <select
                value={config.backendRegion || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    backendRegion: e.target.value
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Default</option>
                {mockInfrastructure.regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Database Region</label>
              <select
                value={config.databaseRegion || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    databaseRegion: e.target.value
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Default</option>
                {mockInfrastructure.regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frontend Cluster</label>
              <input
                type="text"
                value={config.frontendCluster || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    frontendCluster: e.target.value
                  })
                }
                placeholder="cluster-us-east-1"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backend Cluster</label>
              <input
                type="text"
                value={config.backendCluster || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    backendCluster: e.target.value
                  })
                }
                placeholder="cluster-us-east-1"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Namespace (Kubernetes)</label>
            <input
              type="text"
              value={config.namespace || ""}
              onChange={(e) =>
                setConfig({
                  ...config,
                  namespace: e.target.value
                })
              }
              placeholder="tenant-example"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Validation Errors */}
          {!validation.valid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Configuration Errors:</h4>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {validation.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Migration Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <button onClick={() => setShowMigrationPlan(!showMigrationPlan)} className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold">Migration Plan</h2>
          <span className="text-gray-400">{showMigrationPlan ? "▼" : "▶"}</span>
        </button>

        {showMigrationPlan && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Complexity:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    migrationPlan.complexity === "low" ? "bg-green-100 text-green-800" : migrationPlan.complexity === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {migrationPlan.complexity}
                </span>
              </div>

              {migrationPlan.downtime && (
                <div className="flex items-center gap-2 text-orange-600">
                  <span className="text-xl">⚠️</span>
                  <span className="text-sm font-medium">Requires Downtime</span>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-2">Migration Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                {migrationPlan.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button onClick={handleSave} disabled={!validation.valid || saving} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </div>
    </div>
  )
}
