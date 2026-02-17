import { BaseApi } from "./BaseApi"

export class AuthApi extends BaseApi {
  // Master user registration (main app)
  async registerMaster(data: { name: string; email: string; password: string; role: "OWNER" | "ADMIN" }) {
    return this.request("/auth/register", {
      method: "POST",
      body: data,
      skipAuth: true // No auth needed for registration
    })
  }

  // Master user login (main app)
  async loginMaster(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: { email, password },
      skipAuth: true // No auth needed for login
    })
  }

  // Tenant user login
  async login(data: { email: string; password: string; tenantCode?: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: data,
      skipAuth: true,
      headers: {
        "x-api-key": "c717ece9b2ab13d98f4755a1e9299f37eb6985e6627b7a86542e2da96a6898ae" // Pass tenant code in header for backend to identify tenant context
      }
    })
  }

  // Tenant user registration
  async register(data: { email: string; password: string; firstName?: string; lastName?: string; tenantCode?: string }) {
    return this.request("/auth/register", {
      method: "POST",
      body: data,
      skipAuth: true,
      headers: {
        "x-api-key": "c717ece9b2ab13d98f4755a1e9299f37eb6985e6627b7a86542e2da96a6898ae" // Pass tenant code in header for backend to identify tenant context
      }
    })
  }

  async forgotPassword(email: string) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: { email },
      skipAuth: true // No auth needed for password reset
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
