import { requireTenant } from "@/lib/tenantContext"

/**
 * ⚙️ SERVER-SIDE SETTINGS TEMPLATE RESOLVER
 * Requires tenant context (redirects if on master domain)
 * All tenant validation happens on the server
 */
export default async function SettingsTemplateResolver() {
  // Server-side tenant requirement (redirects to / if no tenant)
  const tenant = await requireTenant()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your tenant configuration and preferences</p>
        </div>

        {/* Settings Sections */}
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

          {/* Appearance Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Modern</option>
                  <option>Classic</option>
                  <option>Minimal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Enable</button>
              </div>
            </div>
          </div>

          {/* API Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <div className="flex gap-2">
                  <input type="password" value="sk_live_********************************" disabled className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Regenerate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
