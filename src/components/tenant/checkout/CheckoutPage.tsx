"use client"

import { useState } from "react"
import { useCart } from "@/hooks/useCart"
import { checkoutApi } from "@/api/CheckoutApi"
import { handleApiError } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Link from "next/link"

/**
 * Tenant Checkout Page.
 * Fetches the active cart, shows summary, and initiates Stripe checkout on submit.
 */
export default function CheckoutPage() {
  const { cart, loading, error, refetch } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async () => {
    if (!cart || cart.isEmpty()) return

    try {
      setIsSubmitting(true)
      setCheckoutError(null)
      const result = await checkoutApi.checkout({ cartId: cart.id })
      // Navigate to payment page with the clientSecret
      router.push(`/payment?clientSecret=${encodeURIComponent(result.clientSecret)}&paymentId=${result.paymentId}`)
    } catch (err: any) {
      setCheckoutError(err.message || "Checkout failed. Please try again.")
      handleApiError(err, "Checkout failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="h-8 bg-gray-200 rounded w-40 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6 space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 h-48 animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
          <button onClick={refetch} className="mt-2 text-sm text-red-700 font-medium underline">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!cart || cart.isEmpty()) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-6">Add items before checking out.</p>
        <Link href="/products" className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 text-sm">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Cart
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Order Review */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Order Review</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {cart.items.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">{item.itemType === "product" ? "P" : "B"}</div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.name || item.metadata?.name || item.itemId}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {item.itemType} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">${item.getSubtotal().toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + CTA */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="font-semibold text-gray-900 mb-4">Summary</h2>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-gray-400">Calculated at payment</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total</span>
                <span className="text-xl font-bold text-purple-600">${cart.getTotal().toFixed(2)}</span>
              </div>
            </div>

            {checkoutError && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{checkoutError}</div>}

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Processing…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
