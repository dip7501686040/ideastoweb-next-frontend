import { BaseModel } from "./BaseModel"

export type ServiceProviderApiType = {
  id: string
  name: string
  serviceTypeId: string
  description?: string | null
  createdBy: string
  updatedBy: string
  createdAt?: string
  updatedAt?: string
}

export type CreateServiceProviderRequest = {
  name: string
  serviceTypeId: string
  description?: string
}

export type UpdateServiceProviderRequest = {
  name?: string
  serviceTypeId?: string
  description?: string
}

export class ServiceProvider extends BaseModel {
  public readonly name: string
  public readonly serviceTypeId: string
  public readonly description: string | null
  public readonly createdBy: string
  public readonly updatedBy: string

  constructor(props: { id: string; name: string; serviceTypeId: string; description?: string | null; createdBy: string; updatedBy: string; createdAt?: string | Date; updatedAt?: string | Date }) {
    super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt })
    this.name = props.name
    this.serviceTypeId = props.serviceTypeId
    this.description = props.description ?? null
    this.createdBy = props.createdBy
    this.updatedBy = props.updatedBy
  }

  static fromApi(data: ServiceProviderApiType): ServiceProvider {
    return new ServiceProvider({
      id: data.id,
      name: data.name,
      serviceTypeId: data.serviceTypeId,
      description: data.description,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }
}
