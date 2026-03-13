import CartTemplateResolver from "@/components/resolvers/CartTemplateResolver"

/**
 * 🛒 CART PAGE
 * - Tenant domain → CartPage (shopping cart)
 * - Admin / master domain → redirected by CartTemplateResolver
 */
export default function CartPage() {
  return <CartTemplateResolver />
}
