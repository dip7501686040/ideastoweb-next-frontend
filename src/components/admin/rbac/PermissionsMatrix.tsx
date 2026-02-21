"use client"

import { useState } from "react"
import { useRoles } from "@/hooks/useRoles"
import { usePermissionsMatrix } from "@/hooks/usePermissionsMatrix"
import { showToast, handleApiError } from "@/lib/utils"

/**
 * 🔐 PERMISSIONS MATRIX - Core RBAC Screen
 * Modern matrix-based permission management
 * Rows = Modules, Columns = Operations, Cells = Toggle
 */
export default function PermissionsMatrix() {
  // Fetch roles
  const { roles, loading: rolesLoading } = useRoles()
  const [selectedRole, setSelectedRole] = useState<string>("")

  // Fetch matrix data for selected role
  const { modules, operations, permissions, loading: matrixLoading, error, hasPermission, togglePermission, refetch } = usePermissionsMatrix(selectedRole || undefined)

  // Set first role as selected when roles load
  if (!selectedRole && roles.length > 0 && roles[0].id) {
    setSelectedRole(roles[0].id)
  }

  const selectedRoleObj = roles.find((r) => r.id === selectedRole)

  const handleToggle = async (moduleKey: string | null, operationKey: string | null) => {
    if (!selectedRole || !moduleKey || !operationKey) return

    try {
      await togglePermission(selectedRole, moduleKey, operationKey)
      showToast({ message: "Permission updated", type: "success" })
    } catch (err) {
      handleApiError(err, "Failed to update permission")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permissions Matrix</h1>
          <p className="text-gray-600 mt-1">Manage role permissions with visual matrix interface</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Clone Role</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Changes</button>
        </div>
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

      {/* Role Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Select Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            disabled={rolesLoading}
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {rolesLoading ? (
              <option>Loading roles...</option>
            ) : roles.length === 0 ? (
              <option>No roles available</option>
            ) : (
              roles.map((role) => (
                <option key={role.id} value={role.id || ""}>
                  {role.name} {role.isSystem ? "(System)" : ""}
                </option>
              ))
            )}
          </select>
        </div>
        {selectedRoleObj && <p className="text-sm text-gray-600 mt-2 ml-24">{selectedRoleObj.description || "No description"}</p>}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {matrixLoading ? (
            <div className="p-12 text-center text-gray-500">Loading permissions matrix...</div>
          ) : modules.length === 0 || operations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No modules or operations configured</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-64">Module</th>
                  {operations.map((op) => (
                    <th key={op.id} className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                      {op.key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {modules.map((module) => (
                  <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{module.key}</div>
                        <div className="text-xs text-gray-500">{module.description || ""}</div>
                      </div>
                    </td>
                    {operations.map((op) => (
                      <td key={op.id} className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggle(module.key, op.key)}
                          disabled={selectedRoleObj?.isSystem === true}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            hasPermission(module.key || "", op.key || "") ? "bg-green-100 text-green-600 hover:bg-green-200" : " bg-gray-100 text-gray-400 hover:bg-gray-200"
                          } ${selectedRoleObj?.isSystem === true ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          {hasPermission(module.key || "", op.key || "") ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Quick Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {modules.map((module) => {
            const modulePerms = operations.filter((op) => hasPermission(module.key || "", op.key || "")).map((op) => op.key?.charAt(0) || "")
            return (
              <div key={module.id} className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="text-sm font-medium text-gray-900">{module.key}</div>
                <div className="text-xs text-gray-600 mt-1">{modulePerms.length > 0 ? modulePerms.join("") : "No Access"}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
