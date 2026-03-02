import { useState, useCallback } from "react"
import { rbacApi } from "@/api/RbacApi"
import { RoleApiType, UserRoleType } from "@/models/Role"
import { useFetchOnce } from "@/hooks/useFetchOnce"

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
  getUserRoles: (userId: string) => Promise<UserRoleType[]>
}

export function useRoles(): UseRolesResult {
  const [roles, setRoles] = useState<RoleApiType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await rbacApi.getRoles()
      setRoles(data)
    } catch (err: any) {
      setError(err.message || "Failed to load roles")
      console.error("Error fetching roles:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useFetchOnce(fetchRoles)

  const createRole = useCallback(
    async (data: { name: string; description?: string; permissions?: Array<{ moduleKey: string; operationKey: string }> }) => {
      try {
        setError(null)
        await rbacApi.createRole(data)
        await fetchRoles()
      } catch (err: any) {
        setError(err.message || "Failed to create role")
        throw err
      }
    },
    [fetchRoles]
  )

  const updateRole = useCallback(
    async (id: string, data: { name?: string; description?: string }) => {
      try {
        setError(null)
        await rbacApi.updateRole(id, data)
        await fetchRoles()
      } catch (err: any) {
        setError(err.message || "Failed to update role")
        throw err
      }
    },
    [fetchRoles]
  )

  const deleteRole = useCallback(
    async (id: string) => {
      try {
        setError(null)
        await rbacApi.deleteRole(id)
        await fetchRoles()
      } catch (err: any) {
        setError(err.message || "Failed to delete role")
        throw err
      }
    },
    [fetchRoles]
  )

  const assignRoleToUser = useCallback(async (userId: string, roleId: string) => {
    try {
      setError(null)
      await rbacApi.assignRoleToUser(userId, roleId)
    } catch (err: any) {
      setError(err.message || "Failed to assign role")
      throw err
    }
  }, [])

  const removeRoleFromUser = useCallback(async (userId: string, roleId: string) => {
    try {
      setError(null)
      await rbacApi.removeRoleFromUser(userId, roleId)
    } catch (err: any) {
      setError(err.message || "Failed to remove role")
      throw err
    }
  }, [])

  const getUserRoles = useCallback(async (userId: string) => {
    try {
      setError(null)
      return await rbacApi.getUserRoles(userId)
    } catch (err: any) {
      setError(err.message || "Failed to get user roles")
      throw err
    }
  }, [])

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
