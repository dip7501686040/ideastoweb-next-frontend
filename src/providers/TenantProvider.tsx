"use client"

import { createContext, useContext } from "react"
import { TenantConfig, AdminConfig } from "@/lib/tenant"

type RootContextType = {
  tenant: TenantConfig | null
  adminConfig: AdminConfig
}

const RootContext = createContext<RootContextType>({
  tenant: null,
  adminConfig: {
    isAdminDomain: false,
    isMasterAdmin: false,
    isTenantAdmin: false
  }
})

export function RootProvider({ tenant, adminConfig, children }: { tenant: TenantConfig | null; adminConfig: AdminConfig; children: React.ReactNode }) {
  return <RootContext.Provider value={{ tenant, adminConfig }}>{children}</RootContext.Provider>
}

export function useRoot() {
  return useContext(RootContext)
}
