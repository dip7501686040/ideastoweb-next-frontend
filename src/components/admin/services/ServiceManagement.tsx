"use client"

import { useState, useEffect, useCallback } from "react"
import { Service } from "@/models/Service"
import { SyncMigrationsResponse, SyncMigrationsTenantResult } from "@/models/Service"
import { serviceApi } from "@/api/ServiceApi"
import { showToast, handleApiError } from "@/lib/utils"

/**
 * ⚙️ SERVICE MANAGEMENT — Master Admin only
 * Lists all available services in a card view and allows syncing
 * pending migrations for each service across all enabled tenants.
 */
export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await serviceApi.getAllServices()
      setServices(data)
    } catch (err: any) {
      setError(err?.message || "Failed to load services")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const refetch = fetchServices

  // Per-service sync state: serviceCode → loading | result | null
  const [syncState, setSyncState] = useState<Record<string, { loading: boolean; result: SyncMigrationsResponse | null; error: string | null }>>({})

  // Modal — show full per-tenant result breakdown
  const [resultModal, setResultModal] = useState<{ serviceCode: string; result: SyncMigrationsResponse } | null>(null)

  const handleSyncMigrations = async (serviceCode: string) => {
    setSyncState((prev) => ({
      ...prev,
      [serviceCode]: { loading: true, result: null, error: null }
    }))

    try {
      const result = await serviceApi.syncMigrations(serviceCode)
      setSyncState((prev) => ({
        ...prev,
        [serviceCode]: { loading: false, result, error: null }
      }))

      if (result.failedCount === 0) {
        showToast({
          message: `Migrations synced for '${serviceCode}': ${result.successCount} succeeded.`,
          type: "success"
        })
      } else {
        showToast({
          message: `Sync completed with ${result.failedCount} failure(s). Click "View Results" for details.`,
          type: "info",
          duration: 5000
        })
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to sync migrations"
      setSyncState((prev) => ({
        ...prev,
        [serviceCode]: { loading: false, result: null, error: msg }
      }))
      handleApiError(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Results modal */}
      {resultModal && <SyncResultModal serviceCode={resultModal.serviceCode} result={resultModal.result} onClose={() => setResultModal(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage platform services · sync pending migrations across all tenants</p>
        </div>
        <button onClick={refetch} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="text-red-800 text-sm">{error}</p>
            <button onClick={refetch} className="mt-1 text-sm text-red-700 font-medium hover:text-red-900 underline">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Service cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500 text-sm">No services found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const state = syncState[service.code]
            return (
              <ServiceCard
                key={service.code}
                service={service}
                syncLoading={state?.loading ?? false}
                syncResult={state?.result ?? null}
                syncError={state?.error ?? null}
                onSync={() => handleSyncMigrations(service.code)}
                onViewResults={() => state?.result && setResultModal({ serviceCode: service.code, result: state.result })}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Service Card
// ─────────────────────────────────────────────────────────────────────────────

interface ServiceCardProps {
  service: Service
  syncLoading: boolean
  syncResult: SyncMigrationsResponse | null
  syncError: string | null
  onSync: () => void
  onViewResults: () => void
}

function ServiceCard({ service, syncLoading, syncResult, syncError, onSync, onViewResults }: ServiceCardProps) {
  const hasFailed = syncResult && syncResult.failedCount > 0
  const allSucceeded = syncResult && syncResult.failedCount === 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Card header */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold bg-gray-100 text-gray-700 border border-gray-200">{service.code}</span>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-1">{service.name}</h3>
        {service.description && <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>}

        {/* Dependencies */}
        {service.dependencies && service.dependencies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {service.dependencies.map((dep) => (
              <span key={dep} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                {dep}
              </span>
            ))}
          </div>
        )}

        {/* Sync result summary */}
        {syncResult && (
          <div className={`mt-3 p-2.5 rounded-lg text-xs flex items-start gap-2 ${allSucceeded ? "bg-green-50 border border-green-200 text-green-800" : "bg-yellow-50 border border-yellow-200 text-yellow-800"}`}>
            {allSucceeded ? (
              <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>
              {syncResult.successCount} succeeded · {syncResult.failedCount} failed · {syncResult.totalTenants} total tenants
            </span>
          </div>
        )}

        {/* Sync error */}
        {syncError && (
          <div className="mt-3 p-2.5 rounded-lg text-xs flex items-start gap-2 bg-red-50 border border-red-200 text-red-800">
            <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{syncError}</span>
          </div>
        )}
      </div>

      {/* Card footer actions */}
      <div className="px-5 pb-5 flex gap-2">
        <button
          onClick={onSync}
          disabled={syncLoading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {syncLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Syncing…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Sync Migrations
            </>
          )}
        </button>

        {syncResult && (
          <button onClick={onViewResults} className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Results
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton card
// ─────────────────────────────────────────────────────────────────────────────

function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-gray-200" />
        <div className="h-5 w-20 rounded bg-gray-200" />
      </div>
      <div className="h-4 w-2/3 rounded bg-gray-200" />
      <div className="h-3 w-full rounded bg-gray-100" />
      <div className="h-3 w-5/6 rounded bg-gray-100" />
      <div className="h-9 rounded-lg bg-gray-200 mt-4" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sync Result Modal
// ─────────────────────────────────────────────────────────────────────────────

interface SyncResultModalProps {
  serviceCode: string
  result: SyncMigrationsResponse
  onClose: () => void
}

function SyncResultModal({ serviceCode, result, onClose }: SyncResultModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Migration Sync Results</h2>
            <p className="text-sm text-gray-500 mt-0.5 font-mono">{serviceCode}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <StatBadge label="Total" value={result.totalTenants} color="gray" />
          <StatBadge label="Succeeded" value={result.successCount} color="green" />
          <StatBadge label="Failed" value={result.failedCount} color={result.failedCount > 0 ? "red" : "gray"} />
        </div>

        {/* Summary message */}
        <div className="px-6 py-3 border-b border-gray-100">
          <p className="text-sm text-gray-700">{result.message}</p>
        </div>

        {/* Per-tenant results */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2">
          {result.results.map((r) => (
            <TenantResultRow key={r.tenantCode} result={r} />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

interface StatBadgeProps {
  label: string
  value: number
  color: "gray" | "green" | "red"
}

function StatBadge({ label, value, color }: StatBadgeProps) {
  const colorClasses = {
    gray: "text-gray-800 bg-white border-gray-200",
    green: "text-green-800 bg-green-50 border-green-200",
    red: "text-red-800 bg-red-50 border-red-200"
  }
  return (
    <div className={`rounded-lg border p-3 text-center ${colorClasses[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-0.5 font-medium">{label}</p>
    </div>
  )
}

interface TenantResultRowProps {
  result: SyncMigrationsTenantResult
}

function TenantResultRow({ result }: TenantResultRowProps) {
  const isSuccess = result.status === "success"
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${isSuccess ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
      {isSuccess ? (
        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold font-mono ${isSuccess ? "text-green-800" : "text-red-800"}`}>{result.tenantCode}</p>
        {result.error && <p className="text-xs text-red-700 mt-0.5">{result.error}</p>}
      </div>
      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${isSuccess ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{result.status}</span>
    </div>
  )
}
