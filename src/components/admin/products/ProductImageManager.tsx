"use client"

import { useEffect, useRef } from "react"
import { ProductImage } from "@/api/ProductImageApi"
import { useProductImages } from "@/hooks/useProductImages"
import { showToast, handleApiError } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductImageManagerProps {
  productId: string
  productName: string
  onClose: () => void
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProductImageManager({ productId, productName, onClose }: ProductImageManagerProps) {
  const { images, loading, uploading, error, refetch, upload, remove, setPrimary } = useProductImages(productId)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch images when mounted
  useEffect(() => {
    refetch()
  }, [refetch])

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so the same file can be re-uploaded if needed
    e.target.value = ""
    try {
      await upload(file)
      showToast({ message: "Image uploaded successfully", type: "success" })
    } catch (err: any) {
      handleApiError(err)
    }
  }

  const handleDelete = async (image: ProductImage) => {
    try {
      await remove(image.id)
      showToast({ message: "Image deleted", type: "success" })
    } catch (err: any) {
      handleApiError(err)
    }
  }

  const handleSetPrimary = async (image: ProductImage) => {
    try {
      await setPrimary(image.id)
      showToast({ message: "Primary image updated", type: "success" })
    } catch (err: any) {
      handleApiError(err)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Drawer / Modal panel */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Product Images</h2>
            <p className="text-sm text-gray-500 mt-0.5 truncate max-w-xs">{productName}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Image
                </>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {/* Close button */}
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Error Banner ──────────────────────────────────────────────── */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-2">
            <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ImageSkeleton key={i} />
              ))}
            </div>
          ) : images.length === 0 ? (
            <EmptyState onUpload={() => fileInputRef.current?.click()} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <ImageCard key={image.id} image={image} onDelete={() => handleDelete(image)} onSetPrimary={() => handleSetPrimary(image)} />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer count ─────────────────────────────────────────────── */}
        {!loading && images.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 text-right">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Image Card ────────────────────────────────────────────────────────────────

interface ImageCardProps {
  image: ProductImage
  onDelete: () => void
  onSetPrimary: () => void
}

function ImageCard({ image, onDelete, onSetPrimary }: ImageCardProps) {
  return (
    <div className={`relative group rounded-xl overflow-hidden border-2 transition-colors ${image.isPrimary ? "border-green-500" : "border-gray-200 hover:border-gray-300"}`}>
      {/* Thumbnail */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img src={image.thumbnailUrl} alt="Product image" className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" loading="lazy" />
      </div>

      {/* Primary badge */}
      {image.isPrimary && (
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Primary
        </span>
      )}

      {/* Action overlay (shown on hover) */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-between p-2 gap-2 opacity-0 group-hover:opacity-100">
        {/* Set primary button — hidden when already primary */}
        {!image.isPrimary && (
          <button onClick={onSetPrimary} title="Set as primary" className="flex-1 text-[11px] font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg py-1.5 transition-colors">
            Set Primary
          </button>
        )}

        {/* Delete button */}
        <button onClick={onDelete} title="Delete image" className="flex-shrink-0 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ImageSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border-2 border-gray-100">
      <div className="aspect-square bg-gray-200 animate-pulse" />
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="w-14 h-14 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p className="text-gray-600 font-medium mb-1">No images yet</p>
      <p className="text-gray-400 text-sm mb-4">Upload the first image for this product.</p>
      <button onClick={onUpload} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Image
      </button>
    </div>
  )
}
