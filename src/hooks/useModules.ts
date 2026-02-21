import { useState, useEffect, useCallback } from "react"
import { rbacApi } from "@/api/RbacApi"
import { ModuleApiType } from "@/models/Module"

interface UseModulesResult {
  modules: ModuleApiType[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createModule: (data: { key: string; description?: string }) => Promise<void>
  updateModule: (id: string, data: { key?: string; description?: string }) => Promise<void>
  deleteModule: (id: string) => Promise<void>
}

export function useModules(tenantCode?: string): UseModulesResult {
  const [modules, setModules] = useState<ModuleApiType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await rbacApi.getModules(tenantCode)
      setModules(data)
    } catch (err: any) {
      setError(err.message || "Failed to load modules")
      console.error("Error fetching modules:", err)
    } finally {
      setLoading(false)
    }
  }, [tenantCode])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  const createModule = useCallback(
    async (data: { key: string; description?: string }) => {
      try {
        setError(null)
        await rbacApi.createModule(data, tenantCode)
        await fetchModules()
      } catch (err: any) {
        setError(err.message || "Failed to create module")
        throw err
      }
    },
    [tenantCode, fetchModules]
  )

  const updateModule = useCallback(
    async (id: string, data: { key?: string; description?: string }) => {
      try {
        setError(null)
        await rbacApi.updateModule(id, data, tenantCode)
        await fetchModules()
      } catch (err: any) {
        setError(err.message || "Failed to update module")
        throw err
      }
    },
    [tenantCode, fetchModules]
  )

  const deleteModule = useCallback(
    async (id: string) => {
      try {
        setError(null)
        await rbacApi.deleteModule(id, tenantCode)
        await fetchModules()
      } catch (err: any) {
        setError(err.message || "Failed to delete module")
        throw err
      }
    },
    [tenantCode, fetchModules]
  )

  return {
    modules,
    loading,
    error,
    refetch: fetchModules,
    createModule,
    updateModule,
    deleteModule
  }
}
