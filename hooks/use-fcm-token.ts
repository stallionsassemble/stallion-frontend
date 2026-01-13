'use client'

import { notificationService } from '@/lib/api/notifications'
import { fetchToken, messaging } from '@/lib/firebase'
import { useAuth } from '@/lib/store/use-auth'
import { onMessage } from 'firebase/messaging'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const useFcmToken = () => {
  const { user } = useAuth()
  const [token, setToken] = useState<string | null>(null)
  const [permission, setPermission] =
    useState<NotificationPermission>('default')

  useEffect(() => {
    // Only run on client and if user is logged in
    if (typeof window === 'undefined' || !user) return

    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          // Register the Service Worker
          const registration = await navigator.serviceWorker.register(
            '/firebase-messaging-sw.js'
          )

          // Send config to SW
          if (registration.active) {
            registration.active.postMessage({
              type: 'FIREBASE_CONFIG',
              config: {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId:
                  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
                measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
              },
            })
          }

          const permission = await Notification.requestPermission()
          setPermission(permission)

          if (permission === 'granted') {
            const currentToken = await fetchToken()
            if (currentToken) {
              setToken(currentToken)
              // Register token with backend
              await notificationService.registerFcmToken({
                token: currentToken,
                deviceId: navigator.userAgent, // Or a better unique ID if available
                platform: 'web',
              })
            }
          }
        }
      } catch (error) {
        console.error('An error occurred while retrieving token:', error)
      }
    }

    retrieveToken()
  }, [user]) // Re-run if user status changes

  // Foreground message listener
  useEffect(() => {
    if (typeof window === 'undefined' || !token) return

    const setupListener = async () => {
      const msg = await messaging()
      if (!msg) return

      const unsubscribe = onMessage(msg, (payload) => {
        console.log('Foreground message received:', payload)
        toast.info(payload.notification?.title || 'New Notification', {
          description: payload.notification?.body,
        })
      })

      return () => unsubscribe()
    }

    setupListener()
  }, [token])

  return { token, permission }
}
