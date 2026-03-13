import { BaseModel } from "./BaseModel"

export type OrderStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "FAILED"

export type OrderItemApiType = {
  id: string
  itemType: string
  itemId: string
  quantity: number
  price: number
  metadata?: Record<string, any>
}

export type OrderApiType = {
  id: string
  userId: string
  paymentId: string
  total: number
  currency: string
  status: OrderStatus
  items: OrderItemApiType[]
  metadata?: {
    referenceId?: string
    providerPaymentId?: string
    [key: string]: any
  }
  createdAt?: string
  updatedAt?: string
}

export class OrderItem {
  public readonly id: string
  public readonly itemType: string
  public readonly itemId: string
  public readonly quantity: number
  public readonly price: number
  public readonly metadata: Record<string, any> | null

  constructor(props: { id: string; itemType: string; itemId: string; quantity: number; price: number; metadata?: Record<string, any> }) {
    this.id = props.id
    this.itemType = props.itemType
    this.itemId = props.itemId
    this.quantity = props.quantity
    this.price = props.price
    this.metadata = props.metadata ?? null
  }

  getSubtotal(): number {
    return this.price * this.quantity
  }

  static fromApi(data: OrderItemApiType): OrderItem {
    return new OrderItem(data)
  }
}

export class Order extends BaseModel {
  public readonly userId: string
  public readonly paymentId: string
  public readonly total: number
  public readonly currency: string
  public readonly status: OrderStatus
  public readonly items: OrderItem[]
  public readonly metadata: Record<string, any> | null

  constructor(props: {
    id: string
    userId: string
    paymentId: string
    total: number
    currency: string
    status: OrderStatus
    items: OrderItemApiType[]
    metadata?: Record<string, any> | null
    createdAt?: string
    updatedAt?: string
  }) {
    super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt })
    this.userId = props.userId
    this.paymentId = props.paymentId
    this.total = props.total
    this.currency = props.currency
    this.status = props.status
    this.items = (props.items || []).map(OrderItem.fromApi)
    this.metadata = props.metadata ?? null
  }

  getFormattedTotal(): string {
    return `${this.currency.toUpperCase()} ${this.total.toFixed(2)}`
  }

  getStatusLabel(): string {
    return this.status.charAt(0) + this.status.slice(1).toLowerCase()
  }

  static fromApi(data: OrderApiType): Order {
    return new Order({
      id: data.id,
      userId: data.userId,
      paymentId: data.paymentId,
      total: data.total,
      currency: data.currency,
      status: data.status,
      items: data.items,
      metadata: data.metadata,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }
}
