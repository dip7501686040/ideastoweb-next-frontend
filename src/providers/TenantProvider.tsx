"use client"

import { createContext, useContext } from "react"
import { TenantConfig } from "@/lib/tenant"

type TenantContextType = {
  tenant: TenantConfig | null
}

const TenantContext = createContext<TenantContextType>({
  tenant: null
})

export function TenantProvider({ tenant, children }: { tenant: TenantConfig; children: React.ReactNode }) {
  return <TenantContext.Provider value={{ tenant }}>{children}</TenantContext.Provider>
}

export function useTenant() {
  return useContext(TenantContext)
}
