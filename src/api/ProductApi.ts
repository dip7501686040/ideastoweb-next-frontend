import { BaseApi } from "./BaseApi"
import { Product, ProductApiType, CreateProductRequest, UpdateProductRequest } from "@/models/Product"

/**
 * Product API client.
 * All requests are authenticated via the JWT in the Authorization header.
 * Products are tenant-scoped — the backend resolves the tenant DB from the JWT.
 * Base URL: http://localhost:8000
 */
export class ProductApi extends BaseApi {
  /**
   * Get all products for the current tenant
   */
  async getProducts(): Promise<Product[]> {
    const response = await this.request<ProductApiType[]>("/products", {
      method: "GET"
    })
    return response.map(Product.fromApi)
  }

  /**
   * Get a single product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const response = await this.request<ProductApiType>(`/products/${id}`, {
      method: "GET"
    })
    return Product.fromApi(response)
  }

  /**
   * Create a new product
   * @param data - Product name and price
   */
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await this.request<ProductApiType>("/products", {
      method: "POST",
      body: data
    })
    return Product.fromApi(response)
  }

  /**
   * Update an existing product
   * @param id   - Product ID
   * @param data - Fields to update (name and/or price)
   */
  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
    const response = await this.request<ProductApiType>(`/products/${id}`, {
      method: "PUT",
      body: data
    })
    return Product.fromApi(response)
  }

  /**
   * Delete a product
   * @param id - Product ID
   */
  async deleteProduct(id: string): Promise<{ message?: string }> {
    return this.request<{ message?: string }>(`/products/${id}`, {
      method: "DELETE"
    })
  }
}

export const productApi = new ProductApi()
