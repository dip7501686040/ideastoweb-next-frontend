import Link from "next/link"

interface TenantDashboardMinimalProps {
  tenantCode: string
  tenantName: string
}

/**
 * Minimal Dashboard Template - Clean, simple, text-focused design
 */
export default function TenantDashboardMinimal({ tenantCode, tenantName }: TenantDashboardMinimalProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-baseline hover:opacity-70 transition-opacity">
              <h1 className="text-xl font-light text-gray-900">{tenantName}</h1>
              <span className="ml-3 text-xs text-gray-500 font-mono">{tenantCode}</span>
            </Link>
            <Link href="/login" className="text-sm text-gray-900 hover:text-gray-600 font-medium transition-colors">
              Sign In →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-4">Getting Started</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
