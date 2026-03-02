import ModulesManagement from "@/components/admin/rbac/ModulesManagement"
import TenantServiceGuard from "@/components/admin/TenantServiceGuard"

export default function ModulesPage() {
  return (
    <TenantServiceGuard serviceCode="rbac">
      <ModulesManagement />
    </TenantServiceGuard>
  )
}
