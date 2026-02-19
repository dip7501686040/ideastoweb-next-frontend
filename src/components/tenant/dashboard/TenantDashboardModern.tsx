"use client"

import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

interface TenantDashboardModernProps {
  tenantCode: string
  tenantName: string
}

/**
 * Modern Dashboard Template - Card-based with gradient accents
 */
export default function TenantDashboardModern({ tenantCode, tenantName }: TenantDashboardModernProps) {
  const { logout } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">{tenantCode.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{tenantName}</span>
            </Link>
            <div className="flex gap-4">
              <Link
                href="/users"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Users
              </Link>
              <Link
                href="/products"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Products
              </Link>
              <Link
                href="/settings"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Settings
              </Link>
              <button onClick={logout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer shadow-md hover:shadow-lg">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

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
