"use client"

import { Cart } from "@/models/Cart"
import Link from "next/link"

interface CartSummaryProps {
  cart: Cart
  onClear: () => Promise<void>
  isClearing: boolean
}

/**
 * Order summary panel on the cart page.
 */
export default function CartSummary({ cart, onClear, isClearing }: CartSummaryProps) {
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

      {/* Item breakdown */}
      <div className="space-y-2 mb-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600">
            <span className="truncate pr-2">
              {item.name || item.metadata?.name || item.itemId} × {item.quantity}
            </span>
            <span className="whitespace-nowrap">${item.getSubtotal().toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">
            Total ({itemCount} item{itemCount !== 1 ? "s" : ""})
          </span>
          <span className="text-xl font-bold text-purple-600">${cart.getTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Proceed to Checkout */}
      <Link href="/checkout" className="block w-full text-center py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
        Proceed to Checkout
      </Link>

      {/* Clear cart */}
      <button
        onClick={onClear}
        disabled={isClearing || cart.isEmpty()}
        className="mt-3 w-full text-center py-2 px-4 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isClearing ? "Clearing…" : "Clear Cart"}
      </button>

      <Link href="/products" className="block mt-3 text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
        ← Continue Shopping
      </Link>
    </div>
  )
}
