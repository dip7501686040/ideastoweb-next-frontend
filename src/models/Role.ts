import { BaseModel } from "./BaseModel"

export type RoleApiType = {
  id: string | null
  name: string | null
  description: string | null
  isSystem: boolean | null
  createdBy: string | null
  updatedBy: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export class Role extends BaseModel {
  public readonly name: string
  public readonly description: string
  public readonly isSystem: boolean

  constructor(props: { id: string; name: string; description?: string; isSystem?: boolean; createdAt?: string; updatedAt?: string }) {
    super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt })
    this.name = props.name
    this.description = props.description || ""
    this.isSystem = !!props.isSystem
  }
}

export default Role
