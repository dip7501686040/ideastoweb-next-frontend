import { useState, useCallback } from "react"
import { bookingApi } from "@/api/BookingApi"
import { ServiceType, CreateServiceTypeRequest, UpdateServiceTypeRequest } from "@/models/ServiceType"
import { useFetchOnce } from "@/hooks/useFetchOnce"

interface UseServiceTypesResult {
  serviceTypes: ServiceType[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createServiceType: (data: CreateServiceTypeRequest) => Promise<ServiceType>
  updateServiceType: (id: string, data: UpdateServiceTypeRequest) => Promise<ServiceType>
  deleteServiceType: (id: string) => Promise<void>
}

export function useServiceTypes(): UseServiceTypesResult {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServiceTypes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bookingApi.getServiceTypes()
      setServiceTypes(data)
    } catch (err: any) {
      setError(err.message || "Failed to load service types")
    } finally {
      setLoading(false)
    }
  }, [])

  useFetchOnce(fetchServiceTypes)

  const createServiceType = useCallback(async (data: CreateServiceTypeRequest): Promise<ServiceType> => {
    const created = await bookingApi.createServiceType(data)
    setServiceTypes((prev) => [created, ...prev])
    return created
  }, [])

  const updateServiceType = useCallback(async (id: string, data: UpdateServiceTypeRequest): Promise<ServiceType> => {
    const updated = await bookingApi.updateServiceType(id, data)
    setServiceTypes((prev) => prev.map((st) => (st.id === id ? updated : st)))
    return updated
  }, [])

  const deleteServiceType = useCallback(async (id: string): Promise<void> => {
    await bookingApi.deleteServiceType(id)
    setServiceTypes((prev) => prev.filter((st) => st.id !== id))
  }, [])

  return { serviceTypes, loading, error, refetch: fetchServiceTypes, createServiceType, updateServiceType, deleteServiceType }
}
