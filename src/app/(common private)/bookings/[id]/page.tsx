"use client"

import { useRoot } from "@/providers/TenantProvider"
import BookingDetailsPage from "@/components/tenant/bookings/BookingDetailsPage"
import AdminBookingDetail from "@/components/admin/bookings/AdminBookingDetail"
import TenantServiceGuard from "@/components/admin/TenantServiceGuard"
import { useRouter } from "next/navigation"
import { useEffect, use } from "react"

/**
 * BOOKING DETAIL PAGE — /bookings/[id]
 * - Admin domain  → AdminBookingDetail
 * - Tenant domain → BookingDetailsPage
 * - Master domain → redirect home
 */
export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (!adminConfig.isAdminDomain && !tenant) {
      router.push("/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  if (adminConfig.isAdminDomain) {
    return (
      <TenantServiceGuard serviceCode="booking">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <AdminBookingDetail bookingId={id} />
        </div>
      </TenantServiceGuard>
    )
  }

  if (tenant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <BookingDetailsPage bookingId={id} />
      </div>
    )
  }

  return null
}
