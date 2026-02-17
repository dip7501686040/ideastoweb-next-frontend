import Link from "next/link"

export default function MasterHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Master Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Control Center</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Manage tenants, configure services, and oversee your entire multi-tenant ecosystem from one powerful platform.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/login" className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Master Login
            </Link>
            <Link href="/companies" className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all border border-gray-200">
              View Companies
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl border border-white/20">
              <div className="text-purple-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Tenant Management</h3>
              <p className="text-gray-300 text-sm">Create, configure, and manage multiple tenant organizations</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl border border-white/20">
              <div className="text-pink-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Service Configuration</h3>
              <p className="text-gray-300 text-sm">Define and manage services across all tenant instances</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl border border-white/20">
              <div className="text-blue-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics & Insights</h3>
              <p className="text-gray-300 text-sm">Monitor usage, performance, and health across all tenants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
