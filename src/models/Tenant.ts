import { BaseModel } from "./BaseModel"

/**
 * Deployment configuration for tenant infrastructure isolation
 * Supports multi-region, multi-cluster, and dedicated pod deployments
 */
export interface TenantDeploymentConfig {
  // Frontend deployment
  frontendBaseUrl?: string // e.g., https://tenantA.fe.yourapp.com
  frontendRegion?: string // e.g., us-east-1, eu-west-1
  frontendCluster?: string // e.g., cluster-a, prod-eu

  // Backend deployment
  backendBaseUrl?: string // e.g., https://tenantA.api.yourapp.com
  backendRegion?: string // e.g., us-east-1, eu-west-1
  backendCluster?: string // e.g., cluster-a, prod-eu

  // Database deployment
  databaseRegion?: string // Data residency compliance
  databaseCluster?: string // Dedicated DB cluster

  // Isolation level
  isolationLevel?: "shared" | "pod" | "cluster" | "region"

  // Kubernetes namespace (if applicable)
  namespace?: string // e.g., tenant-a
}

export class Tenant extends BaseModel {
  public readonly tenantCode: string
  public readonly name: string
  public readonly dbName: string
  public readonly apiKey?: string // Only present in registration response
  public readonly deploymentConfig?: TenantDeploymentConfig

  constructor(props: { id: string; tenantCode: string; name: string; dbName: string; apiKey?: string; deploymentConfig?: TenantDeploymentConfig; createdAt?: string; updatedAt?: string }) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })

    this.tenantCode = props.tenantCode
    this.name = props.name
    this.dbName = props.dbName
    this.apiKey = props.apiKey
    this.deploymentConfig = props.deploymentConfig
  }

  /**
   * Get tenant frontend URL
   * Falls back to subdomain if no dedicated URL configured
   */
  getFrontendUrl(): string {
    if (this.deploymentConfig?.frontendBaseUrl) {
      return this.deploymentConfig.frontendBaseUrl
    }

    const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "localhost"
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const port = process.env.NODE_ENV === "production" ? "" : ":3000"

    return `${protocol}://${this.tenantCode}.${mainDomain}${port}`
  }

  /**
   * Get tenant backend URL
   * Falls back to shared API if no dedicated URL configured
   */
  getBackendUrl(): string {
    if (this.deploymentConfig?.backendBaseUrl) {
      return this.deploymentConfig.backendBaseUrl
    }

    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  }

  /**
   * Check if tenant has dedicated infrastructure
   */
  hasDedicatedInfrastructure(): boolean {
    return this.deploymentConfig?.isolationLevel !== "shared" && !!this.deploymentConfig
  }

  /**
   * Get deployment summary
   */
  getDeploymentSummary(): string {
    if (!this.deploymentConfig || this.deploymentConfig.isolationLevel === "shared") {
      return "Shared infrastructure"
    }

    const { isolationLevel, frontendRegion, backendRegion } = this.deploymentConfig
    const parts = []

    if (isolationLevel) {
      parts.push(`${isolationLevel.charAt(0).toUpperCase() + isolationLevel.slice(1)}-level isolation`)
    }

    if (frontendRegion || backendRegion) {
      parts.push(`Region: ${frontendRegion || backendRegion}`)
    }

    return parts.length > 0 ? parts.join(" • ") : "Shared infrastructure"
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
