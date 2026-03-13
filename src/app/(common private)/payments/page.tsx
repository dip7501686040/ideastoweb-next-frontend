import PaymentsTemplateResolver from "@/components/resolvers/PaymentsTemplateResolver"

/**
 * PAYMENTS PAGE
 * - Admin domain  → PaymentsManagement (all payment records)
 * - Tenant domain → redirected to /orders by PaymentsTemplateResolver
 */
export default function PaymentsPage() {
  return <PaymentsTemplateResolver />
}
