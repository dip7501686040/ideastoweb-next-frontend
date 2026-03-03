import ProductsTemplateResolver from "@/components/resolvers/ProductsTemplateResolver"

/**
 * 🛍️ PRODUCTS PAGE
 * Single unified route for all domain contexts.
 * - Admin domain  → ProductsManagement (full CRUD for tenant admins)
 * - Tenant domain → TenantProductGrid  (tenant client view)
 * All routing logic is handled in ProductsTemplateResolver.
 */
export default function ProductsPage() {
  return <ProductsTemplateResolver />
}
