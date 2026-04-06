import { BaseApi } from "./BaseApi"
import { Booking, BookingApiType, CreateBookingRequest, UpdateBookingRequest } from "@/models/Booking"
import { ServiceType, ServiceTypeApiType, CreateServiceTypeRequest, UpdateServiceTypeRequest } from "@/models/ServiceType"
import { ServiceProvider, ServiceProviderApiType, CreateServiceProviderRequest, UpdateServiceProviderRequest } from "@/models/ServiceProvider"

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

  // ──────────────────────────────────────────────
  // Service Types
  // ──────────────────────────────────────────────

  /** Get all service types */
  async getServiceTypes(): Promise<ServiceType[]> {
    const response = await this.request<ServiceTypeApiType[]>("/bookings/service-types", {
      method: "GET"
    })
    return response.map(ServiceType.fromApi)
  }

  /** Create a new service type */
  async createServiceType(data: CreateServiceTypeRequest): Promise<ServiceType> {
    const response = await this.request<ServiceTypeApiType>("/bookings/service-types", {
      method: "POST",
      body: data
    })
    return ServiceType.fromApi(response)
  }

  /** Update an existing service type */
  async updateServiceType(id: string, data: UpdateServiceTypeRequest): Promise<ServiceType> {
    const response = await this.request<ServiceTypeApiType>(`/bookings/service-types/${id}`, {
      method: "PUT",
      body: data
    })
    return ServiceType.fromApi(response)
  }

  /** Delete a service type */
  async deleteServiceType(id: string): Promise<void> {
    await this.request<void>(`/bookings/service-types/${id}`, {
      method: "DELETE"
    })
  }

  // ──────────────────────────────────────────────
  // Service Providers
  // ──────────────────────────────────────────────

  /** Get all service providers */
  async getServiceProviders(): Promise<ServiceProvider[]> {
    const response = await this.request<ServiceProviderApiType[]>("/bookings/service-providers", {
      method: "GET"
    })
    return response.map(ServiceProvider.fromApi)
  }

  /** Get a single service provider by ID */
  async getServiceProviderById(id: string): Promise<ServiceProvider> {
    const response = await this.request<ServiceProviderApiType>(`/bookings/service-providers/${id}`, {
      method: "GET"
    })
    return ServiceProvider.fromApi(response)
  }

  /** Get a single service type by ID */
  async getServiceTypeById(id: string): Promise<ServiceType> {
    const response = await this.request<ServiceTypeApiType>(`/bookings/service-types/${id}`, {
      method: "GET"
    })
    return ServiceType.fromApi(response)
  }

  /** Create a new service provider */
  async createServiceProvider(data: CreateServiceProviderRequest): Promise<ServiceProvider> {
    const response = await this.request<ServiceProviderApiType>("/bookings/service-providers", {
      method: "POST",
      body: data
    })
    return ServiceProvider.fromApi(response)
  }

  /** Update an existing service provider */
  async updateServiceProvider(id: string, data: UpdateServiceProviderRequest): Promise<ServiceProvider> {
    const response = await this.request<ServiceProviderApiType>(`/bookings/service-providers/${id}`, {
      method: "PUT",
      body: data
    })
    return ServiceProvider.fromApi(response)
  }

  /** Delete a service provider */
  async deleteServiceProvider(id: string): Promise<void> {
    await this.request<void>(`/bookings/service-providers/${id}`, {
      method: "DELETE"
    })
  }
}

export const bookingApi = new BookingApi()
