"use client"

import { useRoot } from "@/providers/TenantProvider"
import BookingListPage from "@/components/tenant/bookings/BookingListPage"
import BookingsManagement from "@/components/admin/bookings/BookingsManagement"
import TenantServiceGuard from "@/components/admin/TenantServiceGuard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * BOOKINGS TEMPLATE RESOLVER
 * - Admin domain  → BookingsManagement (all bookings across users)
 * - Tenant domain → BookingListPage (my bookings + create)
 * - Master domain → redirect home
 */
export default function BookingsTemplateResolver() {
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
        <BookingsManagement />
      </TenantServiceGuard>
    )
  }

  if (tenant) {
    return <BookingListPage />
  }

  return null
}
