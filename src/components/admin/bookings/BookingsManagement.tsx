"use client"

import { useState } from "react"
import { useBookings } from "@/hooks/useBookings"
import { showToast, handleApiError } from "@/lib/utils"
import { Booking } from "@/models/Booking"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700"
}

/**
 * Admin Bookings Management — view and manage all tenant bookings.
 */
export default function BookingsManagement() {
  const { bookings, loading, error, refetch, cancelBooking } = useBookings({ adminMode: true })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.serviceProviderId.toLowerCase().includes(searchTerm.toLowerCase()) || (b.metadata?.guestName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCancel = async (booking: Booking) => {
    try {
      await cancelBooking(booking.id)
      showToast({ message: "Booking cancelled", type: "success" })
    } catch (err: any) {
      handleApiError(err, "Failed to cancel booking")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-1">Manage all tenant bookings</p>
        </div>
      </div>

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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by provider ID, guest name, or booking ID…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
        >
          <option value="all">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3" />
            <p className="text-gray-500">Loading bookings…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm">{searchTerm || statusFilter !== "all" ? "No bookings match your filters." : "No bookings found."}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-mono text-xs text-gray-500">{booking.serviceProviderId.slice(0, 12)}…</p>
                    {booking.userId && <p className="text-xs text-gray-400 mt-0.5">User: {booking.userId.slice(0, 8)}…</p>}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{booking.metadata?.guestName ?? "—"}</p>
                    <p className="text-xs text-gray-400 font-mono">{booking.serviceProviderId.slice(0, 8)}…</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>{booking.startTime.toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">
                      {booking.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} → {booking.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-purple-600">{booking.getFormattedAmount()}</span>
                    <p className="text-xs text-gray-400">× {booking.quantity}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600"}`}>{booking.getStatusLabel()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/bookings/${booking.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm mr-4">
                      View
                    </Link>
                    {booking.status === "PENDING" && (
                      <button onClick={() => handleCancel(booking)} className="text-red-600 hover:text-red-700 font-medium text-sm">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && bookings.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} of {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}
