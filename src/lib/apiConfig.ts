const DEFAULT_API_BASE_URL = "http://localhost:8080"

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      apiBaseUrl?: string
    }
  }
}

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.__RUNTIME_CONFIG__?.apiBaseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
}
