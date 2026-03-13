import OrdersTemplateResolver from "@/components/resolvers/OrdersTemplateResolver"

/**
 * ORDERS PAGE
 * - Admin domain  → OrdersManagement (all orders)
 * - Tenant domain → OrderListPage (my orders)
 * - Master domain → redirected by OrdersTemplateResolver
 */
export default function OrdersPage() {
  return <OrdersTemplateResolver />
}
