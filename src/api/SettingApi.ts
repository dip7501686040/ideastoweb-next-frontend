import { BaseApi } from "./BaseApi"

export type Setting = {
  id: string
  key: string
  value: string
  type: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type UpdateSettingInput = {
  key: string
  value: string
}

export class SettingApi extends BaseApi {
  async getSettings(): Promise<Setting[]> {
    return this.request<Setting[]>("/settings", { method: "GET" })
  }

  async updateSettings(updates: UpdateSettingInput[]): Promise<Setting[]> {
    return this.request<Setting[]>("/settings", {
      method: "PUT",
      body: updates
    })
  }
}

export const settingApi = new SettingApi()
