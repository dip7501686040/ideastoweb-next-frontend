/**
 * Simple toast notification utility
 * Shows temporary error/success messages
 */

type ToastType = "success" | "error" | "info"

interface ToastConfig {
  message: string
  type: ToastType
  duration?: number
}

export function showToast({ message, type, duration = 3000 }: ToastConfig) {
  // Create toast element
  const toast = document.createElement("div")
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all transform translate-x-0 ${
    type === "error" ? "bg-red-600" : type === "success" ? "bg-green-600" : "bg-blue-600"
  }`
  toast.textContent = message
  toast.style.animation = "slideIn 0.3s ease-out"

  // Add to DOM
  document.body.appendChild(toast)

  // Remove after duration
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-in"
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, duration)
}

// Add CSS animations if they don't exist
if (typeof document !== "undefined" && !document.getElementById("toast-styles")) {
  const style = document.createElement("style")
  style.id = "toast-styles"
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `
  document.head.appendChild(style)
}

/**
 * Helper to check if user has a specific permission
 */
export function hasPermission(userPermissions: Array<{ moduleKey: string; operationKey: string }>, moduleKey: string, operationKey: string): boolean {
  return userPermissions.some((p) => p.moduleKey === moduleKey && p.operationKey === operationKey)
}

/**
 * Handle API errors with user-friendly messages
 */
export function handleApiError(error: any, defaultMessage: string = "An error occurred") {
  const message = error?.response?.status === 403 ? "You do not have permission to perform this action" : error?.message || defaultMessage

  showToast({ message, type: "error" })
}
