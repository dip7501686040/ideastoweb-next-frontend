export abstract class BaseModel {
  public readonly id: string
  public readonly createdAt?: Date
  public readonly updatedAt?: Date

  constructor(props: { id: string; createdAt?: string | Date; updatedAt?: string | Date }) {
    this.id = props.id
    this.createdAt = props.createdAt ? new Date(props.createdAt) : undefined
    this.updatedAt = props.updatedAt ? new Date(props.updatedAt) : undefined
  }

  isPersisted(): boolean {
    return !!this.id
  }

  equals(model?: BaseModel): boolean {
    if (!model) return false
    return this.id === model.id
  }
}
