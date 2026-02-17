"use client"

import { LoginForm } from "@/components/auth/LoginForm"

export default function MasterLogin() {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Master Portal</h1>
        <p className="text-gray-600 mt-2">Sign in to manage your platform</p>
      </div>
      <LoginForm />
    </div>
  )
}
