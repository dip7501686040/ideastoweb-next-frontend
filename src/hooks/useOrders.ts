import { useState, useCallback } from "react"
import { orderApi } from "@/api/OrderApi"
import { Order } from "@/models/Order"
import { useFetchOnce } from "@/hooks/useFetchOnce"

interface UseOrdersOptions {
  /** If true, fetches all orders (admin). Otherwise fetches only the current user's orders. */
  adminMode?: boolean
}

interface UseOrdersResult {
  orders: Order[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useOrders({ adminMode = false }: UseOrdersOptions = {}): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = adminMode ? await orderApi.getAllOrders() : await orderApi.getMyOrders()
      setOrders(data)
    } catch (err: any) {
      setError(err.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }, [adminMode])

  useFetchOnce(fetchOrders)

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders
  }
}
