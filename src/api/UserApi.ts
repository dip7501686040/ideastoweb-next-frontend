import { ApiUser } from "@/models/User"
import { BaseApi } from "./BaseApi"
import getApiKeyForTenant from "@/lib/tenantApiKey"

export class UserApi extends BaseApi {
  async getAll(tenantCode?: string): Promise<ApiUser[]> {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<ApiUser[]>("/users", {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined
    })
  }

  async getById(id: string, tenantCode?: string): Promise<ApiUser> {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<ApiUser>(`/users/${id}`, {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined
    })
  }

  async create(data: Partial<ApiUser>, tenantCode?: string): Promise<ApiUser> {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<ApiUser>("/users", {
      method: "POST",
      body: data,
      headers: apiKey ? { "x-api-key": apiKey } : undefined
    })
  }

  async update(id: string, data: Partial<ApiUser>, tenantCode?: string): Promise<ApiUser> {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<ApiUser>(`/users/${id}`, {
      method: "PUT",
      body: data,
      headers: apiKey ? { "x-api-key": apiKey } : undefined
    })
  }

  async delete(id: string, tenantCode?: string): Promise<{ message?: string }> {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<{ message?: string }>(`/users/${id}`, {
      method: "DELETE",
      headers: apiKey ? { "x-api-key": apiKey } : undefined
    })
  }
}

export const userApi = new UserApi()
