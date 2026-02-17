import DashboardTemplateResolver from "@/components/resolvers/DashboardTemplateResolver"

/**
 * 📊 DASHBOARD PAGE
 * Uses server-side template resolver for secure tenant detection
 * All logic handled in DashboardTemplateResolver (SSR)
 */
export default function DashboardRootPage() {
  return <DashboardTemplateResolver />
}
