"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useRouter, useSearchParams } from "next/navigation"

interface PaymentFormProps {
  onSuccess?: () => void
}

/**
 * Stripe PaymentElement form.
 * Must be rendered inside a StripeProvider (Elements context).
 */
export default function PaymentForm({ onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const redirectTo = searchParams.get("redirectTo")
  const successRedirectPath = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/orders?success=true"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: new URL(successRedirectPath, window.location.origin).toString()
      },
      redirect: "if_required"
    })

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please try again.")
      setIsProcessing(false)
      return
    }

    // Payment succeeded (no redirect required)
    if (onSuccess) {
      onSuccess()
    } else {
      router.push(successRedirectPath)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{errorMessage}</div>}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Processing…
          </>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  )
}
