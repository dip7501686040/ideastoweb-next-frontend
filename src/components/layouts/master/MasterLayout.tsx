import { ReactNode } from "react"

interface MasterLayoutProps {
  children: ReactNode
}

/**
 * Master Portal Layout
 * Used for main application (localhost or main domain)
 */
export default function MasterLayout({ children }: MasterLayoutProps) {
  return <article>{children}</article>
}
