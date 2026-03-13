"use client"

import { useState } from "react"
import { useCart } from "@/hooks/useCart"
import CartItemRow from "@/components/tenant/cart/CartItemRow"
import CartSummary from "@/components/tenant/cart/CartSummary"
import { showToast } from "@/lib/utils"
import Link from "next/link"

/**
 * Tenant Cart Page — full cart view with item management and checkout CTA.
 */
export default function CartPage() {
  const { cart, loading, error, refetch, updateItem, removeItem, clearCart } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    await updateItem(itemId, { quantity })
  }

  const handleClearCart = async () => {
    try {
      setIsClearing(true)
      await clearCart()
      showToast({ message: "Cart cleared", type: "success" })
    } catch {
      showToast({ message: "Failed to clear cart", type: "error" })
    } finally {
      setIsClearing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-64 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
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
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        {cart && !cart.isEmpty() && (
          <p className="text-gray-500 text-sm mt-1">
            {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in your cart
          </p>
        )}
      </div>

      {!cart || cart.isEmpty() ? (
        /* Empty state */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">Add products or bookings to get started.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm">
              Browse Products
            </Link>
            <Link href="/bookings" className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
              View Bookings
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} onQuantityChange={handleQuantityChange} onRemove={removeItem} />
            ))}
          </div>

          {/* Summary Panel */}
          <div>
            <CartSummary cart={cart} onClear={handleClearCart} isClearing={isClearing} />
          </div>
        </div>
      )}
    </div>
  )
}
