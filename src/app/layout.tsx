import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { RootProvider } from "@/providers/TenantProvider"

import "./globals.css"
import { getCurrentTenant, getServerAdminConfig } from "@/lib/tenantContext"

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
 * 🔥 ROOT LAYOUT — CONTEXT PROVIDER
 * Detects tenant and admin config ONCE at the root level
 * Provides global context to all components via useRoot() hook
 * This eliminates the need for getServerTenant() calls throughout the app
 */
export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // Detect context once from hostname
  const tenant = await getCurrentTenant()
  const adminConfig = await getServerAdminConfig()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootProvider tenant={tenant} adminConfig={adminConfig}>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
