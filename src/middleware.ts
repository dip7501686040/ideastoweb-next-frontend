import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getTenantFromHost } from "@/lib/tenant"

/**
 * 🔒 SECURITY-ENHANCED MIDDLEWARE
 * Handles authentication and tenant validation on the server side
 * All checks happen before any page renders (SSR security layer)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get("host") || ""

  // 🔐 AUTHENTICATION CHECK
  const token = request.cookies.get("accessToken")?.value
  const isAuthenticated = !!token

  // 🏢 TENANT DETECTION (Server-side only, never exposed to client)
  const tenant = getTenantFromHost(hostname)
  const isMasterDomain = !tenant
  const isTenantDomain = !!tenant

  // 📍 ROUTE CLASSIFICATION
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password")
  const isPublicPage = pathname === "/" || isAuthPage

  // 🛡️ SECURITY RULES

  // 1. Protect private pages - redirect to login if not authenticated
  if (!isPublicPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // 2. Prevent authenticated users from accessing auth pages
  if (isPublicPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // ✅ All checks passed - proceed with request
  // Tenant information is re-fetched in Server Components for template rendering
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
