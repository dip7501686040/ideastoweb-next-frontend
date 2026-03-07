"use client"

import { useState } from "react"
import { Product } from "@/models/Product"
import { showToast, handleApiError } from "@/lib/utils"
import { useProducts } from "@/hooks/useProducts"
import ProductImageManager from "@/components/admin/products/ProductImageManager"

/**
 * 🛍️ PRODUCTS MANAGEMENT - Tenant Admin
 * Full CRUD: list, create, edit, delete products.
 * Products are tenant-scoped; the JWT carries the tenantId context.
 */
export default function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  // ── Modals ────────────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [imagingProduct, setImagingProduct] = useState<Product | null>(null)

  // ── Data ──────────────────────────────────────────────────────────────────
  const { products, loading, error, refetch, createProduct, updateProduct, deleteProduct } = useProducts()

  const filtered = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSaved = async (name: string, description: string, price: number) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, { name, description, price })
        showToast({ message: "Product updated", type: "success" })
      } else {
        await createProduct({ name, description, price })
        showToast({ message: "Product created", type: "success" })
      }
      setShowForm(false)
      setEditingProduct(null)
    } catch (err: any) {
      handleApiError(err)
      throw err // re-throw so modal keeps its error state
    }
  }

  const handleDeleted = async (id: string) => {
    try {
      await deleteProduct(id)
      setDeletingProduct(null)
      showToast({ message: "Product deleted", type: "success" })
    } catch (err: any) {
      handleApiError(err)
      throw err
    }
  }

  const openCreate = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
          onSaved={handleSaved}
        />
      )}
      {deletingProduct && <DeleteModal product={deletingProduct} onClose={() => setDeletingProduct(null)} onDeleted={handleDeleted} />}
      {imagingProduct && <ProductImageManager productId={imagingProduct.id} productName={imagingProduct.name} onClose={() => setImagingProduct(null)} />}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your tenant product catalog</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="text-red-800 text-sm">{error}</p>
            <button onClick={refetch} className="mt-1 text-sm text-red-700 font-medium hover:text-red-900 underline">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-sm"
          />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3" />
            Loading products…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 text-sm">{searchTerm ? "No products match your search." : "No products yet. Add your first one!"}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Updated By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-purple-600">{product.getFormattedPrice()}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.createdBy ?? <span className="text-gray-400">—</span>}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.updatedBy ?? <span className="text-gray-400">—</span>}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : <span className="text-gray-400">—</span>}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setImagingProduct(product)} className="text-blue-600 hover:text-blue-700 font-medium text-sm mr-4">
                      Images
                    </button>
                    <button onClick={() => openEdit(product)} className="text-purple-600 hover:text-purple-700 font-medium text-sm mr-4">
                      Edit
                    </button>
                    <button onClick={() => setDeletingProduct(product)} className="text-red-600 hover:text-red-700 font-medium text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer count */}
      {!loading && products.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} of {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}

// ── Create / Edit modal ──────────────────────────────────────────────────────
interface ProductFormModalProps {
  product: Product | null
  onClose: () => void
  onSaved: (name: string, description: string, price: number) => Promise<void>
}

function ProductFormModal({ product, onClose, onSaved }: ProductFormModalProps) {
  const [name, setName] = useState(product?.name ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(product ? String(product.price) : "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedPrice = parseFloat(price)
    if (!name.trim()) return setError("Product name is required.")
    if (!description.trim()) return setError("Description is required.")
    if (isNaN(parsedPrice) || parsedPrice < 0) return setError("Enter a valid non-negative price.")

    setSaving(true)
    setError("")
    try {
      await onSaved(name.trim(), description.trim(), parsedPrice)
    } catch (err: any) {
      setError(err.message || "Failed to save product.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900">{product ? "Edit Product" : "New Product"}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="e.g. Premium Widget"
              autoFocus
              required
            />
            <p className="mt-1 text-xs text-gray-400">Must be unique within this tenant.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 resize-none"
              placeholder="e.g. A premium quality widget for professional use."
              required
            />
            <p className="mt-1 text-xs text-gray-400">Brief description shown to customers.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (Rs) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="0.00"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Stored as float/double precision (INR).</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 transition-colors">
              {saving && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {product ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete confirmation modal ────────────────────────────────────────────────
interface DeleteModalProps {
  product: Product
  onClose: () => void
  onDeleted: (id: string) => Promise<void>
}

function DeleteModal({ product, onClose, onDeleted }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setDeleting(true)
    setError("")
    try {
      await onDeleted(product.id)
    } catch (err: any) {
      setError(err.message || "Failed to delete product.")
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Delete product</h2>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete <span className="font-semibold">{product.name}</span>?
        </p>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-md">{error}</div>}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={deleting} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-colors">
            {deleting && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
