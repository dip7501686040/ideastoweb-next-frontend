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

interface OrderDetailsPageProps {
  orderId: string
}

/**
 * Tenant Order Details Page — shows full order summary with items and payment info.
 */
export default function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
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
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Orders
      </Link>

      {/* Status banner for confirmed orders */}
      {order.status === "CONFIRMED" && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-green-800">Order Confirmed!</p>
            <p className="text-sm text-green-600">Thank you for your purchase.</p>
          </div>
        </div>
      )}

      {/* Order Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order Summary</h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{order.id}</p>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>{order.getStatusLabel()}</span>
        </div>

        {/* Items */}
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Items</p>
          {order.items.length === 0 ? (
            <p className="text-sm text-gray-400">No items</p>
          ) : (
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {item.itemType === "product" ? "P" : "B"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{item.itemType}</p>
                      <p className="text-xs text-gray-400 font-mono">{item.itemId.slice(0, 8)}…</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${item.getSubtotal().toFixed(2)}</p>
                    <p className="text-xs text-gray-400">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-purple-600">{order.getFormattedTotal()}</span>
        </div>

        {/* Order info */}
        <div className="px-6 py-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Payment ID</p>
            <p className="text-sm text-gray-700 font-mono">{order.paymentId?.slice(0, 12)}…</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
            <p className="text-sm text-gray-700">{order.createdAt ? order.createdAt.toLocaleDateString() : "—"}</p>
          </div>
          {order.metadata?.providerPaymentId && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Stripe Reference</p>
              <p className="text-sm text-gray-500 font-mono">{order.metadata.providerPaymentId}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="px-6 py-4 border-t border-gray-100">
          <Link href="/products" className="block w-full text-center py-2.5 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 text-sm transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
