"use client"

import { useState, useEffect } from "react"
import { orderApi } from "@/api/OrderApi"
import { Order } from "@/models/Order"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  FAILED: "bg-gray-100 text-gray-600 border-gray-200"
}

interface AdminOrderDetailProps {
  orderId: string
}

/**
 * Admin Order Detail — view full order information.
 */
export default function AdminOrderDetail({ orderId }: AdminOrderDetailProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await orderApi.getOrderById(orderId)
        setOrder(data)
      } catch (err: any) {
        setError(err.message || "Failed to load order")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [orderId])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
  }

  if (!order) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">{order.id}</p>
        </div>
        <span className={`text-sm font-medium px-3 py-1.5 rounded-full border ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>{order.getStatusLabel()}</span>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Order Info</h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <InfoItem label="Order ID" value={<span className="font-mono text-xs">{order.id}</span>} />
          <InfoItem label="User ID" value={<span className="font-mono text-xs">{order.userId}</span>} />
          <InfoItem label="Payment ID" value={<span className="font-mono text-xs">{order.paymentId}</span>} />
          <InfoItem label="Total" value={<span className="font-bold text-purple-600 text-lg">{order.getFormattedTotal()}</span>} />
          <InfoItem label="Currency" value={order.currency.toUpperCase()} />
          <InfoItem label="Date" value={order.createdAt ? order.createdAt.toLocaleDateString() : "—"} />
          {order.metadata?.providerPaymentId && <InfoItem label="Stripe Payment ID" value={<span className="font-mono text-xs">{order.metadata.providerPaymentId}</span>} />}
          {order.metadata?.referenceId && <InfoItem label="Reference ID" value={<span className="font-mono text-xs">{order.metadata.referenceId}</span>} />}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Order Items ({order.items.length})</h2>
        </div>
        {order.items.length === 0 ? (
          <p className="px-6 py-4 text-sm text-gray-400">No items</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <span className="capitalize text-sm text-gray-900">{item.itemType}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="font-mono text-xs text-gray-500">{item.itemId.slice(0, 12)}…</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right font-semibold text-purple-600">${item.getSubtotal().toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-purple-600">{order.getFormattedTotal()}</span>
        </div>
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
