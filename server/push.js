import { Router } from 'express'
import webpush from 'web-push'
import { getDb } from './db.js'
import { requireAuth } from './auth.js'

const publicKey = process.env.VAPID_PUBLIC_KEY
const privateKey = process.env.VAPID_PRIVATE_KEY
const subject = process.env.VAPID_SUBJECT

if (!publicKey || !privateKey || !subject) {
  throw new Error('VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and VAPID_SUBJECT must be set')
}

webpush.setVapidDetails(subject, publicKey, privateKey)

const subscriptions = () => getDb().collection('pushSubscriptions')

export const pushRouter = Router()

pushRouter.use(requireAuth)

pushRouter.get('/key', (req, res) => {
  res.json({ key: publicKey })
})

pushRouter.post('/subscribe', async (req, res) => {
  const endpoint = req.body?.endpoint
  const keys = req.body?.keys

  if (typeof endpoint !== 'string' || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ error: 'Invalid subscription' })
  }

  await subscriptions().updateOne(
    { endpoint },
    {
      $set: { keys: { p256dh: keys.p256dh, auth: keys.auth }, userId: req.user.sub },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  )

  res.json({ ok: true })
})

pushRouter.post('/unsubscribe', async (req, res) => {
  const endpoint = req.body?.endpoint

  if (typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Endpoint is required' })
  }

  await subscriptions().deleteOne({ endpoint, userId: req.user.sub })
  res.json({ ok: true })
})

pushRouter.post('/test', async (req, res) => {
  const sent = await sendToUser(req.user.sub, {
    title: 'organazer',
    body: 'Тестовое уведомление работает',
    url: '/home',
  })

  res.json({ sent })
})

export async function sendToUser(userId, payload) {
  const list = await subscriptions().find({ userId }).toArray()
  let sent = 0

  for (const { endpoint, keys } of list) {
    try {
      await webpush.sendNotification({ endpoint, keys }, JSON.stringify(payload))
      sent++
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await subscriptions().deleteOne({ endpoint })
      } else {
        console.error('Push failed:', error.statusCode, error.body || error.message)
      }
    }
  }

  return sent
}