import RegisterTemplateResolver from "@/components/resolvers/RegisterTemplateResolver"

/**
 * 📝 REGISTER PAGE
 * Uses server-side template resolver for secure tenant detection
 * All logic handled in RegisterTemplateResolver (SSR)
 */
export default function RegisterPage() {
  return <RegisterTemplateResolver />
}
