import LoginTemplateResolver from "@/components/resolvers/LoginTemplateResolver"

/**
 * 🔐 LOGIN PAGE
 * Uses server-side template resolver for secure tenant detection
 * All logic handled in LoginTemplateResolver (SSR)
 */
export default function LoginPage() {
  return <LoginTemplateResolver />
}
