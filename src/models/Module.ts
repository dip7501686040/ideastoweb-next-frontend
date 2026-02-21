import { BaseModel } from "./BaseModel"

export type ModuleApiType = {
  id: string | null
  key: string | null
  description: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export class Module extends BaseModel {
  public readonly key: string
  public readonly description: string

  constructor(props: { id: string; key: string; description: string; createdAt?: string; updatedAt?: string }) {
    super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt })
    this.key = props.key
    this.description = props.description
  }
}

export default Module
