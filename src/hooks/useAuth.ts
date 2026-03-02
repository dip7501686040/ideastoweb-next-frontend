"use client"

import { useState, useEffect } from "react"
import { AuthApi } from "@/api/AuthApi"
import { User } from "@/models/User"
import { useRouter } from "next/navigation"
import { TokenManager } from "@/lib/tokenManager"

const api = new AuthApi()

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(true)

  // Initialize user from token on mount
  useEffect(() => {
    const initUser = async () => {
      try {
        if (TokenManager.isAuthenticated()) {
          const accessToken = TokenManager.getAccessToken()
          if (accessToken && !TokenManager.isTokenExpired(accessToken)) {
            const userData = TokenManager.getUserFromToken()
            if (userData) {
              setUser(buildUserFromPayload(userData))
            }
          } else if (TokenManager.getRefreshToken()) {
            // Try to refresh if access token is expired
            try {
              await TokenManager.refreshAccessToken()
              const userData = TokenManager.getUserFromToken()
              if (userData) {
                setUser(buildUserFromPayload(userData))
              }
            } catch (err) {
              // Refresh failed, clear tokens
              TokenManager.clearTokens()
            }
          }
        }
      } catch (err) {
        console.error("Error initializing user:", err)
      } finally {
        setInitializing(false)
      }
    }

    initUser()
  }, [])

  async function login(email: string, password: string, tenantCode?: string) {
    setLoading(true)
    setError(null)
    try {
      // Use tenant login if tenantCode is provided, otherwise use master login
      const res = tenantCode ? await api.login({ email, password, tenantCode }) : await api.loginMaster(email, password)

      // Store tokens in cookies
      if (res.accessToken && res.refreshToken) {
        TokenManager.setTokens(res.accessToken, res.refreshToken)
      }

      // Prefer reading identity from the JWT rather than the response body
      const tokenPayload = TokenManager.getUserFromToken()
      const userData = tokenPayload
        ? buildUserFromPayload(tokenPayload)
        : new User({
            id: res.user?.id ?? "",
            email: res.user?.email ?? "",
            name: res.user?.name ?? "",
            role: res.user?.role ?? "USER"
          })
      setUser(userData)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function register(data: { name: string; email: string; password: string }) {
    setLoading(true)
    setError(null)
    try {
      await api.registerMaster({ ...data, role: "OWNER" })
      router.push("/login")
    } catch (err: any) {
      setError(err.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function forgotPassword(email: string, tenantCode?: string) {
    setLoading(true)
    setError(null)
    try {
      await api.forgotPassword(email, tenantCode)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    setLoading(true)
    try {
      // Call backend logout endpoint
      // await api.logout()
    } catch (err) {
      // Ignore errors - we'll clear tokens anyway
    } finally {
      // Clear tokens from cookies
      TokenManager.clearTokens()
      setUser(null)
      setLoading(false)
      router.push("/login")
    }
  }

  async function refreshSession() {
    try {
      const newAccessToken = await TokenManager.refreshAccessToken()
      if (newAccessToken) {
        const userData = TokenManager.getUserFromToken()
        if (userData) {
          setUser(buildUserFromPayload(userData))
        }
      }
    } catch (err) {
      console.error("Session refresh failed:", err)
      logout()
    }
  }

  return {
    user,
    loading,
    error,
    initializing,
    isAuthenticated: TokenManager.isAuthenticated(),
    /** Decoded JWT payload — read type/tenantCode/roles for UI decisions */
    tokenPayload: TokenManager.getUserFromToken() as JwtPayload | null,
    login,
    register,
    forgotPassword,
    logout,
    refreshSession
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * New JWT payload shape embedded by the backend at login.
 * Safe to decode on the frontend for UI decisions — never for security.
 */
export interface JwtPayload {
  userId: string
  email: string
  /** "MASTER" for super-admins, "TENANT" for tenant users */
  type: "MASTER" | "TENANT"
  tenantId?: string
  tenantCode?: string
  roles: string[]
  iat: number
  exp: number
}

/** Build a frontend User model from a decoded JWT payload */
function buildUserFromPayload(payload: any): User {
  // Derive a UserRole from the new JWT fields.
  // "MASTER" tokens → OWNER. Tenant tokens fall back to first role or USER.
  const derivedRole = payload.role ?? (payload.type === "MASTER" ? "OWNER" : (payload.roles?.[0]?.toUpperCase() ?? "USER"))

  return new User({
    id: payload.userId ?? payload.id ?? "",
    email: payload.email ?? "",
    name: payload.name ?? payload.email ?? "",
    role: derivedRole
  })
}
