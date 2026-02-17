"use client"

import { useAuth } from "@/hooks/useAuth"
import TenantManagement from "@/components/tenant/TenantManagement"
import TenantList from "@/components/tenant/TenantList"

export default function MasterDashboardTemplate() {
  const { user, logout, initializing } = useAuth()

  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back{user?.name ? `, ${user.name}` : " to IdeasToWeb"}</p>
            </div>
            <button onClick={logout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">API Calls</p>
                <p className="text-2xl font-bold text-gray-900">89.2K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">🎉 Authentication Complete!</h2>
          <p className="text-blue-100 text-lg mb-4">You've successfully logged in. Your session is protected with JWT tokens stored in secure HTTP-only cookies.</p>
          <div className="flex gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-100">Access Token</p>
              <p className="font-semibold">✓ Secured</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-100">Refresh Token</p>
              <p className="font-semibold">✓ Secured</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-100">Role</p>
              <p className="font-semibold">OWNER</p>
            </div>
          </div>
        </div>

        {/* Tenant Management Section */}
        <div className="mb-8">
          <TenantManagement />
        </div>

        {/* Tenant List Section */}
        <div className="mb-8">
          <TenantList />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🔐 Security Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                JWT-based authentication
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                HTTP-only cookies
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Automatic token refresh
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Password reset flow
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🚀 Next Steps</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-semibold mr-2">1</span>
                Set up your tenant database
              </li>
              <li className="flex items-center">
                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-semibold mr-2">2</span>
                Configure your API keys
              </li>
              <li className="flex items-center">
                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-semibold mr-2">3</span>
                Invite team members
              </li>
              <li className="flex items-center">
                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-semibold mr-2">4</span>
                Deploy your application
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
