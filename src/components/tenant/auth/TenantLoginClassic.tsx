"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"

interface TenantLoginClassicProps {
  tenantCode: string
}

export default function TenantLoginClassic({ tenantCode }: TenantLoginClassicProps) {
  const { login, loading, error: authError } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password, tenantCode)
    } catch (err: any) {
      setError(err.message || "Login failed")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">{tenantCode}</h2>
            <p className="text-blue-100 text-center mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {(error || authError) && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3" role="alert">
                <p className="text-sm">{error || authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="/auth/forgot-password" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              New user?{" "}
              <a href="/register" className="text-blue-600 hover:underline font-medium">
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
