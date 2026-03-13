import { BaseModel } from "./BaseModel"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"

export type PaymentApiType = {
  id: string
  userId: string
  amount: number
  currency: string
  status: PaymentStatus
  referenceId: string
  providerPaymentId?: string
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export type CreatePaymentIntentRequest = {
  amount: number
  currency: string
  userId: string
  referenceId: string
  metadata?: Record<string, any>
}

export class Payment extends BaseModel {
  public readonly userId: string
  public readonly amount: number
  public readonly currency: string
  public readonly status: PaymentStatus
  public readonly referenceId: string
  public readonly providerPaymentId: string | null
  public readonly metadata: Record<string, any> | null

  constructor(props: {
    id: string
    userId: string
    amount: number
    currency: string
    status: PaymentStatus
    referenceId: string
    providerPaymentId?: string | null
    metadata?: Record<string, any> | null
    createdAt?: string
    updatedAt?: string
  }) {
    super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt })
    this.userId = props.userId
    this.amount = props.amount
    this.currency = props.currency
    this.status = props.status
    this.referenceId = props.referenceId
    this.providerPaymentId = props.providerPaymentId ?? null
    this.metadata = props.metadata ?? null
  }

  /** Amount is stored in smallest currency unit (cents). Returns formatted display amount. */
  getFormattedAmount(): string {
    return `${this.currency.toUpperCase()} ${(this.amount / 100).toFixed(2)}`
  }

  getStatusLabel(): string {
    return this.status.charAt(0) + this.status.slice(1).toLowerCase()
  }

  isCompleted(): boolean {
    return this.status === "COMPLETED"
  }

  static fromApi(data: PaymentApiType): Payment {
    return new Payment({
      id: data.id,
      userId: data.userId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      referenceId: data.referenceId,
      providerPaymentId: data.providerPaymentId,
      metadata: data.metadata,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }
}
