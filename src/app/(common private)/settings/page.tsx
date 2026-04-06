import SettingsTemplateResolver from "@/components/resolvers/SettingsTemplateResolver"

/**
 * ⚙️ SETTINGS PAGE
 * Uses server-side template resolver with tenant requirement
 * All logic handled in SettingsTemplateResolver (SSR)
 */
export default function TenantSettingsPage() {
  return <SettingsTemplateResolver />
}
