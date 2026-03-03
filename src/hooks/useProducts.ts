import { useState, useCallback } from "react"
import { productApi } from "@/api/ProductApi"
import { Product, CreateProductRequest, UpdateProductRequest } from "@/models/Product"
import { useFetchOnce } from "@/hooks/useFetchOnce"

interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createProduct: (data: CreateProductRequest) => Promise<Product>
  updateProduct: (id: string, data: UpdateProductRequest) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productApi.getProducts()
      setProducts(data)
    } catch (err: any) {
      setError(err.message || "Failed to load products")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useFetchOnce(fetchProducts)

  const createProduct = useCallback(async (data: CreateProductRequest): Promise<Product> => {
    const created = await productApi.createProduct(data)
    setProducts((prev) => [created, ...prev])
    return created
  }, [])

  const updateProduct = useCallback(async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const updated = await productApi.updateProduct(id, data)
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
    return updated
  }, [])

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    await productApi.deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
