import { BaseModel } from "./BaseModel"

/**
 * UI Service types
 */
export enum UIServiceType {
  AUTH = "auth",
  USER_MANAGEMENT = "user-management",
  PRODUCT = "product",
  DASHBOARD = "dashboard",
  SETTINGS = "settings"
}

/**
 * UI Template types
 */
export enum UITemplate {
  // Auth templates
  AUTH_MODERN = "auth-modern",
  AUTH_CLASSIC = "auth-classic",
  AUTH_MINIMAL = "auth-minimal",

  // User management templates
  USER_TABLE = "user-table",
  USER_GRID = "user-grid",
  USER_LIST = "user-list",

  // Product templates
  PRODUCT_GRID = "product-grid",
  PRODUCT_LIST = "product-list",
  PRODUCT_CARDS = "product-cards",
  PRODUCT_MINIMAL = "product-minimal"
}

/**
 * UI Service model
 */
export class UIService extends BaseModel {
  public readonly code: string
  public readonly name: string
  public readonly type: UIServiceType
  public readonly description?: string
  public readonly templates: UITemplate[]
  public readonly isEnabled: boolean
  public readonly config?: Record<string, any>

  constructor(props: {
    id: string
    code: string
    name: string
    type: UIServiceType
    description?: string
    templates: UITemplate[]
    isEnabled?: boolean
    config?: Record<string, any>
    createdAt?: string
    updatedAt?: string
  }) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })

    this.code = props.code
    this.name = props.name
    this.type = props.type
    this.description = props.description
    this.templates = props.templates
    this.isEnabled = props.isEnabled ?? true
    this.config = props.config
  }
}

/**
 * Tenant UI Service Configuration
 */
export interface TenantUIServiceConfig {
  serviceCode: string
  template: UITemplate
  customConfig?: Record<string, any>
  enabledAt: string
}
