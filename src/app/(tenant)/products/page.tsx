import ProductsTemplateResolver from "@/components/resolvers/ProductsTemplateResolver"

/**
 * 🛍ufe0f PRODUCTS PAGE
 * Uses server-side template resolver with tenant requirement
 * All logic handled in ProductsTemplateResolver (SSR)
 */
export default function TenantProductsPage() {
  return <ProductsTemplateResolver />
}
