import { CookieManager } from "./cookies"
import { AuthApi } from "@/api/AuthApi"

/**
 * TokenManager class for handling JWT tokens and automatic refresh
 * Manages access and refresh tokens stored in cookies
 */
export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = "accessToken"
  private static readonly REFRESH_TOKEN_KEY = "refreshToken"
  private static refreshPromise: Promise<string> | null = null

  /**
   * Get the current access token from cookies
   */
  static getAccessToken(): string | null {
    return CookieManager.get(this.ACCESS_TOKEN_KEY)
  }

  /**
   * Get the current refresh token from cookies
   */
  static getRefreshToken(): string | null {
    return CookieManager.get(this.REFRESH_TOKEN_KEY)
  }

  /**
   * Set tokens in cookies (called after login/register)
   */
  static setTokens(accessToken: string, refreshToken: string): void {
    // Access token expires in 15 minutes (short-lived)
    CookieManager.set(this.ACCESS_TOKEN_KEY, accessToken, {
      days: 1 / 96, // 15 minutes
      secure: true,
      sameSite: "Strict"
    })

    // Refresh token expires in 7 days (long-lived)
    CookieManager.set(this.REFRESH_TOKEN_KEY, refreshToken, {
      days: 7,
      secure: true,
      sameSite: "Strict"
    })
  }

  /**
   * Clear all tokens (logout)
   */
  static clearTokens(): void {
    CookieManager.delete(this.ACCESS_TOKEN_KEY)
    CookieManager.delete(this.REFRESH_TOKEN_KEY)
  }

  /**
   * Check if user is authenticated (has valid tokens)
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken() || !!this.getRefreshToken()
  }

  /**
   * Refresh the access token using the refresh token
   * Implements debouncing to prevent multiple simultaneous refresh calls
   */
  static async refreshAccessToken(): Promise<string> {
    // If a refresh is already in progress, return that promise
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshToken = this.getRefreshToken()

    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    this.refreshPromise = (async () => {
      try {
        const api = new AuthApi()
        const response = await api.refreshToken(refreshToken)

        // Update tokens in cookies
        if (response.accessToken && response.refreshToken) {
          this.setTokens(response.accessToken, response.refreshToken)
        }

        return response.accessToken
      } catch (error) {
        // If refresh fails, clear tokens and force re-login
        this.clearTokens()
        throw error
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  /**
   * Decode JWT token to get payload (without verification)
   * Useful for getting user info from token
   */
  static decodeToken(token: string): any {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      return null
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token)
    if (!decoded || !decoded.exp) return true

    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  }

  /**
   * Get user info from access token
   */
  static getUserFromToken(): any {
    const token = this.getAccessToken()
    if (!token) return null
    return this.decodeToken(token)
  }
}
