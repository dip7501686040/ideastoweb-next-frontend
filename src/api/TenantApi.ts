import { BaseApi } from "./BaseApi"
import { Tenant, TenantRegistrationRequest, TenantRegistrationResponse, RegenerateApiKeyResponse } from "@/models/Tenant"

export class TenantApi extends BaseApi {
  /**
   * Get all tenants owned by the authenticated user
   * @returns Array of tenants
   */
  async getMyTenants(): Promise<Tenant[]> {
    const response = await this.request<any[]>("/tenants/my-tenants", {
      method: "GET"
    })

    return response.map(
      (tenant) =>
        new Tenant({
          id: tenant.id,
          tenantCode: tenant.tenantCode,
          name: tenant.name,
          dbName: tenant.dbName,
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt
        })
    )
  }

  /**
   * Register a new tenant with dedicated database and API key
   * @param data - Tenant registration data (tenantCode and name)
   * @returns Tenant registration response with API key
   */
  async registerTenant(data: TenantRegistrationRequest): Promise<TenantRegistrationResponse> {
    return this.request<TenantRegistrationResponse>("/tenants/register", {
      method: "POST",
      body: data
    })
  }

  /**
   * Get tenant information by tenant code
   * @param tenantCode - The tenant code
   * @returns Tenant details
   */
  async getTenantByCode(tenantCode: string): Promise<Tenant> {
    const response = await this.request<any>(`/tenants/${tenantCode}`, {
      method: "GET"
    })

    return new Tenant({
      id: response.id,
      tenantCode: response.tenantCode,
      name: response.name,
      dbName: response.dbName,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      deploymentConfig: response.deploymentConfig
    })
  }

  /**
   * Get tenant information by tenant ID
   * @param tenantId - The tenant ID
   * @returns Tenant details
   */
  async getTenantById(tenantId: string): Promise<Tenant> {
    const response = await this.request<any>(`/tenants/by-id/${tenantId}`, {
      method: "GET"
    })

    return new Tenant({
      id: response.id,
      tenantCode: response.tenantCode,
      name: response.name,
      dbName: response.dbName,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      deploymentConfig: response.deploymentConfig
    })
  }

  /**
   * Update tenant deployment configuration
   * @param tenantId - The tenant ID
   * @param config - Deployment configuration
   * @returns Updated tenant
   */
  async updateDeploymentConfig(tenantId: string, config: any): Promise<Tenant> {
    const response = await this.request<any>(`/tenants/${tenantId}/deployment`, {
      method: "PUT",
      body: { deploymentConfig: config }
    })

    return new Tenant({
      id: response.id,
      tenantCode: response.tenantCode,
      name: response.name,
      dbName: response.dbName,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      deploymentConfig: response.deploymentConfig
    })
  }

  /**
   * Regenerate API key for a tenant
   * @param tenantCode - The tenant code
   * @returns New API key response
   */
  async regenerateApiKey(tenantCode: string): Promise<RegenerateApiKeyResponse> {
    return this.request<RegenerateApiKeyResponse>(`/tenants/regenerate-api-key/${tenantCode}`, {
      method: "GET"
    })
  }

  /**
   * Delete a tenant and its database
   * ⚠️ Warning: This operation is irreversible
   * @param tenantCode - The tenant code to delete
   * @returns Success message
   */
  async deleteTenant(tenantCode: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/tenants/${tenantCode}`, {
      method: "DELETE"
    })
  }

  /**
   * Test protected endpoint with API key
   * @param apiKey - The API key to test
   * @returns Protected resource response
   */
  async testProtectedRoute(apiKey: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("/tenants/protected", {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      },
      skipAuth: true // Use API key instead of Bearer token
    })
  }
}

// Export singleton instance
export const tenantApi = new TenantApi()
