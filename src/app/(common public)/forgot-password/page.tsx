import ForgotPasswordTemplateResolver from "@/components/resolvers/ForgotPasswordTemplateResolver"

/**
 * 🔑 FORGOT PASSWORD PAGE
 * Uses server-side template resolver for secure tenant detection
 * All logic handled in ForgotPasswordTemplateResolver (SSR)
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordTemplateResolver />
}
