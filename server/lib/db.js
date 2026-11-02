import mongoose from 'mongoose'
let cached = global._mongo || (global._mongo = { conn: null, p: null })
export default async function db() {
  if (cached.conn) return cached.conn
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set. Check server/.env')
  cached.p ||= mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
  try { cached.conn = await cached.p } catch (e) { cached.p = null; throw e }
  return cached.conn
}
