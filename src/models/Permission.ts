import { BaseModel } from "./BaseModel"

export type PermissionApiType = {
  id: string | null
  moduleKey: string | null
  operationKey: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export class Permission extends BaseModel {
  public readonly moduleKey: string
  public readonly operationKey: string

  constructor(props: { id: string; moduleKey: string; operationKey: string; createdAt?: string; updatedAt?: string }) {
    super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt })
    this.moduleKey = props.moduleKey
    this.operationKey = props.operationKey
  }
}

export default Permission
