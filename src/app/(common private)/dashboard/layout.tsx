import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

/**
 * Dashboard Layout
 * Simple passthrough - parent (common private) layout handles conditional rendering
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <>{children}</>
}
