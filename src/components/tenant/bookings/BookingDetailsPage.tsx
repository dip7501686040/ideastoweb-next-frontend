"use client"

import { useState, useEffect } from "react"
import { bookingApi } from "@/api/BookingApi"
import { cartApi } from "@/api/CartApi"
import { Booking } from "@/models/Booking"
import { showToast, handleApiError } from "@/lib/utils"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200"
}

interface BookingDetailsPageProps {
  bookingId: string
}

/**
 * Tenant Booking Details Page — shows a single booking with actions.
 */
export default function BookingDetailsPage({ bookingId }: BookingDetailsPageProps) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await bookingApi.getBookingById(bookingId)
        setBooking(data)
      } catch (err: any) {
        setError(err.message || "Failed to load booking")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [bookingId])

  const handleAddToCart = async () => {
    if (!booking) return
    try {
      setAddingToCart(true)
      await cartApi.addItem({
        itemType: "booking",
        itemId: booking.id,
        quantity: booking.quantity,
        price: booking.amount,
        metadata: {
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString()
        }
      })
      showToast({ message: "Booking added to cart", type: "success" })
    } catch (err: any) {
      handleApiError(err, "Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      </div>
    )
  }

  if (!booking) return null

  const confirmed = booking.isConfirmed()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link href="/bookings" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Bookings
      </Link>

      {/* Confirmation banner */}
      {confirmed && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium text-green-800">Booking Confirmed!</p>
            <p className="text-sm text-green-600">Your payment has been processed and this booking is confirmed.</p>
          </div>
        </div>
      )}

      {/* Booking Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{booking.metadata?.guestName ?? "Booking"}</h1>
          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>{booking.getStatusLabel()}</span>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoRow label="Booking ID" value={<span className="font-mono text-xs text-gray-500">{booking.id}</span>} />
          <InfoRow label="Provider" value={<span className="font-mono text-xs text-gray-500">{booking.serviceProviderId}</span>} />
          <InfoRow label="Guest Name" value={booking.metadata?.guestName ?? "—"} />
          {booking.metadata?.address && <InfoRow label="Address" value={String(booking.metadata.address)} />}
          <InfoRow label="Start" value={`${booking.startTime.toLocaleDateString()} ${booking.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`} />
          <InfoRow label="End" value={`${booking.endTime.toLocaleDateString()} ${booking.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`} />
          <InfoRow label="Amount" value={<span className="font-bold text-purple-600">{booking.getFormattedAmount()}</span>} />
          <InfoRow label="Quantity" value={String(booking.quantity)} />
          {booking.notes && <InfoRow label="Notes" value={booking.notes} />}
          {booking.createdAt && <InfoRow label="Created" value={booking.createdAt.toLocaleDateString()} />}
        </div>

        {/* Metadata */}
        {booking.metadata && Object.keys(booking.metadata).length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Additional Info</p>
            <div className="space-y-1">
              {Object.entries(booking.metadata).map(([key, val]) => (
                <div key={key} className="flex gap-2 text-sm">
                  <span className="font-medium text-gray-700 capitalize">{key}:</span>
                  <span className="text-gray-600">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {booking.status === "PENDING" && (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 py-2.5 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2 transition-colors"
            >
              {addingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Adding…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <Link href="/cart" className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm text-center transition-colors">
              View Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-sm text-gray-900">{value}</div>
    </div>
  )
}
