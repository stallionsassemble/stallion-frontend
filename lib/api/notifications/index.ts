import { api } from '@/lib/api'

class NotificationService {
  async getNotifications() {
    const response = await api.get('/notifications')
    return response.data
  }

  async notificationsUnreadCount() {
    const response = await api.get('/notifications/unread-count')
    return response.data
  }

  async markNotificationRead(notificationId: string) {
    const response = await api.patch(`/notifications/${notificationId}/read`)
    return response.data
  }

  async markAllNotificationsRead() {
    const response = await api.patch('/notifications/read-all')
    return response.data
  }

  async deleteNotification(notificationId: string) {
    const response = await api.delete(`/notifications/${notificationId}`)
    return response.data
  }

  async notificationSettings() {
    const response = await api.get('/notifications/settings')
    return response.data
  }

  async updateNotificationSettings(payload: any) {
    const response = await api.patch('/notifications/settings', payload)
    return response.data
  }

  async registerFcmToken(payload: any) {
    const response = await api.post('/notifications/fcm-token', payload)
    return response.data
  }

  async unregisterFcmToken() {
    const response = await api.delete('/notifications/fcm-token')
    return response.data
  }

  async getFcmTokens() {
    const response = await api.get('/notifications/fcm-tokens')
    return response.data
  }
}

export const notificationService = new NotificationService()
