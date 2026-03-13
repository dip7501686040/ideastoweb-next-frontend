"use client"

import { CartItem } from "@/models/Cart"
import { showToast } from "@/lib/utils"

interface CartItemRowProps {
  item: CartItem
  onQuantityChange: (itemId: string, quantity: number) => Promise<void>
  onRemove: (itemId: string) => Promise<void>
}

/**
 * Single row in the cart for a product or booking item.
 */
export default function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return
    try {
      await onQuantityChange(item.id, newQty)
    } catch {
      showToast({ message: "Failed to update quantity", type: "error" })
    }
  }

  const handleRemove = async () => {
    try {
      await onRemove(item.id)
      showToast({ message: "Item removed from cart", type: "success" })
    } catch {
      showToast({ message: "Failed to remove item", type: "error" })
    }
  }

  const typeLabel = item.itemType === "product" ? "Product" : "Booking"
  const typeColor = item.itemType === "product" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
  const displayName = item.name || item.metadata?.name || item.itemId

  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-0">
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">{item.itemType === "product" ? "P" : "B"}</div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-gray-900 truncate">{displayName}</p>
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${typeColor}`}>{typeLabel}</span>
          </div>
          <p className="font-semibold text-gray-900 text-right whitespace-nowrap">${item.getSubtotal().toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.quantity + 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <span className="text-xs text-gray-400 ml-1">${item.price.toFixed(2)} each</span>
          </div>

          {/* Remove */}
          <button onClick={handleRemove} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
