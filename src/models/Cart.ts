export type CartItemType = "product" | "booking"

export type CartItemApiType = {
  id: string
  cartId: string
  itemType: CartItemType
  itemId: string
  quantity: number
  price: number
  metadata?: Record<string, any>
  name?: string
}

export type CartApiType = {
  id: string
  userId: string
  status: string
  items: CartItemApiType[]
  createdAt?: string
}

export type AddCartItemRequest = {
  itemType: CartItemType
  itemId: string
  quantity: number
  price: number
  metadata?: Record<string, any>
}

export type UpdateCartItemRequest = {
  quantity?: number
  price?: number
  metadata?: Record<string, any>
}

export class CartItem {
  public readonly id: string
  public readonly cartId: string
  public readonly itemType: CartItemType
  public readonly itemId: string
  public readonly quantity: number
  public readonly price: number
  public readonly metadata: Record<string, any> | null
  public readonly name: string | null

  constructor(props: { id: string; cartId: string; itemType: CartItemType; itemId: string; quantity: number; price: number; metadata?: Record<string, any>; name?: string }) {
    this.id = props.id
    this.cartId = props.cartId
    this.itemType = props.itemType
    this.itemId = props.itemId
    this.quantity = props.quantity
    this.price = props.price
    this.metadata = props.metadata ?? null
    this.name = props.name ?? null
  }

  getSubtotal(): number {
    return this.price * this.quantity
  }

  static fromApi(data: CartItemApiType): CartItem {
    return new CartItem({
      id: data.id,
      cartId: data.cartId,
      itemType: data.itemType,
      itemId: data.itemId,
      quantity: data.quantity,
      price: data.price,
      metadata: data.metadata,
      name: data.name
    })
  }
}

export class Cart {
  public readonly id: string
  public readonly userId: string
  public readonly status: string
  public readonly items: CartItem[]
  public readonly createdAt: Date | undefined

  constructor(props: { id: string; userId: string; status: string; items: CartItem[]; createdAt?: string }) {
    this.id = props.id
    this.userId = props.userId
    this.status = props.status
    this.items = props.items
    this.createdAt = props.createdAt ? new Date(props.createdAt) : undefined
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.getSubtotal(), 0)
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  static fromApi(data: CartApiType): Cart {
    return new Cart({
      id: data.id,
      userId: data.userId,
      status: data.status,
      items: (data.items || []).map(CartItem.fromApi),
      createdAt: data.createdAt
    })
  }
}
