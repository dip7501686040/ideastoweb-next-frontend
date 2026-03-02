import { useState, useCallback } from "react"
import { serviceApi } from "@/api/ServiceApi"
import { useFetchOnce } from "@/hooks/useFetchOnce"
import { useRoot } from "@/providers/TenantProvider"

interface UseEnabledServicesResult {
  hasService: (code: string) => boolean
  loading: boolean
  isMasterAdmin: boolean
  isTenantAdmin: boolean
}

/**
 * Returns a `hasService(code)` helper scoped to the current admin context.
 * - Master admin → always returns true (no fetch, no restrictions)
 * - Tenant admin → fetches enabled services once and checks against them
 */
export function useEnabledServices(): UseEnabledServicesResult {
  const { adminConfig } = useRoot()
  const { isMasterAdmin, isTenantAdmin, tenantCode } = adminConfig

  const [serviceCodes, setServiceCodes] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const fetchServices = useCallback(async () => {
    if (!tenantCode) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const services = await serviceApi.getEnabledServices(tenantCode)
      setServiceCodes(new Set(services.map((s) => s.code)))
    } catch {
      setServiceCodes(new Set())
    } finally {
      setLoading(false)
    }
  }, [tenantCode])

  useFetchOnce(fetchServices, isTenantAdmin && !!tenantCode)

  const hasService = useCallback((code: string): boolean => isMasterAdmin || serviceCodes.has(code), [isMasterAdmin, serviceCodes])

  return {
    hasService,
    loading: isTenantAdmin ? loading : false,
    isMasterAdmin,
    isTenantAdmin
  }
}
