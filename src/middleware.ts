import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getTenantFromHost, isTenantRequest } from "./lib/tenant"

// Routes that require authentication
const protectedRoutes = ["/dashboard"]

// Routes that should redirect to dashboard if authenticated
const authRoutes = ["/login", "/register", "/forgot-password"]

// Tenant-specific routes that require tenant context
const tenantRoutes = ["/auth", "/users", "/products", "/settings"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get("host") || ""

  // Check if this is a tenant request
  const tenant = getTenantFromHost(hostname)
  const isTenant = !!tenant

  // Check if user has access token in cookies
  const accessToken = request.cookies.get("accessToken")?.value
  const isAuthenticated = !!accessToken

  // Handle tenant-specific routing
  if (isTenant) {
    // Tenant root page is always accessible
    if (pathname === "/") {
      return NextResponse.next()
    }

    // Tenant auth routes (login, register) - redirect to home if already authenticated
    if (pathname.startsWith("/auth") && isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Protected tenant routes
    const isProtectedTenantRoute = tenantRoutes.some((route) => pathname.startsWith(route))

    // For user management and other protected pages, require authentication
    if ((pathname.startsWith("/users") || pathname.startsWith("/products") || pathname.startsWith("/settings")) && !isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  // Handle main app routing (non-tenant)
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
}
