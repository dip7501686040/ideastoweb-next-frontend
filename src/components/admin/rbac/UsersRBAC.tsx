"use client"

import { useState, useEffect } from "react"
import { useUsers } from "@/hooks/useUsers"
import { useRoles } from "@/hooks/useRoles"
import { ApiUser } from "@/models/User"
import { RoleApiType } from "@/models/Role"
import { showToast, handleApiError } from "@/lib/utils"

/**
 * 👤 USERS RBAC - Role Assignment Layer
 * Modern user management with role chips and quick assign
 */
export default function UsersRBAC() {
  // Fetch data from API
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers()
  const { roles, loading: rolesLoading, assignRoleToUser, removeRoleFromUser, getUserRoles } = useRoles()

  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null)
  const [selectedUserRoles, setSelectedUserRoles] = useState<RoleApiType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)

  // Load selected user's roles
  useEffect(() => {
    if (selectedUser?.id) {
      setIsLoadingRoles(true)
      getUserRoles(selectedUser.id)
        .then(setSelectedUserRoles)
        .catch((err) => handleApiError(err, "Failed to load user roles"))
        .finally(() => setIsLoadingRoles(false))
    }
  }, [selectedUser, getUserRoles])

  // Handle role assignment
  const handleAssignRole = async (roleId: string) => {
    if (!selectedUser?.id) return

    try {
      await assignRoleToUser(selectedUser.id, roleId)
      showToast({ message: "Role assigned successfully", type: "success" })

      // Refresh user roles
      const updatedRoles = await getUserRoles(selectedUser.id)
      setSelectedUserRoles(updatedRoles)
      await refetchUsers()
    } catch (err) {
      handleApiError(err, "Failed to assign role")
    }
  }

  // Handle role removal
  const handleRemoveRole = async (roleId: string) => {
    if (!selectedUser?.id) return

    try {
      await removeRoleFromUser(selectedUser.id, roleId)
      showToast({ message: "Role removed successfully", type: "success" })

      // Refresh user roles
      const updatedRoles = await getUserRoles(selectedUser.id)
      setSelectedUserRoles(updatedRoles)
      await refetchUsers()
    } catch (err) {
      handleApiError(err, "Failed to remove role")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      user.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    const userRoleNames = user.roles || []
    const matchesRole = filterRole === "all" || userRoleNames.includes(filterRole)
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "inactive":
        return "bg-gray-100 text-gray-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage users and role assignments</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Invite User
        </button>
      </div>

      {/* Error Message */}
      {usersError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{usersError}</p>
          <button onClick={() => refetchUsers()} className="mt-2 text-sm text-red-700 font-medium hover:text-red-900">
            Retry →
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search users by name, email, or tenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name || ""}>
                  {role.name}
                </option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usersLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4" colSpan={7}>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">{user.name?.charAt(0) || "U"}</div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{user.name || "Unknown"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">{user.tenant || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(user.roles || []).map((role) => (
                          <span key={role} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => setSelectedUser(user)}>
                            {role}
                          </span>
                        ))}
                        {(!user.roles || user.roles.length === 0) && <span className="text-xs text-gray-400">No roles</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(user.status || "inactive")}`}>{user.status || "inactive"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.lastActive || "Never"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => setSelectedUser(user)} className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-xl shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">{selectedUser.name?.charAt(0) || "U"}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedUser.name || "Unknown"}</h2>
                  <p className="text-sm text-gray-600">{selectedUser.email || "N/A"}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Basic Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">Tenant</label>
                    <div className="text-sm font-medium text-gray-900">{selectedUser.tenant || "N/A"}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedUser.status || "inactive")}`}>{selectedUser.status || "inactive"}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Last Active</label>
                    <div className="text-sm font-medium text-gray-900">{selectedUser.lastActive || "Never"}</div>
                  </div>
                </div>
              </div>

              {/* Assigned Roles */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Assigned Roles</h3>
                {isLoadingRoles ? (
                  <div className="text-sm text-gray-500">Loading roles...</div>
                ) : (
                  <div className="space-y-3">
                    {selectedUserRoles.length === 0 ? (
                      <div className="text-sm text-gray-500">No roles assigned</div>
                    ) : (
                      selectedUserRoles.map((role) => (
                        <div key={role.id} className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                          <span className="font-medium text-blue-900">{role.name}</span>
                          <button onClick={() => role.id && handleRemoveRole(role.id)} className="text-red-600 hover:text-red-700 text-sm">
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
                <div className="mt-3">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignRole(e.target.value)
                        e.target.value = ""
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Add role...</option>
                    {roles
                      .filter((role) => !selectedUserRoles.some((ur) => ur.id === role.id))
                      .map((role) => (
                        <option key={role.id} value={role.id || ""}>
                          {role.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Direct Permissions (Optional Override) */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Direct Permissions</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">No direct permissions assigned. User inherits all permissions from roles.</p>
                  <button className="mt-2 text-sm text-yellow-700 font-medium hover:text-yellow-900">Add Direct Permission Override →</button>
                </div>
              </div>

              {/* Activity Log */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <div className="text-gray-900">Logged in from 192.168.1.1</div>
                      <div className="text-gray-500 text-xs">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <div className="text-gray-900">Updated product "Summer Collection"</div>
                      <div className="text-gray-500 text-xs">1 hour ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <div className="text-gray-900">Created new user account</div>
                      <div className="text-gray-500 text-xs">3 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Changes</button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
