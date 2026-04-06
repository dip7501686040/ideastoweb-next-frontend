import { BaseApi } from "./BaseApi"

export type CheckoutRequest = {
  cartId: string
  referenceType: string
  shippingAddress: string
  phone: string
  currency: string
}

export type CheckoutResponse = {
  clientSecret: string
  paymentId: string
  amount: number
  currency: string
}

export type PayNowRequest = {
  itemType: string
  itemId: string
  amount: number
  quantity?: number
  referenceType: string
  phone: string
  shippingAddress?: string
  currency?: string
  description?: string
  metadata?: Record<string, any>
}

export type PayNowResponse = {
  paymentId: string
  clientSecret: string
  amount: number
  currency: string
  itemType: string
  itemId: string
  referenceType: string
  phone: string
}

/**
 * Checkout API client.
 * Initiates the checkout process — returns a Stripe clientSecret.
 * Base URL: http://localhost:8000
 */
export class CheckoutApi extends BaseApi {
  /** Create a checkout session from the active cart. Returns Stripe clientSecret. */
  async checkout(data: CheckoutRequest): Promise<CheckoutResponse> {
    return this.request<CheckoutResponse>("/checkout", {
      method: "POST",
      body: data
    })
  }

  /** Direct pay-now without a cart. Returns Stripe clientSecret. */
  async payNow(data: PayNowRequest): Promise<PayNowResponse> {
    return this.request<PayNowResponse>("/checkout/pay-now", {
      method: "POST",
      body: data
    })
  }
}

export const checkoutApi = new CheckoutApi()
