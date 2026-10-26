import bcrypt from 'bcryptjs'
import { connectDb, closeDb } from './db.js'

const secret = process.argv[2]

if (!secret) {
  console.error('Usage: npm run seed:admin -- <secret>')
  process.exit(1)
}

const db = await connectDb()
const secretHash = await bcrypt.hash(secret, 10)

await db.collection('admin').deleteMany({})
await db.collection('admin').insertOne({ secretHash, createdAt: new Date() })

console.log('Admin secret saved')
await closeDb()
