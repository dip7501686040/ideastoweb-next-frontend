/**
 * Routing Configuration for Multi-Region/Multi-Cluster Deployments
 *
 * This module provides utilities for dynamic tenant routing that supports:
 * - Shared infrastructure (all tenants on same cluster)
 * - Pod-level isolation (tenants in separate pods, same cluster)
 * - Cluster-level isolation (tenants in separate clusters)
 * - Region-level isolation (tenants in separate regions)
 *
 * Key Principle: Routing is DATA-DRIVEN, not CODE-DRIVEN
 */

import { Tenant, TenantDeploymentConfig } from "@/models/Tenant"

/**
 * Routing decision based on tenant configuration
 */
export interface RoutingDecision {
  shouldRedirect: boolean
  targetUrl?: string
  reason?: string
}

/**
 * Check if tenant requires routing to dedicated infrastructure
 *
 * @param tenant - Tenant object with deployment config
 * @param currentHost - Current hostname from request
 * @param targetType - 'frontend' or 'backend'
 * @returns Routing decision with redirect URL if needed
 */
export function checkTenantRouting(tenant: Tenant, currentHost: string, targetType: "frontend" | "backend"): RoutingDecision {
  const config = tenant.deploymentConfig

  // No dedicated infrastructure - use current host
  if (!config || config.isolationLevel === "shared") {
    return { shouldRedirect: false }
  }

  // Get target URL based on type
  const targetUrl = targetType === "frontend" ? config.frontendBaseUrl : config.backendBaseUrl

  // No dedicated URL configured - use current host
  if (!targetUrl) {
    return { shouldRedirect: false }
  }

  // Check if we're already on the target host
  const targetHost = new URL(targetUrl).hostname
  if (currentHost === targetHost) {
    return { shouldRedirect: false }
  }

  // Redirect to dedicated infrastructure
  return {
    shouldRedirect: true,
    targetUrl,
    reason: `Tenant has ${config.isolationLevel}-level isolation`
  }
}

/**
 * Build tenant-specific URL with proper routing
 *
 * @param tenant - Tenant object
 * @param path - Path to append (e.g., '/users')
 * @param type - 'frontend' or 'backend'
 * @returns Complete URL for the tenant
 */
