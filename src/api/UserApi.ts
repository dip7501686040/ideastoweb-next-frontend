import { ApiUser } from "@/models/User"
import { BaseApi } from "./BaseApi"

/**
 * User API client.
 * All requests use JWT-based auth — tenant DB routing is handled by the backend
 * from the token's tenantId / tenantCode fields. No x-api-key needed.
 */
export class UserApi extends BaseApi {
  async getAll(): Promise<ApiUser[]> {
    return this.request<ApiUser[]>("/users", {
      method: "GET"
    })
  }

  async getById(id: string): Promise<ApiUser> {
    return this.request<ApiUser>(`/users/${id}`, {
      method: "GET"
    })
  }

  async create(data: Partial<ApiUser>): Promise<ApiUser> {
    return this.request<ApiUser>("/users", {
      method: "POST",
      body: data
    })
  }

  async update(id: string, data: Partial<ApiUser>): Promise<ApiUser> {
    return this.request<ApiUser>(`/users/${id}`, {
      method: "PUT",
      body: data
    })
  }

  async delete(id: string): Promise<{ message?: string }> {
    return this.request<{ message?: string }>(`/users/${id}`, {
      method: "DELETE"
    })
  }
}

export const userApi = new UserApi()
