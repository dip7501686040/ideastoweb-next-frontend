"use client"

import { useState } from "react"
import { useOperations } from "@/hooks/useOperations"
import { showToast, handleApiError } from "@/lib/utils"

/**
 * ⚙️ OPERATIONS - Action Definitions
 * Reusable actions across modules (Master Admin Only)
 */
export default function OperationsManagement() {
  const { operations, loading, error, refetch, createOperation, updateOperation, deleteOperation } = useOperations()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOperations = operations.filter((operation) => operation.key?.toLowerCase().includes(searchTerm.toLowerCase()) || false || operation.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operations</h1>
          <p className="text-gray-600 mt-1">System operation definitions (Master Admin Only)</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Operation
        </button>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-900">Master Admin Only</h3>
            <p className="text-sm text-yellow-700 mt-1">Operations are reusable actions. Keep this minimal. Changes affect permissions across all modules and tenants.</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button onClick={() => refetch()} className="mt-2 text-sm text-red-700 font-medium hover:text-red-900">
            Retry →
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          ))
        ) : filteredOperations.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No operations found</div>
        ) : (
          filteredOperations.map((operation) => (
            <div key={operation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">{(operation.key || "O").charAt(0)}</div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{operation.key || "Unnamed Operation"}</h3>
              <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{operation.key || "N/A"}</code>

              <p className="text-sm text-gray-600 mt-3 mb-4">{operation.description || "No description"}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Used in <span className="font-semibold text-gray-900">-</span> modules
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Edit</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Best Practices</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Keep operations minimal and reusable across modules</li>
          <li>Use standard CRUD operations (Create, Read, Update, Delete) when possible</li>
          <li>Add custom operations only for specific business requirements</li>
          <li>Consider the impact on all modules before making changes</li>
        </ul>
      </div>
    </div>
  )
}
