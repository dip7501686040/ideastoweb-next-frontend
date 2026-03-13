import { useState, useCallback } from "react"
import { cartApi } from "@/api/CartApi"
import { Cart, CartItem, AddCartItemRequest, UpdateCartItemRequest } from "@/models/Cart"
import { useFetchOnce } from "@/hooks/useFetchOnce"

interface UseCartResult {
  cart: Cart | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  addItem: (data: AddCartItemRequest) => Promise<CartItem>
  updateItem: (itemId: string, data: UpdateCartItemRequest) => Promise<CartItem>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

export function useCart(): UseCartResult {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cartApi.getMyCart()
      setCart(data)
    } catch (err: any) {
      setError(err.message || "Failed to load cart")
    } finally {
      setLoading(false)
    }
  }, [])

  useFetchOnce(fetchCart)

  const addItem = useCallback(
    async (data: AddCartItemRequest): Promise<CartItem> => {
      const newItem = await cartApi.addItem(data)
      await fetchCart() // re-fetch to get the latest cart state
      return newItem
    },
    [fetchCart]
  )

  const updateItem = useCallback(async (itemId: string, data: UpdateCartItemRequest): Promise<CartItem> => {
    const updated = await cartApi.updateItem(itemId, data)
    setCart((prev) => {
      if (!prev) return prev
      const updatedItems = prev.items.map((item) =>
        item.id === itemId
          ? CartItem.fromApi({
              id: updated.id ?? item.id,
              cartId: updated.cartId || item.cartId,
              itemType: updated.itemType ?? item.itemType,
              itemId: updated.itemId ?? item.itemId,
              quantity: updated.quantity ?? item.quantity,
              price: updated.price ?? item.price,
              metadata: updated.metadata ?? item.metadata ?? undefined,
              name: updated.name ?? item.name ?? undefined
            })
          : item
      )
      return Cart.fromApi({
        id: prev.id,
        userId: prev.userId,
        status: prev.status,
        items: updatedItems.map((i) => ({ id: i.id, cartId: i.cartId, itemType: i.itemType, itemId: i.itemId, quantity: i.quantity, price: i.price, metadata: i.metadata ?? undefined, name: i.name ?? undefined }))
      })
    })
    return updated
  }, [])

  const removeItem = useCallback(async (itemId: string): Promise<void> => {
    await cartApi.removeItem(itemId)
    setCart((prev) => {
      if (!prev) return prev
      const remainingItems = prev.items.filter((i) => i.id !== itemId)
      return Cart.fromApi({
        id: prev.id,
        userId: prev.userId,
        status: prev.status,
        items: remainingItems.map((i) => ({ id: i.id, cartId: i.cartId, itemType: i.itemType, itemId: i.itemId, quantity: i.quantity, price: i.price, metadata: i.metadata ?? undefined, name: i.name ?? undefined }))
      })
    })
  }, [])

  const clearCart = useCallback(async (): Promise<void> => {
    await cartApi.clearCart()
    setCart((prev) => {
      if (!prev) return prev
      return Cart.fromApi({ id: prev.id, userId: prev.userId, status: prev.status, items: [] })
    })
  }, [])

  return {
    cart,
    loading,
    error,
    refetch: fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart
  }
}
