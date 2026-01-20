import { BaseApi } from "./BaseApi"
import { Service, ApplyServiceRequest, ApplyServiceResponse, EnabledService } from "@/models/Service"

export class ServiceApi extends BaseApi {
  /**
   * Get all available services
   * @returns Array of services
   */
  async getAllServices(tenantCode?: string): Promise<Service[]> {
    const path = tenantCode ? `/services?tenantCode=${encodeURIComponent(tenantCode)}` : "/services"
    const response = await this.request<any[]>(path, {
      method: "GET"
    })

    return response.map(
      (service) =>
        new Service({
          id: service.id,
          code: service.code,
          name: service.name,
          description: service.description,
          dependencies: service.dependencies,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt
        })
    )
  }

  /**
   * Get service by code
   * @param code - Service code
   * @returns Service details
   */
  async getServiceByCode(code: string): Promise<Service> {
    const response = await this.request<any>(`/services/code/${code}`, {
      method: "GET"
    })

    return new Service({
      id: response.id,
      code: response.code,
      name: response.name,
      description: response.description,
      dependencies: response.dependencies,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt
    })
  }

  /**
   * Apply service to tenant with auto-dependency resolution
   * @param data - Apply service request
   * @returns Applied services response
   */
  async applyServiceToTenant(data: ApplyServiceRequest): Promise<ApplyServiceResponse> {
    return this.request<ApplyServiceResponse>("/services/apply-to-tenant", {
      method: "POST",
      body: data
    })
  }

  /**
   * Get enabled services for a tenant
   * @param tenantCode - Tenant code
   * @returns Array of enabled services
   */
  async getEnabledServices(tenantCode: string): Promise<EnabledService[]> {
    const response = await this.request<{ tenantCode: string; services: EnabledService[] }>(`/services/tenant/${tenantCode}/enabled`, {
      method: "GET"
    })
    return response.services || []
  }

  /**
   * Remove service from tenant
   * @param tenantCode - Tenant code
   * @param serviceCode - Service code to remove
   * @returns Success message
   */
  async removeServiceFromTenant(tenantCode: string, serviceCode: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/services/tenant/${tenantCode}/service/${serviceCode}`, {
      method: "DELETE"
    })
  }
}

// Export singleton instance
export const serviceApi = new ServiceApi()
