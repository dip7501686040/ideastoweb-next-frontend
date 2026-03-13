import { BaseApi } from "./BaseApi"
import { Booking, BookingApiType, CreateBookingRequest, UpdateBookingRequest } from "@/models/Booking"

/**
 * Booking API client.
 * All requests are authenticated via the JWT in the Authorization header.
 * Base URL: http://localhost:8000
 */
export class BookingApi extends BaseApi {
  /** Get all bookings for the current authenticated user */
  async getMyBookings(): Promise<Booking[]> {
    const response = await this.request<BookingApiType[]>("/bookings/my", {
      method: "GET"
    })
    return response.map(Booking.fromApi)
  }

  /** Admin: Get all bookings across all users */
  async getAllBookings(): Promise<Booking[]> {
    const response = await this.request<BookingApiType[]>("/bookings", {
      method: "GET"
    })
    return response.map(Booking.fromApi)
  }

  /** Get a single booking by ID */
  async getBookingById(id: string): Promise<Booking> {
    const response = await this.request<BookingApiType>(`/bookings/${id}`, {
      method: "GET"
    })
    return Booking.fromApi(response)
  }

  /** Create a new booking */
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    const response = await this.request<BookingApiType>("/bookings", {
      method: "POST",
      body: data
    })
    return Booking.fromApi(response)
  }

  /** Update an existing booking (startTime, endTime, notes, metadata only) */
  async updateBooking(id: string, data: UpdateBookingRequest): Promise<Booking> {
    const response = await this.request<BookingApiType>(`/bookings/${id}`, {
      method: "PUT",
      body: data
    })
    return Booking.fromApi(response)
  }

  /** Cancel a booking */
  async cancelBooking(id: string): Promise<{ message: string; id: string }> {
    return this.request<{ message: string; id: string }>(`/bookings/${id}`, {
      method: "DELETE"
    })
  }
}

export const bookingApi = new BookingApi()
