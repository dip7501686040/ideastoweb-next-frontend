"use client"

import { useRoot } from "@/providers/TenantProvider"
import ProductDetailsPage from "@/components/tenant/products/ProductDetailsPage"
import { useRouter } from "next/navigation"
import { useEffect, use } from "react"

/**
 * PRODUCT DETAIL PAGE — /products/[id]
 * - Tenant domain → ProductDetailsPage (product detail + add to cart)
 * - Admin domain  → redirect to /products (admins manage via list view)
 * - Master domain → redirect home
 */
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { tenant, adminConfig } = useRoot()
  const router = useRouter()

  useEffect(() => {
    if (adminConfig.isAdminDomain) {
      router.push("/products")
    } else if (!tenant) {
      router.push("/")
    }
  }, [adminConfig.isAdminDomain, tenant, router])

  if (tenant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ProductDetailsPage productId={id} />
      </div>
    )
  }

  return null
}
