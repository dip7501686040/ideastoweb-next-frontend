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
              setUser(
                new User({
                  id: userData.id || userData.userId,
                  email: userData.email,
                  name: userData.name,
                  role: userData.role
                })
              )
            }
          } else if (TokenManager.getRefreshToken()) {
            // Try to refresh if access token is expired
            try {
              await TokenManager.refreshAccessToken()
              const userData = TokenManager.getUserFromToken()
              if (userData) {
                setUser(
                  new User({
                    id: userData.id || userData.userId,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role
                  })
                )
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

      const userData = new User({
        id: res.user.id,
        email: res.user.email,
        name: res.user.name,
        role: res.user.role
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

  async function forgotPassword(email: string) {
    setLoading(true)
    setError(null)
    try {
      await api.forgotPassword(email)
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
      await api.logout()
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
          setUser(
            new User({
              id: userData.id || userData.userId,
              email: userData.email,
              name: userData.name,
              role: userData.role
            })
          )
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
    login,
    register,
    forgotPassword,
    logout,
    refreshSession
  }
}
