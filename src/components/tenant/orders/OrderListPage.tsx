"use client"

import { useOrders } from "@/hooks/useOrders"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  FAILED: "bg-gray-100 text-gray-600"
}

/**
 * Tenant Order List Page — shows the user's orders.
 * Displays a success banner when redirected from payment (?success=true).
 */
export default function OrderListPage() {
  const { orders, loading, error, refetch } = useOrders()
  const params = useSearchParams()
  const paymentSuccess = params.get("success") === "true"

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 text-sm mt-1">View your purchase history</p>
      </div>

      {/* Payment success banner */}
      {paymentSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-green-800">Payment Successful!</p>
            <p className="text-sm text-green-600">Your order is being processed. It will appear here shortly.</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-red-800 text-sm">{error}</p>
            <button onClick={refetch} className="mt-1 text-sm text-red-700 font-medium underline">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Orders list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-sm mb-4">No orders yet.</p>
            <Link href="/products" className="text-purple-600 font-medium text-sm hover:text-purple-700">
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-gray-900">{order.id.slice(0, 8)}…</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>{order.getStatusLabel()}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {order.createdAt ? order.createdAt.toLocaleDateString() : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-purple-600">{order.getFormattedTotal()}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
