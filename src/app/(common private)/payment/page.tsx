import PaymentTemplateResolver from "@/components/resolvers/PaymentTemplateResolver"

/**
 * PAYMENT PAGE
 * - Tenant domain → TenantPaymentPage (Stripe form, reads ?clientSecret from URL)
 * - Admin / master domain → redirected by PaymentTemplateResolver
 */
export default function PaymentPageRoute() {
  return <PaymentTemplateResolver />
}
