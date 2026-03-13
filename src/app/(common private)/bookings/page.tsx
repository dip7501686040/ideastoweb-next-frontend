import BookingsTemplateResolver from "@/components/resolvers/BookingsTemplateResolver"

/**
 * BOOKINGS PAGE
 * - Admin domain  → BookingsManagement (all bookings)
 * - Tenant domain → BookingListPage (my bookings)
 * - Master domain → redirected by BookingsTemplateResolver
 */
export default function BookingsPage() {
  return <BookingsTemplateResolver />
}
