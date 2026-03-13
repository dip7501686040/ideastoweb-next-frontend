"use client"

import { useState, useEffect } from "react"
import { bookingApi } from "@/api/BookingApi"
import { Booking } from "@/models/Booking"
import { handleApiError, showToast } from "@/lib/utils"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200"
}

interface AdminBookingDetailProps {
  bookingId: string
}

/**
 * Admin Booking Detail — view and cancel a specific booking.
 */
export default function AdminBookingDetail({ bookingId }: AdminBookingDetailProps) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

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

  const handleCancel = async () => {
    if (!booking) return
    try {
      setCancelling(true)
      await bookingApi.cancelBooking(booking.id)
      showToast({ message: "Booking cancelled", type: "success" })
      const updated = await bookingApi.getBookingById(bookingId)
      setBooking(updated)
    } catch (err: any) {
      handleApiError(err, "Failed to cancel booking")
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
  }

  if (!booking) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/bookings" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Bookings
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{booking.serviceType} Booking</h1>
        </div>
        <span className={`text-sm font-medium px-3 py-1.5 rounded-full border ${STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>{booking.getStatusLabel()}</span>
      </div>

      {/* Details card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Booking Details</h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <InfoItem label="Booking ID" value={<span className="font-mono text-xs">{booking.id}</span>} />
          <InfoItem label="User ID" value={<span className="font-mono text-xs">{booking.userId || "—"}</span>} />
          <InfoItem label="Resource ID" value={booking.resourceId} />
          <InfoItem label="Service Type" value={<span className="capitalize">{booking.serviceType}</span>} />
          <InfoItem label="Start Time" value={`${booking.startTime.toLocaleDateString()} ${booking.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`} />
          <InfoItem label="End Time" value={`${booking.endTime.toLocaleDateString()} ${booking.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`} />
          <InfoItem label="Price" value={<span className="font-bold text-purple-600">{booking.getFormattedPrice()}</span>} />
          <InfoItem label="Quantity" value={String(booking.quantity)} />
          <InfoItem label="Created" value={booking.createdAt ? booking.createdAt.toLocaleDateString() : "—"} />
          {booking.notes && <InfoItem label="Notes" value={booking.notes} />}
        </div>

        {booking.metadata && Object.keys(booking.metadata).length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Metadata</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(booking.metadata).map(([key, val]) => (
                <InfoItem key={key} label={key} value={String(val)} />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {booking.status === "PENDING" && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button onClick={handleCancel} disabled={cancelling} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-colors">
              {cancelling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Cancelling…
                </>
              ) : (
                "Cancel Booking"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-sm text-gray-900">{value}</div>
    </div>
  )
}
