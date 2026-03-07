import { BaseApi } from "./BaseApi"
import { TokenManager } from "@/lib/tokenManager"

// ── Types ────────────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string
  publicId: string
  isPrimary: boolean
  thumbnailUrl: string
  imageUrl: string
}

// ── API Class ─────────────────────────────────────────────────────────────────

/**
 * Product Image API client.
 * Extends BaseApi for JSON endpoints (GET / DELETE / PATCH).
 * File upload uses a dedicated multipart fetch so the browser can set the
 * correct Content-Type boundary — BaseApi.request always sets application/json.
 */
class ProductImageApi extends BaseApi {
  /**
   * Fetch all images for a product.
   */
  async getProductImages(productId: string): Promise<ProductImage[]> {
    return this.request<ProductImage[]>(`/products/${productId}/images`, {
      method: "GET"
    })
  }

  /**
   * Upload a new image for a product.
   * Sends multipart/form-data — Content-Type is intentionally omitted so the
   * browser attaches the correct multipart boundary automatically.
   */
  async uploadProductImage(productId: string, file: File): Promise<ProductImage> {
    const formData = new FormData()
    formData.append("file", file)

    const token = TokenManager.getAccessToken()
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

    const res = await fetch(`${this.baseUrl}/products/${productId}/images`, {
      method: "POST",
      headers, // no Content-Type — browser sets multipart boundary
      body: formData,
      credentials: "include"
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any).message || "Upload failed")
    return data as ProductImage
  }

  /**
   * Delete a product image by its ID.
   */
  async deleteProductImage(imageId: string): Promise<void> {
    await this.request<{ message?: string }>(`/product-images/${imageId}`, {
      method: "DELETE"
    })
  }

  /**
   * Set a product image as the primary image.
   */
  async setPrimaryProductImage(imageId: string): Promise<ProductImage> {
    return this.request<ProductImage>(`/product-images/${imageId}/primary`, {
      method: "PATCH"
    })
  }
}

export const productImageApi = new ProductImageApi()
