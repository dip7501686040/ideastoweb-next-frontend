import { useState, useCallback } from "react"
import { settingApi, Setting, UpdateSettingInput } from "@/api/SettingApi"
import { useFetchOnce } from "@/hooks/useFetchOnce"

interface UseSettingsResult {
  settings: Setting[]
  loading: boolean
  error: string | null
  getSetting: (key: string) => Setting | undefined
  updateSettings: (updates: UpdateSettingInput[]) => Promise<Setting[]>
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await settingApi.getSettings()
      setSettings(data)
    } catch (err: any) {
      setError(err.message || "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }, [])

  useFetchOnce(fetchSettings)

  const getSetting = useCallback((key: string) => settings.find((s) => s.key === key), [settings])

  const updateSettings = useCallback(
    async (updates: UpdateSettingInput[]): Promise<Setting[]> => {
      const result = await settingApi.updateSettings(updates)
      const updated = Array.isArray(result) ? result : []
      if (updated.length > 0) {
        setSettings((prev) =>
          prev.map((s) => {
            const match = updated.find((u) => u.key === s.key)
            return match ?? s
          })
        )
      } else {
        // Response wasn't an array — refetch to stay in sync
        await fetchSettings()
      }
      return updated
    },
    [fetchSettings]
  )

  return { settings, loading, error, getSetting, updateSettings }
}
