import { useState, useCallback } from "react"
import { bookingApi } from "@/api/BookingApi"
import { Booking, CreateBookingRequest, UpdateBookingRequest } from "@/models/Booking"
import { useFetchOnce } from "@/hooks/useFetchOnce"

interface UseBookingsOptions {
  /** If true, fetches all bookings (admin). Otherwise fetches only the current user's bookings. */
  adminMode?: boolean
}

interface UseBookingsResult {
  bookings: Booking[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createBooking: (data: CreateBookingRequest) => Promise<Booking>
  updateBooking: (id: string, data: UpdateBookingRequest) => Promise<Booking>
  cancelBooking: (id: string) => Promise<void>
}

export function useBookings({ adminMode = false }: UseBookingsOptions = {}): UseBookingsResult {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = adminMode ? await bookingApi.getAllBookings() : await bookingApi.getMyBookings()
      setBookings(data)
    } catch (err: any) {
      setError(err.message || "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }, [adminMode])

  useFetchOnce(fetchBookings)

  const createBooking = useCallback(async (data: CreateBookingRequest): Promise<Booking> => {
    const created = await bookingApi.createBooking(data)
    setBookings((prev) => [created, ...prev])
    return created
  }, [])

  const updateBooking = useCallback(async (id: string, data: UpdateBookingRequest): Promise<Booking> => {
    const updated = await bookingApi.updateBooking(id, data)
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
    return updated
  }, [])

  const cancelBooking = useCallback(async (id: string): Promise<void> => {
    await bookingApi.cancelBooking(id)
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }, [])

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking
  }
}
