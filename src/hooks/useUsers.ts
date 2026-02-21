import { useState, useEffect, useCallback } from "react"
import { userApi } from "@/api/UserApi"
import { ApiUser } from "@/models/User"

interface UseUsersResult {
  users: ApiUser[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createUser: (data: Partial<ApiUser>) => Promise<void>
  updateUser: (id: string, data: Partial<ApiUser>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
}

export function useUsers(tenantCode?: string): UseUsersResult {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userApi.getAll(tenantCode)
      setUsers(data)
    } catch (err: any) {
      setError(err.message || "Failed to load users")
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }, [tenantCode])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const createUser = useCallback(
    async (data: Partial<ApiUser>) => {
      try {
        setError(null)
        await userApi.create(data, tenantCode)
        await fetchUsers()
      } catch (err: any) {
        setError(err.message || "Failed to create user")
        throw err
      }
    },
    [tenantCode, fetchUsers]
  )

  const updateUser = useCallback(
    async (id: string, data: Partial<ApiUser>) => {
      try {
        setError(null)
        await userApi.update(id, data, tenantCode)
        await fetchUsers()
      } catch (err: any) {
        setError(err.message || "Failed to update user")
        throw err
      }
    },
    [tenantCode, fetchUsers]
  )

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        setError(null)
        await userApi.delete(id, tenantCode)
        await fetchUsers()
      } catch (err: any) {
        setError(err.message || "Failed to delete user")
        throw err
      }
    },
    [tenantCode, fetchUsers]
  )

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
}
