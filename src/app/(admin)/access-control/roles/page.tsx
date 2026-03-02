import RolesManagement from "@/components/admin/rbac/RolesManagement"
import TenantServiceGuard from "@/components/admin/TenantServiceGuard"

export default function RolesPage() {
  return (
    <TenantServiceGuard serviceCode="rbac">
      <RolesManagement />
    </TenantServiceGuard>
  )
}
