import { BaseApi } from "./BaseApi"
import { UIService, UIServiceType, UITemplate, TenantUIServiceConfig } from "@/models/UIService"

export class UIServiceApi extends BaseApi {
  /**
   * Get all available UI services
   * @returns Array of UI services
   */
  async getAllUIServices(): Promise<UIService[]> {
    const response = await this.request<any[]>("/ui-services", {
      method: "GET"
    })

    return response.map(
      (service) =>
        new UIService({
          id: service.id,
          code: service.code,
          name: service.name,
          type: service.type,
          description: service.description,
          templates: service.templates,
          isEnabled: service.isEnabled,
          config: service.config,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt
        })
    )
  }

  /**
   * Get UI services enabled for a tenant
   * @param tenantCode - Tenant code
   * @returns Array of enabled UI services
   */
  async getTenantUIServices(tenantCode: string): Promise<TenantUIServiceConfig[]> {
    const response = await this.request<any[]>(`/tenants/${encodeURIComponent(tenantCode)}/ui-services`, {
      method: "GET"
    })

    return response
  }

  /**
   * Enable UI service for tenant
   * @param tenantCode - Tenant code
   * @param serviceCode - UI service code
   * @param template - Selected template
   * @param customConfig - Optional custom configuration
   */
  async enableUIService(tenantCode: string, serviceCode: string, template: UITemplate, customConfig?: Record<string, any>): Promise<void> {
    await this.request(`/tenants/${encodeURIComponent(tenantCode)}/ui-services`, {
      method: "POST",
      body: JSON.stringify({
        serviceCode,
        template,
        customConfig
      })
    })
  }

  /**
   * Update UI service configuration for tenant
   * @param tenantCode - Tenant code
   * @param serviceCode - UI service code
   * @param template - New template
   * @param customConfig - Updated custom configuration
   */
  async updateUIService(tenantCode: string, serviceCode: string, template?: UITemplate, customConfig?: Record<string, any>): Promise<void> {
    await this.request(`/tenants/${encodeURIComponent(tenantCode)}/ui-services/${encodeURIComponent(serviceCode)}`, {
      method: "PUT",
      body: JSON.stringify({
        template,
        customConfig
      })
    })
  }

  /**
   * Disable UI service for tenant
   * @param tenantCode - Tenant code
   * @param serviceCode - UI service code
   */
  async disableUIService(tenantCode: string, serviceCode: string): Promise<void> {
    await this.request(`/tenants/${encodeURIComponent(tenantCode)}/ui-services/${encodeURIComponent(serviceCode)}`, {
      method: "DELETE"
    })
  }
}
