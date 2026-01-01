import { api } from '@/lib/api'
import {
  FCMTokens,
  Notifications,
  NotificationSettings,
  RegisterFCM,
  UpdateNotificationSettings,
} from '@/lib/types/notifications'

class NotificationService {
  async getNotifications() {
    const response = await api.get<Notifications>('/notifications')
    return response.data
  }

  async notificationsUnreadCount() {
    const response = await api.get<{ count: number }>(
      '/notifications/unread-count'
    )
    return response.data || { count: 0 }
  }

  async markNotificationRead(notificationId: string) {
    const response = await api.patch<Notification>(
      `/notifications/${notificationId}/read`
    )
    return response.data
  }

  async markAllNotificationsRead() {
    const response = await api.patch<{ message: string; count: number }>(
      '/notifications/read-all'
    )
    return response.data
  }

  async deleteNotification(notificationId: string) {
    const response = await api.delete<{ message: string }>(
      `/notifications/${notificationId}`
    )
    return response.data
  }

  async notificationSettings() {
    const response = await api.get<NotificationSettings>(
      '/notifications/settings'
    )
    return response.data
  }

  async updateNotificationSettings(payload: UpdateNotificationSettings) {
    const response = await api.patch<NotificationSettings>(
      '/notifications/settings',
      payload
    )
    return response.data
  }

  async registerFcmToken(payload: RegisterFCM) {
    const response = await api.post('/notifications/fcm-token', payload)
    return response.data
  }

  async unregisterFcmToken(token: string) {
    const response = await api.delete<{ message: string }>(
      `/notifications/fcm-token/${token}`
    )
    return response.data
  }

  async getFcmTokens() {
    const response = await api.get<FCMTokens>('/notifications/fcm-tokens')
    return response.data
  }
}

export const notificationService = new NotificationService()
