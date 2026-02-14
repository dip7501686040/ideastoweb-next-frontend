import Link from "next/link"

interface TenantDashboardClassicProps {
  tenantCode: string
  tenantName: string
}

/**
 * Classic Dashboard Template - Traditional layout with sidebar-style navigation
 */
export default function TenantDashboardClassic({ tenantCode, tenantName }: TenantDashboardClassicProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-white">{tenantCode.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tenantName}</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </Link>
            <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded border border-gray-300 shadow p-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <svg className="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
