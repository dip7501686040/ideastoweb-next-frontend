"use client"

import { useState } from "react"
import Link from "next/link"
import { useRoles } from "@/hooks/useRoles"
import { RoleApiType } from "@/models/Role"
import { showToast, handleApiError } from "@/lib/utils"

/**
 * 🛡️ ROLES MANAGEMENT - Core RBAC Management
 * Modern card-based role management with inline details
 */
export default function RolesManagement() {
  const { roles, loading, error, refetch, createRole, updateRole, deleteRole } = useRoles()

  const [selectedRole, setSelectedRole] = useState<RoleApiType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "system" | "custom">("all")

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false || role.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesFilter = filterType === "all" || (filterType === "system" && role.isSystem) || (filterType === "custom" && !role.isSystem)
    return matchesSearch && matchesFilter
  })

  const getPermissionSummary = (roleId: string | null) => {
    // TODO: Fetch actual permissions from API
    return "View in matrix"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
          <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Role
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button onClick={() => refetch()} className="mt-2 text-sm text-red-700 font-medium hover:text-red-900">
            Retry →
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterType === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("system")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterType === "system" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              System
            </button>
            <button
              onClick={() => setFilterType("custom")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterType === "custom" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Custom
            </button>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : filteredRoles.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No roles found</div>
        ) : (
          filteredRoles.map((role) => (
            <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{role.name || "Unnamed Role"}</h3>
                    {role.isSystem && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">System</span>}
                  </div>
                  <p className="text-sm text-gray-600">{role.description || "No description"}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">-</div>
                  <div className="text-xs text-gray-600">Permissions</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">-</div>
                  <div className="text-xs text-gray-600">Users</div>
                </div>
              </div>

              {/* Permission Summary */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-700 mb-1">Quick Summary</div>
                <div className="text-xs text-gray-600">{getPermissionSummary(role.id)}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => setSelectedRole(role)} className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium">
                  Edit Permissions
                </button>
                {!role.isSystem && (
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Role Details Drawer */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedRole.name || "Role"}</h2>
                <p className="text-sm text-gray-600">{selectedRole.description || "No description"}</p>
              </div>
              <button onClick={() => setSelectedRole(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex gap-6">
                  <button className="border-b-2 border-blue-600 text-blue-600 py-2 px-1 text-sm font-medium">Permissions Matrix</button>
                  <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium">Assigned Users</button>
                  <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium">Metadata</button>
                </nav>
              </div>

              {/* Permissions Matrix Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 text-center">Permissions Matrix Component (Embedded)</p>
                <Link href="/access-control/permissions" className="block text-center mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Open Full Permissions Matrix →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
