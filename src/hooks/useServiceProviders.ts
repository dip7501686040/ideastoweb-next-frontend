import { useState, useCallback } from "react"
import { bookingApi } from "@/api/BookingApi"
import { ServiceProvider, CreateServiceProviderRequest, UpdateServiceProviderRequest } from "@/models/ServiceProvider"
import { useFetchOnce } from "@/hooks/useFetchOnce"

interface UseServiceProvidersResult {
  serviceProviders: ServiceProvider[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createServiceProvider: (data: CreateServiceProviderRequest) => Promise<ServiceProvider>
  updateServiceProvider: (id: string, data: UpdateServiceProviderRequest) => Promise<ServiceProvider>
  deleteServiceProvider: (id: string) => Promise<void>
}

export function useServiceProviders(): UseServiceProvidersResult {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServiceProviders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bookingApi.getServiceProviders()
      setServiceProviders(data)
    } catch (err: any) {
      setError(err.message || "Failed to load service providers")
    } finally {
      setLoading(false)
    }
  }, [])

  useFetchOnce(fetchServiceProviders)

  const createServiceProvider = useCallback(async (data: CreateServiceProviderRequest): Promise<ServiceProvider> => {
    const created = await bookingApi.createServiceProvider(data)
    setServiceProviders((prev) => [created, ...prev])
    return created
  }, [])

  const updateServiceProvider = useCallback(async (id: string, data: UpdateServiceProviderRequest): Promise<ServiceProvider> => {
    const updated = await bookingApi.updateServiceProvider(id, data)
    setServiceProviders((prev) => prev.map((sp) => (sp.id === id ? updated : sp)))
    return updated
  }, [])

  const deleteServiceProvider = useCallback(async (id: string): Promise<void> => {
    await bookingApi.deleteServiceProvider(id)
    setServiceProviders((prev) => prev.filter((sp) => sp.id !== id))
  }, [])

  return { serviceProviders, loading, error, refetch: fetchServiceProviders, createServiceProvider, updateServiceProvider, deleteServiceProvider }
}
