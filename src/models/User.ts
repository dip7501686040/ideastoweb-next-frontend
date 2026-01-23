import { BaseModel } from "./BaseModel"

export type UserRole = "OWNER" | "ADMIN" | "USER" | "VIEWER"

export class User extends BaseModel {
  public readonly email: string
  public readonly name: string
  public readonly firstName?: string
  public readonly lastName?: string
  public readonly role: UserRole

  constructor(props: { id: string; email: string; name: string; firstName?: string; lastName?: string; role: UserRole; createdAt?: string; updatedAt?: string }) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })

    this.email = props.email
    this.name = props.name
    this.firstName = props.firstName
    this.lastName = props.lastName
    this.role = props.role
  }

  isOwner(): boolean {
    return this.role === "OWNER"
  }

  isAdmin(): boolean {
    return this.role === "ADMIN"
  }

  getFullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`
    }
    return this.name
  }

  getInitials(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`
    }
    return this.name.substring(0, 2).toUpperCase()
  }
}
