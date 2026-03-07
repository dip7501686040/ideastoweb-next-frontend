import { useState, useCallback } from "react"
import { ProductImage, productImageApi } from "@/api/ProductImageApi"

interface UseProductImagesResult {
  images: ProductImage[]
  loading: boolean
  uploading: boolean
  error: string | null
  refetch: () => Promise<void>
  upload: (file: File) => Promise<void>
  remove: (imageId: string) => Promise<void>
  setPrimary: (imageId: string) => Promise<void>
}

export function useProductImages(productId: string): UseProductImagesResult {
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productImageApi.getProductImages(productId)
      setImages(data)
    } catch (err: any) {
      setError(err.message || "Failed to load images")
    } finally {
      setLoading(false)
    }
  }, [productId])

  const upload = useCallback(
    async (file: File) => {
      try {
        setUploading(true)
        setError(null)
        const created = await productImageApi.uploadProductImage(productId, file)
        setImages((prev) => [...prev, created])
      } catch (err: any) {
        setError(err.message || "Failed to upload image")
        throw err
      } finally {
        setUploading(false)
      }
    },
    [productId]
  )

  const remove = useCallback(async (imageId: string) => {
    try {
      setError(null)
      await productImageApi.deleteProductImage(imageId)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (err: any) {
      setError(err.message || "Failed to delete image")
      throw err
    }
  }, [])

  const setPrimary = useCallback(async (imageId: string) => {
    try {
      setError(null)
      await productImageApi.setPrimaryProductImage(imageId)
      // Mark the chosen image as primary and unmark all others
      setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === imageId })))
    } catch (err: any) {
      setError(err.message || "Failed to set primary image")
      throw err
    }
  }, [])

  return { images, loading, uploading, error, refetch, upload, remove, setPrimary }
}
