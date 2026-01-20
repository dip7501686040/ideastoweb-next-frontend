"use client"

import { useState, useEffect, useCallback } from "react"
import { CookieManager } from "@/lib/cookies"

/**
 * Custom hook for reactive cookie management
 * Returns [value, setValue, deleteCookie] similar to useState
 *
 * @example
 * const [theme, setTheme, deleteTheme] = useCookie('theme', 'light')
 */
export function useCookie(
  key: string,
  defaultValue?: string
): [
  string | null,
  (
    value: string,
    options?: {
      days?: number
      path?: string
      secure?: boolean
      sameSite?: "Strict" | "Lax" | "None"
    }
  ) => void,
  () => void
] {
  // Initialize state with cookie value or default
  const [value, setValue] = useState<string | null>(() => {
    if (typeof window === "undefined") return defaultValue || null
    return CookieManager.get(key) || defaultValue || null
  })

  // Update cookie and state
  const updateCookie = useCallback(
    (
      newValue: string,
      options?: {
        days?: number
        path?: string
        secure?: boolean
        sameSite?: "Strict" | "Lax" | "None"
      }
    ) => {
      CookieManager.set(key, newValue, options)
      setValue(newValue)
    },
    [key]
  )

  // Delete cookie and reset state
  const deleteCookie = useCallback(() => {
    CookieManager.delete(key)
    setValue(defaultValue || null)
  }, [key, defaultValue])

  // Sync with actual cookie value on mount and when key changes
  useEffect(() => {
    const currentValue = CookieManager.get(key)
    if (currentValue !== value) {
      setValue(currentValue || defaultValue || null)
    }
  }, [key, defaultValue])

  // Optional: Poll for external cookie changes (e.g., from other tabs)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentValue = CookieManager.get(key)
      if (currentValue !== value) {
        setValue(currentValue || defaultValue || null)
      }
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [key, value, defaultValue])

  return [value, updateCookie, deleteCookie]
}

/**
 * Hook to check if user has accepted cookies (for cookie consent)
 * @example
 * const [accepted, acceptCookies] = useCookieConsent()
 */
export function useCookieConsent(): [boolean, () => void] {
  const [consent, setConsent, deleteConsent] = useCookie("cookie-consent", "false")

  const acceptCookies = useCallback(() => {
    setConsent("true", { days: 365 })
  }, [setConsent])

  return [consent === "true", acceptCookies]
}
