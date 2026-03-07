"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { TokenManager } from "@/lib/tokenManager"

// ── Types ─────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  primaryImagePublicId?: string
  inStock: boolean
}

interface ProductApiItem {
  id: string
  name: string
  description?: string
  price: number
  category?: string
  primaryImagePublicId?: string
  inStock?: boolean
}

interface TenantProductGridProps {
  tenantCode: string
}

// ── Cloudinary helper ─────────────────────────────────────────────────────────

function getProductThumbnail(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_300,h_300,c_fill,q_auto,f_auto/${publicId}`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TenantProductGrid({ tenantCode }: TenantProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError("")
      const token = TokenManager.getAccessToken()
      const res = await fetch("http://localhost:8000/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include"
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as any).message || "Failed to fetch products")
      }

      const json: ProductApiItem[] = await res.json()
      const mapped: Product[] = (Array.isArray(json) ? json : []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? "",
        price: p.price,
        category: p.category ?? "Uncategorized",
        primaryImagePublicId: p.primaryImagePublicId,
        inStock: p.inStock ?? true
      }))
      setProducts(mapped)
    } catch (err: any) {
      setError(err.message || "Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">Manage your product catalog for {tenantCode}</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search products..."
              />
            </div>
          </div>

          <div className="sm:w-48">
            <label htmlFor="category" className="sr-only">
              Filter by category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">{searchTerm || selectedCategory !== "all" ? "Try adjusting your search or filter criteria" : "Get started by adding your first product"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 bg-gray-200">
                {product.primaryImagePublicId ? (
                  <Image src={getProductThumbnail(product.primaryImagePublicId)} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                    <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">{product.name}</h3>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600">₹{product.price}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 bg-purple-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </button>
                  <button className="inline-flex items-center justify-center gap-1.5 bg-gray-900 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
