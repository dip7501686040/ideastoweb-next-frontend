import { TokenManager } from "@/lib/tokenManager"

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: any
  headers?: Record<string, string>
  skipAuth?: boolean
}

export class BaseApi {
  protected baseUrl = "http://localhost:8000"

  protected async request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    // Get access token for authenticated requests
    let accessToken = TokenManager.getAccessToken()

    // Prepare headers — never include x-api-key; JWT is the only auth mechanism
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }

    // Add Authorization header if token exists and auth is not skipped
    if (accessToken && !options.skipAuth) {
      headers["Authorization"] = `Bearer ${accessToken}`
    }

    let res = await fetch(`${this.baseUrl}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include"
    })

    // 401 on an authenticated request — attempt token refresh once
    if (res.status === 401 && !options.skipAuth && TokenManager.getRefreshToken()) {
      try {
        accessToken = await TokenManager.refreshAccessToken()
        headers["Authorization"] = `Bearer ${accessToken}`

        res = await fetch(`${this.baseUrl}${path}`, {
          method: options.method || "GET",
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          credentials: "include"
        })
      } catch (refreshError) {
        // Refresh failed — clear tokens and redirect to login
        TokenManager.clearTokens()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw new Error("Session expired. Please login again.")
      }
    }

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      // 401 after refresh attempt — could be a legacy token missing the `type` field
      if (res.status === 401) {
        const msg: string = data.message || ""
        if (msg.toLowerCase().includes("type") || msg.toLowerCase().includes("legacy")) {
          TokenManager.clearTokens()
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
          throw new Error("Your session is outdated. Please log in again.")
        }
        throw new Error(msg || "Unauthorized")
      }

      // 404 on a pre-auth route — likely an unknown x-tenant-code
      if (res.status === 404) {
        const msg: string = data.message || ""
        if (msg.toLowerCase().includes("tenant") || headers["x-tenant-code"]) {
          throw new Error("Invalid tenant. Please check the URL and try again.")
        }
        throw new Error(msg || "Not found")
      }

      throw new Error(data.message || "Request failed")
    }

    return data
  }
}
