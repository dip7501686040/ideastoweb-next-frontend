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
}

export const checkoutApi = new CheckoutApi()
