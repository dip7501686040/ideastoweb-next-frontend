import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { headers } from "next/headers"
import { getTenantFromHost } from "@/lib/tenant"
import { TenantProvider } from "@/providers/TenantProvider"

import MasterLayout from "@/components/layouts/master/MasterLayout"
import TenantLayout from "@/components/layouts/tenant/TenantLayout"

import "./globals.css"
import { getCurrentTenant } from "@/lib/tenantContext"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Multi-Tenant App",
  description: "Enterprise multi-tenant Next.js application"
}

/**
 * 🔥 ROOT LAYOUT — TENANT RESOLVER
 * Detects tenant ONCE at the root level
 * Provides global tenant context to all components
 */
export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // Detect tenant once from hostname
  const tenant = await getCurrentTenant()

  /**
   * Resolve which layout to use based on tenant detection
   * - Master Layout: Main domain (localhost or configured main domain)
   * - Tenant Layout: Subdomain or custom domain
   */
  function resolveLayout(content: React.ReactNode) {
    if (!tenant) {
      return <MasterLayout>{content}</MasterLayout>
    }
    return (
      <TenantProvider tenant={tenant}>
        <TenantLayout>{content}</TenantLayout>
      </TenantProvider>
    )
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{resolveLayout(children)}</body>
    </html>
  )
}
