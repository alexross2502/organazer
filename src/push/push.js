import { apiFetch } from '../auth/api.js'

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error)
    })
  })
}

export function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
}

export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export function getPermission() {
  return 'Notification' in window ? Notification.permission : 'denied'
}

export async function getSubscription() {
  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.getSubscription()
}

export async function subscribe() {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Permission denied')
  }

  const registration = await navigator.serviceWorker.ready
  const { key } = await apiFetch('/push/key')
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(key),
  })

  await apiFetch('/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription.toJSON()),
  })

  return subscription
}

export async function unsubscribe() {
  const subscription = await getSubscription()
  if (!subscription) return

  await apiFetch('/push/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  })
  await subscription.unsubscribe()
}

export async function sendTest() {
  return apiFetch('/push/test', { method: 'POST' })
}

function urlBase64ToUint8Array(value) {
  const padding = '='.repeat((4 - (value.length % 4)) % 4)
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
}
