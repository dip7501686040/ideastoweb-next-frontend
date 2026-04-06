"use client"

import { useSearchParams } from "next/navigation"
import StripeProvider from "@/components/tenant/payment/StripeProvider"
import PaymentPage from "@/components/tenant/payment/PaymentPage"
import Link from "next/link"

/**
 * Tenant-facing Stripe payment page.
 * Expects ?clientSecret=... in the URL (set during checkout).
 */
export default function TenantPaymentPage() {
  const params = useSearchParams()
  const clientSecret = params.get("clientSecret")
  const redirectTo = params.get("redirectTo")
  const backHref = redirectTo && redirectTo.startsWith("/") ? redirectTo.split("?")[0] : "/checkout"

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Missing Payment Session</h2>
          <p className="text-sm text-gray-500 mb-4">No payment session found. Please start from checkout.</p>
          <Link href={backHref} className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
            Back
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-500 mt-1 text-sm">Your payment is secured by Stripe.</p>
        </div>

        {/* Stripe Payment Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <StripeProvider clientSecret={clientSecret}>
            <PaymentPage />
          </StripeProvider>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secured by Stripe. We never store your card details.
        </div>
      </div>
    </div>
  )
}
