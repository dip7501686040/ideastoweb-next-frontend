"use client"

interface TenantDashboardModernProps {
  tenantCode: string
  tenantName: string
}

/**
 * Modern Dashboard Template - Card-based with gradient accents
 */
export default function TenantDashboardModern({ tenantCode, tenantName }: TenantDashboardModernProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl font-bold text-white">{tenantCode.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to {tenantName}</h1>
          <p className="text-lg text-gray-600">Your modern workspace dashboard</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
