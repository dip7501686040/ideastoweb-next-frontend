"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRoot } from "@/providers/TenantProvider"

export default function TenantHeader() {
  const { logout } = useAuth()
  const { tenant } = useRoot()

  const tenantCode = tenant?.code ?? "T"
  const tenantName = (tenant?.code ?? "Tenant").toString()

  return (
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
              href="/cart"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Cart
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Products
            </Link>
            <Link
              href="/orders"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Orders
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
  )
}
