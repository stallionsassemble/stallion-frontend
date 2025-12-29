import { api } from '@/lib/api'

class SettingsService {
  async getPasskeys() {
    const response = await api.get('/settings/passkeys')
    return response.data
  }

  async updatePasskey(id: string, name: string) {
    const response = await api.patch(`/settings/passkeys/${id}`, { name })
    return response.data
  }

  async deletePasskey(id: string) {
    const response = await api.delete(`/settings/passkeys/${id}`)
    return response.data
  }
}

export const settingsService = new SettingsService()
