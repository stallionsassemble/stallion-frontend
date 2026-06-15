import { getApp, getApps, initializeApp } from 'firebase/app'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth'

// Initialize Firebase
let app: any;
let auth: any;

if (firebaseConfig.apiKey) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  auth = getAuth(app)
}

const googleProvider = firebaseConfig.apiKey ? new GoogleAuthProvider() : null
const appleProvider = firebaseConfig.apiKey ? new OAuthProvider('apple.com') : null

const messaging = async () => {
  if (!app) return null
  const supported = await isSupported()
  return supported ? getMessaging(app) : null
}

export { app, auth, googleProvider, appleProvider, messaging }

export const fetchToken = async () => {
  if (!app) return null
  try {
    const msg = await messaging()
    if (!msg) return null

    const currentToken = await getToken(msg, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    })

    if (currentToken) {
      return currentToken
    } else {
      return null
    }
  } catch {
    return null
  }
}
