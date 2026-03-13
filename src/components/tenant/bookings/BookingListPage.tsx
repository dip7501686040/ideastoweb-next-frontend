"use client"

import { useState } from "react"
import { useBookings } from "@/hooks/useBookings"
import { showToast, handleApiError } from "@/lib/utils"
import { Booking, CreateBookingRequest } from "@/models/Booking"
import { cartApi } from "@/api/CartApi"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700"
}

/**
 * Tenant Booking List Page — shows the user's bookings and allows creating new ones.
 */
export default function BookingListPage() {
  const { bookings, loading, error, refetch, createBooking, cancelBooking } = useBookings()
  const [showNewForm, setShowNewForm] = useState(false)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleAddToCart = async (booking: Booking) => {
    try {
      setAddingToCart(booking.id)
      await cartApi.addItem({
        itemType: "booking",
        itemId: booking.id,
        quantity: booking.quantity,
        price: booking.price,
        metadata: { serviceType: booking.serviceType, startTime: booking.startTime.toISOString(), endTime: booking.endTime.toISOString() }
      })
      showToast({ message: "Booking added to cart", type: "success" })
    } catch (err: any) {
      handleApiError(err, "Failed to add to cart")
    } finally {
      setAddingToCart(null)
    }
  }

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id)
      showToast({ message: "Booking cancelled", type: "success" })
    } catch (err: any) {
      handleApiError(err, "Failed to cancel booking")
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your service bookings</p>
        </div>
        <button onClick={() => setShowNewForm(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2 text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Booking
        </button>
      </div>

      {/* New Booking Modal */}
      {showNewForm && (
        <NewBookingModal
          onClose={() => setShowNewForm(false)}
          onCreated={async (data) => {
            const created = await createBooking(data)
            setShowNewForm(false)
            showToast({ message: "Booking created", type: "success" })
            return created
          }}
        />
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

      {/* Bookings list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading bookings…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm">No bookings yet. Create your first one!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 capitalize">{booking.serviceType}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600"}`}>{booking.getStatusLabel()}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {booking.startTime.toLocaleDateString()} {booking.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} →{" "}
                    {booking.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-sm font-medium text-purple-600 mt-1">
                    {booking.getFormattedPrice()} × {booking.quantity}
                  </p>
                  {booking.notes && <p className="text-xs text-gray-400 mt-1">{booking.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/bookings/${booking.id}`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View
                  </Link>
                  {booking.status === "PENDING" && (
                    <>
                      <button onClick={() => handleAddToCart(booking)} disabled={addingToCart === booking.id} className="text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50">
                        {addingToCart === booking.id ? "Adding…" : "Add to Cart"}
                      </button>
                      <button onClick={() => handleCancel(booking.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── New Booking Modal ──────────────────────────────────────────────────────────

function NewBookingModal({ onClose, onCreated }: { onClose: () => void; onCreated: (data: CreateBookingRequest) => Promise<Booking> }) {
  const [form, setForm] = useState({
    serviceType: "",
    resourceId: "",
    startTime: "",
    endTime: "",
    price: "",
    currency: "USD",
    quantity: "1",
    notes: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.serviceType || !form.resourceId || !form.startTime || !form.endTime || !form.price) {
      setFormError("Please fill in all required fields.")
      return
    }
    try {
      setSubmitting(true)
      setFormError(null)
      await onCreated({
        serviceType: form.serviceType,
        resourceId: form.resourceId,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        price: parseFloat(form.price),
        currency: form.currency,
        quantity: parseInt(form.quantity, 10),
        notes: form.notes || undefined
      })
    } catch (err: any) {
      setFormError(err.message || "Failed to create booking")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">New Booking</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{formError}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
            <input
              type="text"
              value={form.serviceType}
              onChange={(e) => setForm((f) => ({ ...f, serviceType: e.target.value }))}
              placeholder="e.g. restaurant, spa, hotel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource ID *</label>
            <input
              type="text"
              value={form.resourceId}
              onChange={(e) => setForm((f) => ({ ...f, resourceId: e.target.value }))}
              placeholder="e.g. table-001"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              min="1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder="Any special requests…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Creating…
                </>
              ) : (
                "Create Booking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
