import { BaseApi } from "./BaseApi"

export class AuthApi extends BaseApi {
  async registerMaster(data: { name: string; email: string; password: string; role: "OWNER" | "ADMIN" }) {
    return this.request("/auth/register", {
      method: "POST",
      body: data,
      skipAuth: true // No auth needed for registration
    })
  }

  async loginMaster(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: { email, password },
      skipAuth: true // No auth needed for login
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
