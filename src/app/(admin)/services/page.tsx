"use client"

import { useRoot } from "@/providers/TenantProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ServiceManagement from "@/components/admin/services/ServiceManagement"

export default function ServicesPage() {
  const { adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (!adminConfig.isMasterAdmin) {
      router.replace("/dashboard")
    }
  }, [adminConfig, router])

  if (!adminConfig.isMasterAdmin) return null

  return <ServiceManagement />
}
