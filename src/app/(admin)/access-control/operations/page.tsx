import OperationsManagement from "@/components/admin/rbac/OperationsManagement"
import TenantServiceGuard from "@/components/admin/TenantServiceGuard"

export default function OperationsPage() {
  return (
    <TenantServiceGuard serviceCode="rbac">
      <OperationsManagement />
    </TenantServiceGuard>
  )
}