export function buildTenantUrl(tenant: Tenant, path: string = "/", type: "frontend" | "backend" = "frontend"): string {
  const baseUrl = type === "frontend" ? tenant.getFrontendUrl() : tenant.getBackendUrl()

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${baseUrl}${normalizedPath}`
}

/**
 * Get API endpoint for tenant-specific backend
 *
 * @param tenant - Tenant object
 * @param endpoint - API endpoint path (e.g., '/users')
 * @returns Complete API URL
 */
export function getTenantApiUrl(tenant: Tenant, endpoint: string): string {
  return buildTenantUrl(tenant, endpoint, "backend")
}

/**
 * Resolve tenant routing at edge/middleware level
 * This is the master routing function that should be called in middleware
 *
 * @param tenantCode - Tenant code from hostname
 * @param currentUrl - Current request URL
 * @param tenantRegistry - Function to fetch tenant config from DB/cache
 * @returns Routing decision
 */
export async function resolveTenantRouting(tenantCode: string, currentUrl: string, tenantRegistry: (code: string) => Promise<Tenant | null>): Promise<RoutingDecision> {
  // Fetch tenant configuration
  const tenant = await tenantRegistry(tenantCode)

  if (!tenant) {
    return {
      shouldRedirect: false,
      reason: "Tenant not found"
    }
  }

  // Check if tenant has dedicated frontend
  const currentHost = new URL(currentUrl).hostname
  return checkTenantRouting(tenant, currentHost, "frontend")
}

/**
 * Configuration for infrastructure deployment
 * This should be managed in your backend/admin panel
 */
export interface InfrastructureConfig {
  clusters: ClusterConfig[]
  regions: RegionConfig[]
  defaultCluster: string
  defaultRegion: string
}

export interface ClusterConfig {
  id: string
  name: string
  region: string
  capacity: number
  currentLoad: number
  frontendUrl?: string // e.g., https://fe-cluster-a.yourapp.com
  backendUrl?: string // e.g., https://api-cluster-a.yourapp.com
}

export interface RegionConfig {
  id: string
  name: string
  displayName: string
  clusters: string[] // Cluster IDs in this region
  dataResidency: boolean // Whether region enforces data residency
}

/**
 * Tenant placement strategy
 * Used by admin to decide where to place a tenant
 */
export type PlacementStrategy =
  | "shared" // All tenants on default cluster
  | "balanced" // Distribute across clusters based on load
  | "dedicated" // Tenant gets own resources
  | "region-specific" // Place in specific region for compliance

/**
 * Determine placement for new tenant
 *
 * @param strategy - Placement strategy
 * @param infrastructure - Current infrastructure config
 * @param requirements - Tenant-specific requirements
 * @returns Deployment configuration
 */
export function determineTenantPlacement(
  strategy: PlacementStrategy,
  infrastructure: InfrastructureConfig,
  requirements?: {
    region?: string
    dataResidency?: boolean
    dedicatedResources?: boolean
  }
): TenantDeploymentConfig {
  switch (strategy) {
    case "shared":
      return {
        isolationLevel: "shared"
      }

    case "balanced": {
      // Find cluster with lowest load
      const cluster = infrastructure.clusters.reduce((lowest, current) => (current.currentLoad / current.capacity < lowest.currentLoad / lowest.capacity ? current : lowest))

      return {
        isolationLevel: "pod",
        frontendCluster: cluster.id,
        backendCluster: cluster.id,
        frontendRegion: cluster.region,
        backendRegion: cluster.region
      }
    }

    case "dedicated": {
      // Dedicated cluster for this tenant
      const region = requirements?.region || infrastructure.defaultRegion
      return {
        isolationLevel: "cluster",
        frontendRegion: region,
        backendRegion: region
        // frontendBaseUrl and backendBaseUrl should be set after provisioning
      }
    }

    case "region-specific": {
      const region = requirements?.region || infrastructure.defaultRegion
      return {
        isolationLevel: requirements?.dedicatedResources ? "cluster" : "pod",
        frontendRegion: region,
        backendRegion: region,
        databaseRegion: region
      }
    }
  }
}

/**
 * Validate tenant routing configuration
 *
 * @param config - Deployment configuration to validate
 * @returns Validation result
 */
export function validateRoutingConfig(config: TenantDeploymentConfig): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check URL formats
  if (config.frontendBaseUrl) {
    try {
      new URL(config.frontendBaseUrl)
    } catch {
      errors.push("Invalid frontendBaseUrl format")
    }
  }

  if (config.backendBaseUrl) {
    try {
      new URL(config.backendBaseUrl)
    } catch {
      errors.push("Invalid backendBaseUrl format")
    }
  }

  // Check consistency
  if (config.isolationLevel === "shared" && (config.frontendBaseUrl || config.backendBaseUrl)) {
    errors.push("Shared isolation level should not have dedicated URLs")
  }

  if (config.isolationLevel === "region" && !config.frontendRegion) {
    errors.push("Region-level isolation requires frontendRegion")
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Example: Migration helper to move tenant to different infrastructure
 *
 * @param tenant - Tenant to migrate
 * @param targetConfig - New deployment configuration
 * @returns Migration plan
 */
export function planTenantMigration(
  tenant: Tenant,
  targetConfig: TenantDeploymentConfig
): {
  steps: string[]
  downtime: boolean
  complexity: "low" | "medium" | "high"
} {
  const currentLevel = tenant.deploymentConfig?.isolationLevel || "shared"
  const targetLevel = targetConfig.isolationLevel || "shared"

  const steps: string[] = []
  let downtime = false
  let complexity: "low" | "medium" | "high" = "low"

  // Same level migration
  if (currentLevel === targetLevel) {
    steps.push("Update routing configuration in database")
    steps.push("Update DNS if URLs changed")
    steps.push("Reload load balancer configuration")
    complexity = "low"
  }
  // Upgrade isolation
  else if ((currentLevel === "shared" && targetLevel !== "shared") || (currentLevel === "pod" && ["cluster", "region"].includes(targetLevel))) {
    steps.push("Provision new infrastructure")
    steps.push("Migrate database (if needed)")
    steps.push("Deploy application to new infrastructure")
    steps.push("Update routing configuration")
    steps.push("Test in new environment")
    steps.push("Update DNS")
    steps.push("Monitor for issues")
    steps.push("Decommission old infrastructure")
    downtime = true
    complexity = "high"
  }
  // Downgrade isolation
  else {
    steps.push("Backup current configuration")
    steps.push("Migrate data to shared infrastructure")
    steps.push("Update routing configuration")
    steps.push("Test in shared environment")
    steps.push("Update DNS")
    downtime = true
    complexity = "medium"
  }

  return { steps, downtime, complexity }
}
