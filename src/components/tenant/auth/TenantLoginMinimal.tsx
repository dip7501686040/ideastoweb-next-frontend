"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthApi } from "@/api/AuthApi"

interface TenantLoginMinimalProps {
  tenantCode: string
}

export default function TenantLoginMinimal({ tenantCode }: TenantLoginMinimalProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const authApi = new AuthApi()
      await authApi.login({ email, password, tenantCode })

      router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-sm px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light text-gray-900 mb-2">{tenantCode}</h1>
          <p className="text-gray-500 text-sm">Sign in</p>
        </div>

        {error && <div className="mb-6 text-red-600 text-sm text-center border-b border-red-200 pb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400"
              placeholder="Email"
            />
          </div>

          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-3 rounded-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <a href="/auth/forgot-password" className="block text-sm text-gray-500 hover:text-gray-900">
            Forgot password?
          </a>
          <a href="/auth/register" className="block text-sm text-gray-500 hover:text-gray-900">
            Create account
          </a>
        </div>
      </div>
    </div>
  )
}
