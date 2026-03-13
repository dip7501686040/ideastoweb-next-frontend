"use client"

import { useState, useEffect } from "react"
import { productApi } from "@/api/ProductApi"
import { cartApi } from "@/api/CartApi"
import { Product } from "@/models/Product"
import { showToast, handleApiError } from "@/lib/utils"
import Link from "next/link"

interface ProductDetailsPageProps {
  productId: string
}

/**
 * Tenant Product Details Page — shows product info and add-to-cart action.
 */
export default function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await productApi.getProductById(productId)
        setProduct(data)
      } catch (err: any) {
        setError(err.message || "Failed to load product")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [productId])

  const handleAddToCart = async () => {
    if (!product) return
    try {
      setAddingToCart(true)
      await cartApi.addItem({
        itemType: "product",
        itemId: product.id,
        quantity,
        price: product.price,
        metadata: { name: product.name }
      })
      showToast({ message: `${product.name} added to cart`, type: "success" })
    } catch (err: any) {
      handleApiError(err, "Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-7 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Products
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product visual */}
          <div className="aspect-square md:aspect-auto bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-8">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-5xl font-bold shadow-lg">{product.name.charAt(0).toUpperCase()}</div>
          </div>

          {/* Product details */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-purple-600 mb-4">{product.getFormattedPrice()}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description || "No description available."}</p>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Qty:</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-500">= ${(product.price * quantity).toFixed(2)}</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full py-3 px-6 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Adding…
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              <Link href="/cart" className="block w-full text-center py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm transition-colors">
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
