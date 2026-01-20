import { BaseModel } from "./BaseModel"

export class Tenant extends BaseModel {
  public readonly tenantCode: string
  public readonly name: string
  public readonly dbName: string
  public readonly apiKey?: string // Only present in registration response

  constructor(props: { id: string; tenantCode: string; name: string; dbName: string; apiKey?: string; createdAt?: string; updatedAt?: string }) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })

    this.tenantCode = props.tenantCode
    this.name = props.name
    this.dbName = props.dbName
    this.apiKey = props.apiKey
  }
}

export type TenantRegistrationRequest = {
  tenantCode: string
  name: string
}

export type TenantRegistrationResponse = {
  tenantId: string
  tenantCode: string
  apiKey: string
}

export type RegenerateApiKeyResponse = {
  tenantId: string
  tenantCode: string
  apiKey: string
}
