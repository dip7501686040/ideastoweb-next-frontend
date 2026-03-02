import UsersRBAC from "@/components/admin/rbac/UsersRBAC"
import TenantServiceGuard from "@/components/admin/TenantServiceGuard"

export default function UsersPage() {
  return (
    <TenantServiceGuard serviceCode="user">
      <UsersRBAC />
    </TenantServiceGuard>
  )
}
