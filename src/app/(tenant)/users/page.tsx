import UsersTemplateResolver from "@/components/resolvers/UsersTemplateResolver"

/**
 * 👥 USERS PAGE
 * Uses server-side template resolver with tenant requirement
 * All logic handled in UsersTemplateResolver (SSR)
 */
export default function TenantUsersPage() {
  return <UsersTemplateResolver />
}
