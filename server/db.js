import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI is not set')
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

let db

export async function connectDb() {
  await client.connect()
  db = client.db(process.env.MONGODB_DB || 'organazer')
  await db.command({ ping: 1 })
  console.log(`MongoDB connected: ${db.databaseName}`)
  return db
}

export function getDb() {
  if (!db) {
    throw new Error('Database is not connected')
  }
  return db
}

export async function closeDb() {
  await client.close()
}
