"use client"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface StripeProviderProps {
  clientSecret: string
  children: React.ReactNode
}

/**
 * Wraps children with Stripe Elements using the provided clientSecret.
 */
export default function StripeProvider({ clientSecret, children }: StripeProviderProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#7c3aed"
      }
    }
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
