import { useState, useEffect, useCallback } from "react"
import { rbacApi } from "@/api/RbacApi"
import { RoleApiType } from "@/models/Role"

interface UseRolesResult {
  roles: RoleApiType[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createRole: (data: { name: string; description?: string; permissions?: Array<{ moduleKey: string; operationKey: string }> }) => Promise<void>
  updateRole: (id: string, data: { name?: string; description?: string }) => Promise<void>
  deleteRole: (id: string) => Promise<void>
  assignRoleToUser: (userId: string, roleId: string) => Promise<void>
  removeRoleFromUser: (userId: string, roleId: string) => Promise<void>
  getUserRoles: (userId: string) => Promise<RoleApiType[]>
}

export function useRoles(tenantCode?: string): UseRolesResult {
  const [roles, setRoles] = useState<RoleApiType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await rbacApi.getRoles(tenantCode)
      setRoles(data)
    } catch (err: any) {
      setError(err.message || "Failed to load roles")
      console.error("Error fetching roles:", err)
    } finally {
      setLoading(false)
    }
  }, [tenantCode])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const createRole = useCallback(
    async (data: { name: string; description?: string; permissions?: Array<{ moduleKey: string; operationKey: string }> }) => {
      try {
        setError(null)
        await rbacApi.createRole(data, tenantCode)
        await fetchRoles()
      } catch (err: any) {
        setError(err.message || "Failed to create role")
        throw err
      }
    },
    [tenantCode, fetchRoles]
  )

  const updateRole = useCallback(
    async (id: string, data: { name?: string; description?: string }) => {
      try {
        setError(null)
        await rbacApi.updateRole(id, data, tenantCode)
        await fetchRoles()
      } catch (err: any) {
        setError(err.message || "Failed to update role")
        throw err
      }
    },
    [tenantCode, fetchRoles]
  )

  const deleteRole = useCallback(
    async (id: string) => {
      try {
        setError(null)
        await rbacApi.deleteRole(id, tenantCode)
        await fetchRoles()
      } catch (err: any) {
        setError(err.message || "Failed to delete role")
        throw err
      }
    },
    [tenantCode, fetchRoles]
  )

  const assignRoleToUser = useCallback(
    async (userId: string, roleId: string) => {
      try {
        setError(null)
        await rbacApi.assignRoleToUser(userId, roleId, tenantCode)
      } catch (err: any) {
        setError(err.message || "Failed to assign role")
        throw err
      }
    },
    [tenantCode]
  )

  const removeRoleFromUser = useCallback(
    async (userId: string, roleId: string) => {
      try {
        setError(null)
        await rbacApi.removeRoleFromUser(userId, roleId, tenantCode)
      } catch (err: any) {
        setError(err.message || "Failed to remove role")
        throw err
      }
    },
    [tenantCode]
  )

  const getUserRoles = useCallback(
    async (userId: string) => {
      try {
        setError(null)
        return await rbacApi.getUserRoles(userId, tenantCode)
      } catch (err: any) {
        setError(err.message || "Failed to get user roles")
        throw err
      }
    },
    [tenantCode]
  )

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    assignRoleToUser,
    removeRoleFromUser,
    getUserRoles
  }
}
