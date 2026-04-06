import { BaseModel } from "./BaseModel"

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED"

export type BookingApiType = {
  id: string
  serviceProviderId: string
  startTime: string
  endTime: string
  amount: number
  quantity: number
  status: BookingStatus
  notes?: string
  metadata?: Record<string, any>
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateBookingRequest = {
  serviceProviderId: string
  startTime: string
  endTime: string
  amount: number
  quantity: number
  notes?: string
  metadata?: Record<string, any>
}

export type UpdateBookingRequest = {
  startTime?: string
  endTime?: string
  notes?: string
  metadata?: Record<string, any>
}

export class Booking extends BaseModel {
  public readonly serviceProviderId: string
  public readonly startTime: Date
  public readonly endTime: Date
  public readonly amount: number
  public readonly quantity: number
  public readonly status: BookingStatus
  public readonly notes: string | null
  public readonly metadata: Record<string, any> | null
  public readonly userId: string | null

  constructor(props: {
    id: string
    serviceProviderId: string
    startTime: string | Date
    endTime: string | Date
    amount: number
    quantity: number
    status: BookingStatus
    notes?: string | null
    metadata?: Record<string, any> | null
    userId?: string | null
    createdAt?: string
    updatedAt?: string
  }) {
    super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt })
    this.serviceProviderId = props.serviceProviderId
    this.startTime = new Date(props.startTime)
    this.endTime = new Date(props.endTime)
    this.amount = props.amount
    this.quantity = props.quantity
    this.status = props.status
    this.notes = props.notes ?? null
    this.metadata = props.metadata ?? null
    this.userId = props.userId ?? null
  }

  getFormattedAmount(): string {
    return `$${this.amount.toFixed(2)}`
  }

  getStatusLabel(): string {
    return this.status.charAt(0) + this.status.slice(1).toLowerCase()
  }

  isConfirmed(): boolean {
    return this.status === "CONFIRMED"
  }

  isCancelled(): boolean {
    return this.status === "CANCELLED"
  }

  static fromApi(data: BookingApiType): Booking {
    return new Booking({
      id: data.id,
      serviceProviderId: data.serviceProviderId,
      startTime: data.startTime,
      endTime: data.endTime,
      amount: data.amount,
      quantity: data.quantity,
      status: data.status,
      notes: data.notes,
      metadata: data.metadata,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }
}
