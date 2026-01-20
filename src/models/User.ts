import { BaseModel } from "./BaseModel"

export type UserRole = "OWNER" | "ADMIN"

export class User extends BaseModel {
  public readonly email: string
  public readonly name: string
  public readonly role: UserRole

  constructor(props: { id: string; email: string; name: string; role: UserRole; createdAt?: string; updatedAt?: string }) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })

    this.email = props.email
    this.name = props.name
    this.role = props.role
  }

  isOwner(): boolean {
    return this.role === "OWNER"
  }

  isAdmin(): boolean {
    return this.role === "ADMIN"
  }
}
