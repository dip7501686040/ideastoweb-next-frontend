import { useState, useEffect, useCallback } from "react"
import { rbacApi } from "@/api/RbacApi"
import { OperationApiType } from "@/models/Operation"

interface UseOperationsResult {
  operations: OperationApiType[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createOperation: (data: { key: string; description?: string }) => Promise<void>
  updateOperation: (id: string, data: { key?: string; description?: string }) => Promise<void>
  deleteOperation: (id: string) => Promise<void>
}

export function useOperations(tenantCode?: string): UseOperationsResult {
  const [operations, setOperations] = useState<OperationApiType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOperations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await rbacApi.getOperations(tenantCode)
      setOperations(data)
    } catch (err: any) {
      setError(err.message || "Failed to load operations")
      console.error("Error fetching operations:", err)
    } finally {
      setLoading(false)
    }
  }, [tenantCode])

  useEffect(() => {
    fetchOperations()
  }, [fetchOperations])

  const createOperation = useCallback(
    async (data: { key: string; description?: string }) => {
      try {
        setError(null)
        await rbacApi.createOperation(data, tenantCode)
        await fetchOperations()
      } catch (err: any) {
        setError(err.message || "Failed to create operation")
        throw err
      }
    },
    [tenantCode, fetchOperations]
  )

  const updateOperation = useCallback(
    async (id: string, data: { key?: string; description?: string }) => {
      try {
        setError(null)
        await rbacApi.updateOperation(id, data, tenantCode)
        await fetchOperations()
      } catch (err: any) {
        setError(err.message || "Failed to update operation")
        throw err
      }
    },
    [tenantCode, fetchOperations]
  )

  const deleteOperation = useCallback(
    async (id: string) => {
      try {
        setError(null)
        await rbacApi.deleteOperation(id, tenantCode)
        await fetchOperations()
      } catch (err: any) {
        setError(err.message || "Failed to delete operation")
        throw err
      }
    },
    [tenantCode, fetchOperations]
  )

  return {
    operations,
    loading,
    error,
    refetch: fetchOperations,
    createOperation,
    updateOperation,
    deleteOperation
  }
}
