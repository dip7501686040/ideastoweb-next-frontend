"use client"

import { useState, useEffect } from "react"
import { useBookings } from "@/hooks/useBookings"
import { useSettings } from "@/hooks/useSettings"
import { bookingApi } from "@/api/BookingApi"
import { showToast, handleApiError } from "@/lib/utils"
import { Booking, CreateBookingRequest } from "@/models/Booking"
import { ServiceProvider } from "@/models/ServiceProvider"
import { ServiceType } from "@/models/ServiceType"
import { checkoutApi } from "@/api/CheckoutApi"
import { useRouter, useSearchParams } from "next/navigation"

const DEFAULT_SERVICE_PROVIDER_ID_KEY = "default_service_provider_id"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700"
}

/**
 * Tenant Booking List Page — single-provider mode.
 * Reads the default provider from settings, shows its details, and lets users book.
 */
export default function BookingListPage() {
  const { bookings, loading: bookingsLoading, error: bookingsError, refetch, createBooking, cancelBooking } = useBookings()
  const { getSetting, loading: settingsLoading } = useSettings()
  const searchParams = useSearchParams()

  const [provider, setProvider] = useState<ServiceProvider | null>(null)
  const [serviceType, setServiceType] = useState<ServiceType | null>(null)
  const [providerLoading, setProviderLoading] = useState(true)
  const [providerError, setProviderError] = useState<string | null>(null)

  const [showNewForm, setShowNewForm] = useState(false)
  const [payNowBooking, setPayNowBooking] = useState<Booking | null>(null)
  const router = useRouter()
  const paymentSuccess = searchParams.get("success") === "true"

  // Once settings are resolved, fetch provider + service type
  useEffect(() => {
    if (settingsLoading) return
    const idSetting = getSetting(DEFAULT_SERVICE_PROVIDER_ID_KEY)
    if (!idSetting?.value) {
      setProviderError("No default service provider configured. Please contact your administrator.")
      setProviderLoading(false)
      return
    }
    ;(async () => {
      try {
        setProviderLoading(true)
        setProviderError(null)
        const sp = await bookingApi.getServiceProviderById(idSetting.value)
        setProvider(sp)
        // Service type details may be embedded in the provider response from the API.
        // Cast to `any` to avoid requiring a model change and read embedded data if present.
        setServiceType((sp as any).serviceType ?? null)
      } catch (err: any) {
        setProviderError(err.message || "Failed to load provider details")
      } finally {
        setProviderLoading(false)
      }
    })()
  }, [settingsLoading, getSetting])

  useEffect(() => {
    if (!paymentSuccess) return
    refetch()
  }, [paymentSuccess, refetch])

  const handlePayNow = async (booking: Booking, phone: string, currency: string) => {
    const result = await checkoutApi.payNow({
      itemType: "booking",
      itemId: booking.id,
      amount: booking.amount,
      quantity: booking.quantity,
      referenceType: "booking",
      phone,
      currency,
      description: booking.metadata?.guestName ? `Booking for ${booking.metadata.guestName}` : "Service booking"
    })
    router.push(`/payment?clientSecret=${encodeURIComponent(result.clientSecret)}&paymentId=${result.paymentId}&redirectTo=${encodeURIComponent("/bookings?success=true")}`)
  }

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id)
      showToast({ message: "Booking cancelled", type: "success" })
    } catch (err: any) {
      handleApiError(err, "Failed to cancel booking")
    }
  }

  const isLoading = settingsLoading || providerLoading

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your service bookings</p>
        </div>
        {provider && (
          <button onClick={() => setShowNewForm(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Booking
          </button>
        )}
      </div>

      {/* Provider info card */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-3 text-gray-400 text-sm">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
          Loading provider details…
        </div>
      ) : providerError ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">{providerError}</div>
      ) : provider ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">{provider.name.charAt(0).toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-900">{provider.name}</h2>
                {serviceType && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{serviceType.name}</span>}
              </div>
              {provider.description && <p className="text-sm text-gray-500 mt-1">{provider.description}</p>}
              {serviceType?.description && <p className="text-xs text-gray-400 mt-0.5">{serviceType.description}</p>}
            </div>
          </div>
        </div>
      ) : null}

      {/* Payment success banner */}
      {paymentSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-green-800">Payment successful!</p>
            <p className="text-sm text-green-600">Your booking has been updated. We refreshed your bookings to show the latest status from the server.</p>
          </div>
        </div>
      )}

      {/* Pay Now Modal */}
      {payNowBooking && <PayNowModal booking={payNowBooking} onClose={() => setPayNowBooking(null)} onPay={handlePayNow} />}

      {/* New Booking Modal */}
      {showNewForm && provider && (
        <NewBookingModal
          providerName={provider.name}
          providerId={provider.id}
          onClose={() => setShowNewForm(false)}
          onCreated={async (data) => {
            await createBooking(data)
            setShowNewForm(false)
            showToast({ message: "Booking created", type: "success" })
          }}
        />
      )}

      {/* Bookings error */}
      {bookingsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-red-800 text-sm">{bookingsError}</p>
            <button onClick={refetch} className="mt-1 text-sm text-red-700 font-medium underline">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Bookings list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {bookingsLoading ? (
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
                    <span className="font-medium text-gray-900">{booking.metadata?.guestName ?? "Booking"}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600"}`}>{booking.getStatusLabel()}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {booking.startTime.toLocaleDateString()} &nbsp;
                    {booking.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} → {booking.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {booking.metadata?.address && <p className="text-xs text-gray-400 mt-0.5">{booking.metadata.address}</p>}
                  <p className="text-sm font-medium text-purple-600 mt-1">
                    {booking.getFormattedAmount()} × {booking.quantity}
                  </p>
                  {booking.notes && <p className="text-xs text-gray-400 mt-1">{booking.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {booking.status === "PENDING" && (
                    <>
                      <button onClick={() => setPayNowBooking(booking)} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                        Pay Now
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

function NewBookingModal({ providerName, providerId, onClose, onCreated }: { providerName: string; providerId: string; onClose: () => void; onCreated: (data: CreateBookingRequest) => Promise<void> }) {
  const [form, setForm] = useState({
    guestName: "",
    address: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    amount: "",
    quantity: "1",
    notes: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.guestName || !form.bookingDate || !form.startTime || !form.endTime || !form.amount) {
      setFormError("Please fill in all required fields.")
      return
    }
    const start = new Date(`${form.bookingDate}T${form.startTime}`)
    const end = new Date(`${form.bookingDate}T${form.endTime}`)
    if (end <= start) {
      setFormError("End time must be after start time.")
      return
    }
    try {
      setSubmitting(true)
      setFormError(null)
      await onCreated({
        serviceProviderId: providerId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        amount: parseFloat(form.amount),
        quantity: parseInt(form.quantity, 10),
        notes: form.notes || undefined,
        metadata: {
          guestName: form.guestName,
          ...(form.address && { address: form.address })
        }
      })
    } catch (err: any) {
      setFormError(err.message || "Failed to create booking")
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">New Booking</h2>
            <p className="text-xs text-gray-400 mt-0.5">{providerName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{formError}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guest Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.guestName}
              onChange={set("guestName")}
              placeholder="e.g. Alice Johnson"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={set("address")}
              placeholder="e.g. 123 Main St, City"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.bookingDate}
              onChange={set("bookingDate")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={form.startTime}
                onChange={set("startTime")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={form.endTime}
                onChange={set("endTime")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={set("amount")}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={set("quantity")}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
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

// ── Pay Now Modal ──────────────────────────────────────────────────────────────

function PayNowModal({ booking, onClose, onPay }: { booking: Booking; onClose: () => void; onPay: (booking: Booking, phone: string, currency: string) => Promise<void> }) {
  const [phone, setPhone] = useState("")
  const [currency, setCurrency] = useState("inr")
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) {
      setFormError("Phone number is required.")
      return
    }
    try {
      setSubmitting(true)
      setFormError(null)
      await onPay(booking, phone.trim(), currency)
    } catch (err: any) {
      setFormError(err.message || "Failed to initiate payment")
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pay Now</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {booking.metadata?.guestName ?? "Booking"} · {booking.getFormattedAmount()}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{formError}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+919876543210"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="inr">INR – Indian Rupee</option>
              <option value="usd">USD – US Dollar</option>
              <option value="eur">EUR – Euro</option>
              <option value="gbp">GBP – British Pound</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Redirecting…
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
