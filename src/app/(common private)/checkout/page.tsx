import CheckoutTemplateResolver from "@/components/resolvers/CheckoutTemplateResolver"

/**
 * CHECKOUT PAGE
 * - Tenant domain → CheckoutPage (review + initiate payment)
 * - Admin / master domain → redirected by CheckoutTemplateResolver
 */
export default function CheckoutPageRoute() {
  return <CheckoutTemplateResolver />
}
