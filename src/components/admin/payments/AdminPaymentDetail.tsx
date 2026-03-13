"use client"

import { useState, useEffect } from "react"
import { paymentApi } from "@/api/PaymentApi"
import { Payment } from "@/models/Payment"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  FAILED: "bg-red-100 text-red-700 border-red-200",
  REFUNDED: "bg-blue-100 text-blue-700 border-blue-200"
}

interface AdminPaymentDetailProps {
  paymentId: string
}

/**
 * Admin Payment Detail — view a single payment record.
 */
export default function AdminPaymentDetail({ paymentId }: AdminPaymentDetailProps) {
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await paymentApi.getPaymentById(paymentId)
        setPayment(data)
      } catch (err: any) {
        setError(err.message || "Failed to load payment")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [paymentId])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
  }

  if (!payment) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/payments" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Payments
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">{payment.id}</p>
        </div>
        <span className={`text-sm font-medium px-3 py-1.5 rounded-full border ${STATUS_COLORS[payment.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>{payment.getStatusLabel()}</span>
      </div>

      {/* Payment card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Payment Info</h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <InfoItem label="Payment ID" value={<span className="font-mono text-xs">{payment.id}</span>} />
          <InfoItem label="User ID" value={<span className="font-mono text-xs">{payment.userId}</span>} />
          <InfoItem label="Amount" value={<span className="text-lg font-bold text-purple-600">{payment.getFormattedAmount()}</span>} />
          <InfoItem label="Currency" value={payment.currency.toUpperCase()} />
          <InfoItem label="Reference ID" value={<span className="font-mono text-xs">{payment.referenceId}</span>} />
          {payment.providerPaymentId && <InfoItem label="Stripe Payment ID" value={<span className="font-mono text-xs">{payment.providerPaymentId}</span>} />}
          <InfoItem label="Created" value={payment.createdAt ? payment.createdAt.toLocaleString() : "—"} />
          <InfoItem label="Updated" value={payment.updatedAt ? payment.updatedAt.toLocaleString() : "—"} />
        </div>

        {payment.metadata && Object.keys(payment.metadata).length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Metadata</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(payment.metadata).map(([key, val]) => (
                <InfoItem key={key} label={key} value={String(val)} />
              ))}
            </div>
          </div>
        )}

        {/* Stripe note */}
        {payment.isCompleted() && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-2 text-sm text-green-700 bg-green-50">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Payment completed and confirmed via Stripe webhook.
          </div>
        )}
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-sm text-gray-900">{value}</div>
    </div>
  )
}
