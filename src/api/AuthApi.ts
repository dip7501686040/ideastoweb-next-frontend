import { BaseApi } from "./BaseApi"

export class AuthApi extends BaseApi {
  // Master user registration (main app) — no tenant header needed
  async registerMaster(data: { name: string; email: string; password: string; role: "OWNER" | "ADMIN" }) {
    return this.request("/auth/register", {
      method: "POST",
      body: data,
      skipAuth: true
    })
  }

  // Master user login (main app) — no tenant header needed
  async loginMaster(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: { email, password },
      skipAuth: true
    })
  }

  // Tenant user login — x-tenant-code identifies the DB before JWT exists
  async login(data: { email: string; password: string; tenantCode?: string }) {
    const headers: Record<string, string> = {}
    if (data.tenantCode) {
      headers["x-tenant-code"] = data.tenantCode
    }

    // Omit tenantCode from the request body — backend reads it from the header
    const { tenantCode: _tc, ...body } = data

    return this.request("/auth/login", {
      method: "POST",
      body,
      skipAuth: true,
      headers
    })
  }

  // Tenant user registration — x-tenant-code identifies the DB before JWT exists
  async register(data: { email: string; password: string; firstName?: string; lastName?: string; tenantCode?: string }) {
    const headers: Record<string, string> = {}
    if (data.tenantCode) {
      headers["x-tenant-code"] = data.tenantCode
    }

    const { tenantCode: _tc, ...body } = data

    return this.request("/auth/register", {
      method: "POST",
      body,
      skipAuth: true,
      headers
    })
  }

  // Forgot password — send x-tenant-code when in a tenant context
  async forgotPassword(email: string, tenantCode?: string) {
    const headers: Record<string, string> = {}
    if (tenantCode) {
      headers["x-tenant-code"] = tenantCode
    }

    return this.request("/auth/forgot-password", {
      method: "POST",
      body: { email },
      skipAuth: true,
      headers
    })
  }

  async refreshToken(refreshToken: string) {
    return this.request("/auth/refresh-token", {
      method: "POST",
      body: { refreshToken },
      skipAuth: true // No auth needed for token refresh
    })
  }

  async logout() {
    // Optional: Call backend logout endpoint if it exists
    // For now, we'll just clear tokens on frontend
    try {
      return this.request("/auth/logout", {
        method: "POST"
      })
    } catch (error) {
      // Ignore errors - we'll clear tokens anyway
      return { message: "Logged out" }
    }
  }

  async getCurrentUser() {
    return this.request("/auth/me", {
      method: "GET"
    })
  }
}
