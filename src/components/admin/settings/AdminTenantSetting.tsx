"use client"

import { useState, useEffect } from "react"
import { useSettings } from "@/hooks/useSettings"
import { useServiceProviders } from "@/hooks/useServiceProviders"
import { TenantConfig } from "@/lib/tenant"
import { showToast, handleApiError } from "@/lib/utils"

const SERVICE_PROVIDER_KEY = "default_service_provider_type"
const DEFAULT_SERVICE_PROVIDER_ID_KEY = "default_service_provider_id"

const SERVICE_PROVIDER_OPTIONS = [
  { value: "single", label: "Single", description: "Use a single service provider across your tenant" },
  { value: "multiple", label: "Multiple", description: "Use multiple service providers across your tenant" }
]

export default function AdminTenantSetting({ tenant }: { tenant: TenantConfig }) {
  const { settings, loading, error, getSetting, updateSettings } = useSettings()
  const { serviceProviders, loading: providersLoading } = useServiceProviders()
  const [selectedProvider, setSelectedProvider] = useState("")
  const [selectedProviderId, setSelectedProviderId] = useState("")
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Sync local state once settings are loaded
  useEffect(() => {
    const setting = getSetting(SERVICE_PROVIDER_KEY)
    if (setting) {
      setSelectedProvider(setting.value)
    }
    const providerIdSetting = getSetting(DEFAULT_SERVICE_PROVIDER_ID_KEY)
    if (providerIdSetting) {
      setSelectedProviderId(providerIdSetting.value)
    }
  }, [settings, getSetting])

  const handleProviderChange = (value: string) => {
    setSelectedProvider(value)
    if (value !== "single") {
      setSelectedProviderId("")
    }
    setIsDirty(true)
  }

  const handleProviderIdChange = (value: string) => {
    setSelectedProviderId(value)
    setIsDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates: { key: string; value: string }[] = [{ key: SERVICE_PROVIDER_KEY, value: selectedProvider }]
      if (selectedProvider === "single") {
        updates.push({ key: DEFAULT_SERVICE_PROVIDER_ID_KEY, value: selectedProviderId })
      }
      await updateSettings(updates)
      showToast({ message: "Settings saved successfully", type: "success" })
      setIsDirty(false)
    } catch (err: any) {
      handleApiError(err)
    } finally {
      setSaving(false)
    }
  }

  const isSaveDisabled = saving || !isDirty || !selectedProvider || (selectedProvider === "single" && !selectedProviderId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your tenant configuration and preferences</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Code</label>
                <input type="text" value={tenant.code} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <input type="text" value={tenant.domain} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Service Provider Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">Service Provider</h2>
              {isDirty && <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">Unsaved changes</span>}
            </div>
            <p className="text-sm text-gray-500 mb-5">Choose the default type of service provider used across your tenant.</p>

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading settings…
              </div>
            )}

            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">{error}</div>}

            {!loading && (
              <div className="space-y-3">
                {SERVICE_PROVIDER_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProvider === option.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={SERVICE_PROVIDER_KEY}
                      value={option.value}
                      checked={selectedProvider === option.value}
                      onChange={() => handleProviderChange(option.value)}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </label>
                ))}

                {selectedProvider === "single" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Service Provider <span className="text-red-500">*</span>
                    </label>
                    {providersLoading ? (
                      <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Loading providers…
                      </div>
                    ) : serviceProviders.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No service providers found. Create one in Booking Setup first.</p>
                    ) : (
                      <select
                        value={selectedProviderId}
                        onChange={(e) => handleProviderIdChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select a provider…</option>
                        {serviceProviders.map((sp) => (
                          <option key={sp.id} value={sp.id}>
                            {sp.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button onClick={handleSave} disabled={isSaveDisabled} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                {saving && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
