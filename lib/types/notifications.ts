export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  data: {
    bountyId: string
    bountyTitle: string
  }
  isRead: boolean
  createdAt: string
}

export type Notifications = Notification[]

export interface NotificationSettings {
  id: string
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  bountyUpdates: boolean
  messageNotifications: boolean
  forumReplies: boolean
  reputationChanges: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateNotificationSettings {
  chatInApp: boolean
  chatEmail: boolean
  walletInApp: boolean
  walletEmail: boolean
  bountyInApp: boolean
  bountyEmail: boolean
  forumInApp: boolean
  forumEmail: boolean
  systemInApp: boolean
  systemEmail: boolean
}

export interface RegisterFCM {
  token: string
  deviceId: string
  platform: string
}

export interface FCMToken {
  id: string
  userId: string
  token: string
  deviceType: string
  createdAt: string
}

export type FCMTokens = FCMToken[]
