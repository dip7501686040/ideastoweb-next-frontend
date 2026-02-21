import { ReactNode } from "react"

interface TenantLayoutProps {
  children: ReactNode
}

/**
 * Tenant Portal Layout
 * Used for tenant-specific domains (subdomain or custom domain)
 * Note: Tenant context is available via useRoot() hook in client components
 */
export default function TenantLayout({ children }: TenantLayoutProps) {
  return <article>{children}</article>
}
