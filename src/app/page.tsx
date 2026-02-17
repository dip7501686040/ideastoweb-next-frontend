import HomeTemplateResolver from "@/components/resolvers/HomeTemplateResolver"

/**
 * 🏠 HOME PAGE
 * Uses server-side template resolver for secure tenant detection
 * All logic handled in HomeTemplateResolver (SSR)
 */
export default function Home() {
  return <HomeTemplateResolver />
}
