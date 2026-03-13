import { BaseApi } from "./BaseApi"
import { Cart, CartApiType, CartItem, CartItemApiType, AddCartItemRequest, UpdateCartItemRequest } from "@/models/Cart"

/**
 * Cart API client.
 * Cart is automatically scoped to the authenticated user via JWT.
 * Base URL: http://localhost:8000
 */
export class CartApi extends BaseApi {
  /** Get (or create) the authenticated user's active cart */
  async getMyCart(): Promise<Cart> {
    const response = await this.request<CartApiType>("/cart", {
      method: "GET"
    })
    return Cart.fromApi(response)
  }

  /** Add an item to the active cart */
  async addItem(data: AddCartItemRequest): Promise<CartItem> {
    const response = await this.request<CartItemApiType>("/cart/items", {
      method: "POST",
      body: data
    })
    return CartItem.fromApi(response)
  }

  /** Update quantity/price/metadata of an existing cart item */
  async updateItem(itemId: string, data: UpdateCartItemRequest): Promise<CartItem> {
    const response = await this.request<CartItemApiType>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: data
    })
    return CartItem.fromApi(response)
  }

  /** Remove a single item from the cart */
  async removeItem(itemId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/cart/items/${itemId}`, {
      method: "DELETE"
    })
  }

  /** Remove all items from the active cart */
  async clearCart(): Promise<{ message: string }> {
    return this.request<{ message: string }>("/cart", {
      method: "DELETE"
    })
  }
}

export const cartApi = new CartApi()
