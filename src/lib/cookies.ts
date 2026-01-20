/**
 * Cookie utility class for managing browser cookies
 * Handles setting, getting, and deleting cookies with proper options
 */
export class CookieManager {
  /**
   * Set a cookie with optional configuration
   */
  static set(
    name: string,
    value: string,
    options: {
      days?: number
      path?: string
      secure?: boolean
      sameSite?: "Strict" | "Lax" | "None"
    } = {}
  ): void {
    if (typeof window === "undefined") return

    const { days = 7, path = "/", secure = process.env.NODE_ENV === "production", sameSite = "Lax" } = options

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      cookieString += `; expires=${date.toUTCString()}`
    }

    cookieString += `; path=${path}`

    if (secure) {
      cookieString += "; secure"
    }

    cookieString += `; SameSite=${sameSite}`

    document.cookie = cookieString
  }

  /**
   * Get a cookie value by name
   */
  static get(name: string): string | null {
    if (typeof window === "undefined") return null

    const nameEQ = encodeURIComponent(name) + "="
    const cookies = document.cookie.split(";")

    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length))
      }
    }

    return null
  }

  /**
   * Delete a cookie by name
   */
  static delete(name: string, path: string = "/"): void {
    if (typeof window === "undefined") return

    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
  }

  /**
   * Check if a cookie exists
   */
  static has(name: string): boolean {
    return this.get(name) !== null
  }

  /**
   * Clear all cookies (for logout)
   */
  static clearAll(): void {
    if (typeof window === "undefined") return

    const cookies = document.cookie.split(";")

    for (let cookie of cookies) {
      const name = cookie.split("=")[0].trim()
      this.delete(name)
    }
  }

  /**
   * Get all cookies as an object
   */
  static getAll(): Record<string, string> {
    if (typeof window === "undefined") return {}

    const cookies: Record<string, string> = {}
    const cookieArray = document.cookie.split(";")

    for (let cookie of cookieArray) {
      const [name, value] = cookie.trim().split("=")
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value)
      }
    }

    return cookies
  }
}
