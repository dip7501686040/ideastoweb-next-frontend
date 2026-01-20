import { BaseModel } from "./BaseModel"

export class Service extends BaseModel {
  public readonly code: string
  public readonly name: string
  public readonly description?: string
  public readonly dependencies?: string[]

  constructor(props: { id: string; code: string; name: string; description?: string; dependencies?: string[]; createdAt?: string; updatedAt?: string }) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })

    this.code = props.code
    this.name = props.name
    this.description = props.description
    this.dependencies = props.dependencies
  }
}

export type ApplyServiceRequest = {
  tenantCode: string
  serviceCode: string
}

export type ApplyServiceResponse = {
  message: string
  appliedServices: Array<{
    code: string
    name: string
  }>
}

export type EnabledService = {
  id?: string
  code: string
  name: string
  description?: string
  status?: string
  enabledAt: string
}
