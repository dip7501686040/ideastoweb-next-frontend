import { useState, useEffect, useCallback } from "react"
import { rbacApi } from "@/api/RbacApi"
import { PermissionApiType } from "@/models/Permission"
import { ModuleApiType } from "@/models/Module"
import { OperationApiType } from "@/models/Operation"

interface UsePermissionsMatrixResult {
  modules: ModuleApiType[]
  operations: OperationApiType[]
  permissions: PermissionApiType[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  hasPermission: (moduleKey: string, operationKey: string) => boolean
  togglePermission: (roleId: string, moduleKey: string, operationKey: string) => Promise<void>
  assignPermissionsBulk: (roleId: string, permissions: Array<{ moduleKey: string; operationKey: string }>) => Promise<void>
}

export function usePermissionsMatrix(roleId?: string, tenantCode?: string): UsePermissionsMatrixResult {
  const [modules, setModules] = useState<ModuleApiType[]>([])
  const [operations, setOperations] = useState<OperationApiType[]>([])
  const [permissions, setPermissions] = useState<PermissionApiType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [modulesData, operationsData, permissionsData] = await Promise.all([rbacApi.getModules(tenantCode), rbacApi.getOperations(tenantCode), rbacApi.getPermissions(tenantCode)])

      setModules(modulesData)
      setOperations(operationsData)
      setPermissions(permissionsData)
    } catch (err: any) {
      setError(err.message || "Failed to load permissions matrix")
      console.error("Error fetching permissions matrix:", err)
    } finally {
      setLoading(false)
    }
  }, [tenantCode])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const hasPermission = useCallback(
    (moduleKey: string, operationKey: string) => {
      return permissions.some((p) => p.moduleKey === moduleKey && p.operationKey === operationKey)
    },
    [permissions]
  )

  const togglePermission = useCallback(
    async (roleId: string, moduleKey: string, operationKey: string) => {
      try {
        setError(null)
        const exists = hasPermission(moduleKey, operationKey)

        if (exists) {
          // Remove permission
          const permission = permissions.find((p) => p.moduleKey === moduleKey && p.operationKey === operationKey)
          if (permission?.id) {
            await rbacApi.removePermissionFromRole(roleId, permission.id, tenantCode)
          }
        } else {
          // Add permission
          await rbacApi.assignPermissionToRole(roleId, { moduleKey, operationKey }, tenantCode)
        }

        await fetchData()
      } catch (err: any) {
        setError(err.message || "Failed to toggle permission")
        throw err
      }
    },
    [hasPermission, permissions, tenantCode, fetchData]
  )

  const assignPermissionsBulk = useCallback(
    async (roleId: string, permissionsToAssign: Array<{ moduleKey: string; operationKey: string }>) => {
      try {
        setError(null)
        await rbacApi.assignPermissionsBulk(roleId, { permissions: permissionsToAssign }, tenantCode)
        await fetchData()
      } catch (err: any) {
        setError(err.message || "Failed to assign permissions")
        throw err
      }
    },
    [tenantCode, fetchData]
  )

  return {
    modules,
    operations,
    permissions,
    loading,
    error,
    refetch: fetchData,
    hasPermission,
    togglePermission,
    assignPermissionsBulk
  }
}
