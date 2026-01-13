importScripts(
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js'
)

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// We use hardcoded logic or pass specific config query params if strictly needed,
// but usually just initializing with simplified config works for background handling.
// NOTE: For best security, these should ideally populate from a generated config or hardcoded for the specific deploy.
// Since this is static, we can't access process.env here directly.

// Wait for the window client to send the config
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    const config = event.data.config

    if (firebase.apps.length === 0) {
      firebase.initializeApp(config)
    }

    const messaging = firebase.messaging()

    messaging.onBackgroundMessage((payload) => {
      console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
      )
      // Customize notification here
      const notificationTitle =
        payload.notification?.title || 'Stallion Notification'
      const notificationOptions = {
        body: payload.notification?.body,
        icon: payload.notification?.icon || '/logo.png', // Add your logo path
        data: payload.data,
      }

      self.registration.showNotification(notificationTitle, notificationOptions)
    })
  }
})
