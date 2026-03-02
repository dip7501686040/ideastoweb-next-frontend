import { useEffect, useRef } from "react"

/**
 * Calls `fetchFn` once per unique function reference.
 * - Prevents double-invocation caused by React StrictMode (same ref → skip).
 * - Re-fetches when dependencies genuinely change (new ref → call).
 * - Pass `enabled=false` to defer the fetch until ready.
 */
export function useFetchOnce(fetchFn: () => Promise<void>, enabled = true) {
  const lastFnRef = useRef<typeof fetchFn | null>(null)

  useEffect(() => {
    if (!enabled) return // defer until ready
    if (lastFnRef.current === fetchFn) return // StrictMode duplicate, skip
    lastFnRef.current = fetchFn
    fetchFn()
  }, [fetchFn, enabled])
}
