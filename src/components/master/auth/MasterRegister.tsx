"use client"

import { RegisterForm } from "@/components/auth/RegisterForm"

export default function MasterRegister() {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Master Portal</h1>
        <p className="text-gray-600 mt-2">Create a master account to manage the platform</p>
      </div>
      <RegisterForm />
    </div>
  )
}
