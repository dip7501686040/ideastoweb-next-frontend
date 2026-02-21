import { BaseApi } from "./BaseApi"
import getApiKeyForTenant from "@/lib/tenantApiKey"
import { RoleApiType } from "@/models/Role"
import { PermissionApiType } from "@/models/Permission"

export class RbacApi extends BaseApi {
  // Roles
  async createRole(data: Partial<RoleApiType>, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<RoleApiType>("/rbac/roles", {
      method: "POST",
      body: data,
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getRoles(tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<RoleApiType[]>("/rbac/roles", {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getRoleById(id: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<RoleApiType>(`/rbac/roles/${id}`, {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async updateRole(id: string, data: Partial<RoleApiType>, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<RoleApiType>(`/rbac/roles/${id}`, {
      method: "PUT",
      body: data,
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async deleteRole(id: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<{ message?: string }>(`/rbac/roles/${id}`, {
      method: "DELETE",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  // Role permissions
  async assignPermissionToRole(roleId: string, permission: { moduleKey: string; operationKey: string }, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/roles/${roleId}/permissions`, {
      method: "POST",
      body: permission,
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async assignPermissionsBulk(roleId: string, data: { permissions: { moduleKey: string; operationKey: string }[] }, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/roles/${roleId}/permissions/bulk`, {
      method: "POST",
      body: data,
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async removePermissionFromRole(roleId: string, permissionId: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/roles/${roleId}/permissions/${permissionId}`, {
      method: "DELETE",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  // Permissions
  async createPermission(data: { moduleKey: string; operationKey: string }, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<PermissionApiType>("/rbac/permissions", {
      method: "POST",
      body: data,
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  // Modules
  async createModule(data: { key: string; description?: string }, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/modules`, {
      method: "POST",
      body: data,
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getModules(tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/modules`, {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getModuleById(id: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/modules/${id}`, {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getModuleByKey(key: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/modules/key/${encodeURIComponent(key)}`, {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async updateModule(id: string, data: { key?: string; description?: string }, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/modules/${id}`, {
      method: "PUT",
      body: data,
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async deleteModule(id: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/modules/${id}`, {
      method: "DELETE",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  // Operations
  async createOperation(data: { key: string; description?: string }, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/operations`, {
      method: "POST",
      body: data,
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getOperations(tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/operations`, {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getOperationById(id: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/operations/${id}`, {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getOperationByKey(key: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/operations/key/${encodeURIComponent(key)}`, {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async updateOperation(id: string, data: { key?: string; description?: string }, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/operations/${id}`, {
      method: "PUT",
      body: data,
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async deleteOperation(id: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/operations/${id}`, {
      method: "DELETE",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getPermissions(tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<PermissionApiType[]>("/rbac/permissions", {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getPermissionById(id: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<PermissionApiType>(`/rbac/permissions/${id}`, {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async deletePermission(id: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<{ message?: string }>(`/rbac/permissions/${id}`, {
      method: "DELETE",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  // User roles (assign/remove/list)
  async assignRoleToUser(userId: string, roleId: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/users/${userId}/roles`, {
      method: "POST",
      body: { roleId },
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async getUserRoles(userId: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request<any>(`/rbac/users/${userId}/roles`, {
      method: "GET",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }

  async removeRoleFromUser(userId: string, roleId: string, tenantCode?: string) {
    const apiKey = tenantCode ? getApiKeyForTenant(tenantCode) : undefined
    return this.request(`/rbac/users/${userId}/roles/${roleId}`, {
      method: "DELETE",
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      skipAuth: !!apiKey
    })
  }
}

export const rbacApi = new RbacApi()
