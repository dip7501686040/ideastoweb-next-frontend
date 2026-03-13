import { BaseApi } from "./BaseApi"
import { Payment, PaymentApiType, CreatePaymentIntentRequest } from "@/models/Payment"

export type PaymentIntentResponse = {
  paymentId: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}

/**
 * Payment API client.
 * Integrates with Stripe via the backend.
 * Base URL: http://localhost:8000
 */
export class PaymentApi extends BaseApi {
  /** Create a Stripe PaymentIntent — returns clientSecret for frontend confirmation */
  async createIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    return this.request<PaymentIntentResponse>("/payment/intent", {
      method: "POST",
      body: data
    })
  }

  /** Get a payment record by ID */
  async getPaymentById(id: string): Promise<Payment> {
    const response = await this.request<PaymentApiType>(`/payment/${id}`, {
      method: "GET"
    })
    return Payment.fromApi(response)
  }

  /** Admin: Get all payments */
  async getAllPayments(): Promise<Payment[]> {
    const response = await this.request<PaymentApiType[]>("/payment", {
      method: "GET"
    })
    return response.map(Payment.fromApi)
  }
}

export const paymentApi = new PaymentApi()
