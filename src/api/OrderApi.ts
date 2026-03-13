import { BaseApi } from "./BaseApi"
import { Order, OrderApiType } from "@/models/Order"

/**
 * Order API client.
 * Orders are created automatically via the payment.completed RabbitMQ event.
 * These endpoints are read-only from the frontend perspective.
 * Base URL: http://localhost:8000
 */
export class OrderApi extends BaseApi {
  /** Get all orders for the currently authenticated user */
  async getMyOrders(): Promise<Order[]> {
    const response = await this.request<OrderApiType[]>("/orders/my", {
      method: "GET"
    })
    return response.map(Order.fromApi)
  }

  /** Admin: Get all orders across all users */
  async getAllOrders(): Promise<Order[]> {
    const response = await this.request<OrderApiType[]>("/orders", {
      method: "GET"
    })
    return response.map(Order.fromApi)
  }

  /** Get a single order by ID */
  async getOrderById(id: string): Promise<Order> {
    const response = await this.request<OrderApiType>(`/orders/${id}`, {
      method: "GET"
    })
    return Order.fromApi(response)
  }
}

export const orderApi = new OrderApi()
