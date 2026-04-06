import { BaseModel } from "./BaseModel"

export type ServiceTypeApiType = {
  id: string
  name: string
  description?: string | null
  createdBy: string
  updatedBy: string
  createdAt?: string
  updatedAt?: string
}

export type CreateServiceTypeRequest = {
  name: string
  description?: string
}

export type UpdateServiceTypeRequest = {
  name?: string
  description?: string
}

export class ServiceType extends BaseModel {
  public readonly name: string
  public readonly description: string | null
  public readonly createdBy: string
  public readonly updatedBy: string

  constructor(props: { id: string; name: string; description?: string | null; createdBy: string; updatedBy: string; createdAt?: string | Date; updatedAt?: string | Date }) {
    super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt })
    this.name = props.name
    this.description = props.description ?? null
    this.createdBy = props.createdBy
    this.updatedBy = props.updatedBy
  }

  static fromApi(data: ServiceTypeApiType): ServiceType {
    return new ServiceType({
      id: data.id,
      name: data.name,
      description: data.description,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }
}
