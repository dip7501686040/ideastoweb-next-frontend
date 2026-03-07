import { BaseModel } from "./BaseModel"

// Shape returned by / sent to the API
export type ProductApiType = {
  id: string
  name: string
  description: string
  price: number
  createdBy?: string | null
  updatedBy?: string | null
  createdAt?: string
  updatedAt?: string
}

export type CreateProductRequest = {
  name: string
  description: string
  price: number
}

export type UpdateProductRequest = {
  name?: string
  description?: string
  price?: number
}

export class Product extends BaseModel {
  public readonly name: string
  public readonly description: string
  public readonly price: number
  public readonly createdBy: string | null
  public readonly updatedBy: string | null

  constructor(props: { id: string; name: string; description: string; price: number; createdBy?: string | null; updatedBy?: string | null; createdAt?: string; updatedAt?: string }) {
    super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt })
    this.name = props.name
    this.description = props.description
    this.price = props.price
    this.createdBy = props.createdBy ?? null
    this.updatedBy = props.updatedBy ?? null
  }

  /** Display-formatted price, e.g. "$99.99" */
  getFormattedPrice(): string {
    return `$${this.price.toFixed(2)}`
  }

  static fromApi(data: ProductApiType): Product {
    return new Product({
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }
}
