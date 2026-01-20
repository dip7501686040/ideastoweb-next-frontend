import { TokenManager } from "@/lib/tokenManager"

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
  skipAuth?: boolean
}

export class BaseApi {
  protected baseUrl = "http://localhost:8000"

  protected async request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    // Get access token for authenticated requests
    let accessToken = TokenManager.getAccessToken()

    // Prepare headers
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
      credentials: "include" // 🔥 cookies (access + refresh)
    })

    // If request fails with 401 (Unauthorized), try to refresh token
    if (res.status === 401 && !options.skipAuth && TokenManager.getRefreshToken()) {
      try {
        // Attempt to refresh the access token
        accessToken = await TokenManager.refreshAccessToken()

        // Retry the original request with new token
        headers["Authorization"] = `Bearer ${accessToken}`

        res = await fetch(`${this.baseUrl}${path}`, {
          method: options.method || "GET",
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          credentials: "include"
        })
      } catch (refreshError) {
        // If refresh fails, clear tokens and throw error
        TokenManager.clearTokens()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw new Error("Session expired. Please login again.")
      }
    }

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || "Request failed")
    }

    return data
  }
}
