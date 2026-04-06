"use client"

import { useRoot } from "@/providers/TenantProvider"
import BookingListPage from "@/components/tenant/bookings/BookingListPage"
import BookingSetupManagement from "@/components/admin/bookings/BookingSetupManagement"
import TenantServiceGuard from "@/components/admin/TenantServiceGuard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * BOOKINGS TEMPLATE RESOLVER
 * - Admin domain + tenant admin → BookingSetupManagement (service types & providers)
 * - Admin domain + master admin → BookingsManagement (all bookings across users)
 * - Tenant domain               → BookingListPage (my bookings + create)
 * - Master domain               → redirect home
 */
export default function BookingsTemplateResolver() {
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (!adminConfig.isAdminDomain && !tenant) {
      router.push("/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  if (adminConfig.isAdminDomain && adminConfig.isTenantAdmin) {
    return (
      <TenantServiceGuard serviceCode="booking">
        <BookingSetupManagement />
      </TenantServiceGuard>
    )
  }

  if (tenant) {
    return <BookingListPage />
  }

  return null
}
