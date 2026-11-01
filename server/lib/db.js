import mongoose from 'mongoose'
let cached = global._mongo || (global._mongo = { conn: null, p: null })
export default async function db() {
  if (cached.conn) return cached.conn
  cached.p ||= mongoose.connect(process.env.MONGODB_URI)
  cached.conn = await cached.p
  return cached.conn
}
