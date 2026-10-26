import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDb } from './db.js'

const jwtSecret = process.env.JWT_SECRET
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d'

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not set')
}

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  const secret = req.body?.secret

  if (typeof secret !== 'string' || !secret) {
    return res.status(400).json({ error: 'Secret is required' })
  }

  const admin = await getDb().collection('admin').findOne({})

  if (!admin || !(await bcrypt.compare(secret, admin.secretHash))) {
    return res.status(401).json({ error: 'Wrong secret' })
  }

  const token = jwt.sign({ sub: String(admin._id), role: 'admin' }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  })

  res.json({ token })
})

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

export function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    req.user = jwt.verify(token, jwtSecret)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
