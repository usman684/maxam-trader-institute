import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import db from '../lib/db.js'
import routes from '../routes/index.js'
import extra from '../routes/extra.js'
import learn from '../routes/learn.js'
import cert from '../routes/cert.js'
import mailRoutes from '../routes/mail.js'
import ops from '../routes/ops.js'
import final from '../routes/final.js'
const app = express()
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }))
app.use(async (req, res, next) => { try { await db(); next() } catch { res.status(503).json({ message: 'Database unavailable' }) } })
app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api', routes)
app.use('/api', extra)
app.use('/api', learn)
app.use('/api', cert)
app.use('/api', mailRoutes)
app.use('/api', ops)
app.use('/api', final)
app.use((e, req, res, next) => res.status(400).json({ message: e.message }))
export default app
