import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { connectDb, getDb, closeDb } from './db.js'
import { authRouter } from './auth.js'
import { pushRouter } from './push.js'

const app = express()
const port = Number(process.env.PORT) || 3000
const distDir = fileURLToPath(new URL('../dist', import.meta.url))

app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/push', pushRouter)

app.get('/api/health', async (req, res) => {
  try {
    await getDb().command({ ping: 1 })
    res.json({ status: 'ok', db: 'connected' })
  } catch (error) {
    res.status(503).json({ status: 'error', db: error.message })
  }
})

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('/{*path}', (req, res) => {
    res.sendFile('index.html', { root: distDir })
  })
}

async function start() {
  await connectDb()
  const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })

  const shutdown = async () => {
    server.close()
    await closeDb()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
