import { requireTenant } from "@/lib/tenantContext"

/**
 * Tenant settings page
 */
export default async function TenantSettingsPage() {
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenant Code</label>
                <input type="text" value={tenant.code} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                <input type="text" value={tenant.domain} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
              </div>
              {tenant.customDomain && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Domain</label>
                  <input type="text" value={tenant.customDomain} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                </div>
              )}
            </div>
          </div>

          {/* UI Services Configuration */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">UI Services</h2>
            <p className="text-sm text-gray-600 mb-4">Configure the UI templates and services enabled for your tenant</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">Authentication UI</p>
                  <p className="text-sm text-gray-500">Modern template</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">User Management UI</p>
                  <p className="text-sm text-gray-500">Table template</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">Product UI</p>
                  <p className="text-sm text-gray-500">Grid template</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Enabled</span>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Branding</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                <input type="text" placeholder="Your Brand Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input type="color" defaultValue="#3B82F6" className="h-10 w-20 border border-gray-300 rounded-md cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
