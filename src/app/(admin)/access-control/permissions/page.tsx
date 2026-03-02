import PermissionsMatrix from "@/components/admin/rbac/PermissionsMatrix"
import TenantServiceGuard from "@/components/admin/TenantServiceGuard"

export default function PermissionsPage() {
  return (
    <TenantServiceGuard serviceCode="rbac">
      <PermissionsMatrix />
    </TenantServiceGuard>
  )
}
