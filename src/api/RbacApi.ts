import { BaseApi } from "./BaseApi"
import { RoleApiType } from "@/models/Role"
import { PermissionApiType } from "@/models/Permission"

/**
 * RBAC API client.
 * All requests are authenticated via the JWT in the Authorization header.
 * The backend resolves the tenant DB from the token's tenantId / tenantCode.
 * No x-api-key or tenantCode argument is needed here.
 */
export class RbacApi extends BaseApi {
  // ─── Roles ───────────────────────────────────────────────────────────────

  async createRole(data: Partial<RoleApiType>) {
    return this.request<RoleApiType>("/rbac/roles", {
      method: "POST",
      body: data
    })
  }

  async getRoles() {
    return this.request<RoleApiType[]>("/rbac/roles", {
      method: "GET"
    })
  }

  async getRoleById(id: string) {
    return this.request<RoleApiType>(`/rbac/roles/${id}`, {
      method: "GET"
    })
  }

  async updateRole(id: string, data: Partial<RoleApiType>) {
    return this.request<RoleApiType>(`/rbac/roles/${id}`, {
      method: "PUT",
      body: data
    })
  }

  async deleteRole(id: string) {
    return this.request<{ message?: string }>(`/rbac/roles/${id}`, {
      method: "DELETE"
    })
  }

  // ─── Role permissions ─────────────────────────────────────────────────────

  async getRolePermissions(roleId: string) {
    return this.request<PermissionApiType[]>(`/rbac/roles/${roleId}/permissions`, {
      method: "GET"
    })
  }

  async assignPermissionToRole(roleId: string, permission: { moduleKey: string; operationKey: string }) {
    return this.request(`/rbac/roles/${roleId}/permissions`, {
      method: "POST",
      body: permission
    })
  }

  async assignPermissionsBulk(roleId: string, data: { permissions: { moduleKey: string; operationKey: string }[] }) {
    return this.request(`/rbac/roles/${roleId}/permissions/bulk`, {
      method: "POST",
      body: data
    })
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    return this.request(`/rbac/roles/${roleId}/permissions/${permissionId}`, {
      method: "DELETE"
    })
  }

  // ─── Permissions ──────────────────────────────────────────────────────────

  async createPermission(data: { moduleKey: string; operationKey: string }) {
    return this.request<PermissionApiType>("/rbac/permissions", {
      method: "POST",
      body: data
    })
  }

  async getPermissions() {
    return this.request<PermissionApiType[]>("/rbac/permissions", {
      method: "GET"
    })
  }

  async getPermissionById(id: string) {
    return this.request<PermissionApiType>(`/rbac/permissions/${id}`, {
      method: "GET"
    })
  }

  async deletePermission(id: string) {
    return this.request<{ message?: string }>(`/rbac/permissions/${id}`, {
      method: "DELETE"
    })
  }

  // ─── Modules ──────────────────────────────────────────────────────────────

  async createModule(data: { key: string; description?: string }) {
    return this.request(`/rbac/modules`, {
      method: "POST",
      body: data
    })
  }

  async getModules() {
    return this.request(`/rbac/modules`, {
      method: "GET"
    })
  }

  async getModuleById(id: string) {
    return this.request(`/rbac/modules/${id}`, {
      method: "GET"
    })
  }

  async getModuleByKey(key: string) {
    return this.request(`/rbac/modules/key/${encodeURIComponent(key)}`, {
      method: "GET"
    })
  }

  async updateModule(id: string, data: { key?: string; description?: string }) {
    return this.request(`/rbac/modules/${id}`, {
      method: "PUT",
      body: data
    })
  }

  async deleteModule(id: string) {
    return this.request(`/rbac/modules/${id}`, {
      method: "DELETE"
    })
  }

  // ─── Operations ───────────────────────────────────────────────────────────

  async createOperation(data: { key: string; description?: string }) {
    return this.request(`/rbac/operations`, {
      method: "POST",
      body: data
    })
  }

  async getOperations() {
    return this.request(`/rbac/operations`, {
      method: "GET"
    })
  }

  async getOperationById(id: string) {
    return this.request(`/rbac/operations/${id}`, {
      method: "GET"
    })
  }

  async getOperationByKey(key: string) {
    return this.request(`/rbac/operations/key/${encodeURIComponent(key)}`, {
      method: "GET"
    })
  }

  async updateOperation(id: string, data: { key?: string; description?: string }) {
    return this.request(`/rbac/operations/${id}`, {
      method: "PUT",
      body: data
    })
  }

  async deleteOperation(id: string) {
    return this.request(`/rbac/operations/${id}`, {
      method: "DELETE"
    })
  }

  // ─── User roles ───────────────────────────────────────────────────────────

  async assignRoleToUser(userId: string, roleId: string) {
    return this.request(`/rbac/users/${userId}/roles`, {
      method: "POST",
      body: { roleId }
    })
  }

  async getUserRoles(userId: string) {
    return this.request<any>(`/rbac/users/${userId}/roles`, {
      method: "GET"
    })
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    return this.request(`/rbac/users/${userId}/roles/${roleId}`, {
      method: "DELETE"
    })
  }

  // ─── Super Admin Credentials (master JWT only) ────────────────────────────

  async getSuperAdminCreds(tenantCode: string) {
    return this.request<{
      tenantCode: string
      tenantName: string
      credentials: { email: string; password: string }
    }>(`/rbac/super-admin/creds/${tenantCode}`, {
      method: "GET"
    })
  }

  async syncSuperAdminPermissions(tenantCode: string) {
    return this.request<{
      message: string
      tenant: { id: string; code: string }
      seed: { modulesCreated: number; operationsCreated: number; permissionsCreated: number }
      totalPermissions: number
      roles: Array<{ role: string; added: number; alreadyHad: number }>
    }>("/rbac/super-admin/sync-permissions", {
      method: "POST",
      headers: { "X-Tenant-Code": tenantCode }
    })
  }
}

export const rbacApi = new RbacApi()
