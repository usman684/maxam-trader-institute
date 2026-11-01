import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { Message } from '../models/msg.js'
import { protect, allow } from '../lib/auth.js'
import { mail, hash, origin, sendVerification } from '../lib/mail.js'
const r = Router(), admin = [protect, allow('admin', 'superadmin', 'staff')]
const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(500).json({ message: e.message }))
r.post('/auth/forgot', wrap(async (req, res) => {
  const u = await User.findOne({ email: String(req.body.email || '').toLowerCase() })
  if (u) { const t = crypto.randomBytes(32).toString('hex'); u.resetHash = hash(t); u.resetExpires = new Date(Date.now() + 36e5); await u.save()
    await mail(u.email, 'Reset your password', `<p>Use this link within 1 hour:</p><p><a href="${origin()}/reset?token=${t}">Reset password</a></p><p>If you did not ask for this, ignore this email.</p>`) }
  res.json({ message: 'If this email is registered, a reset link has been sent.' })
}))
r.post('/auth/reset', wrap(async (req, res) => {
  const { token, password } = req.body
  if (!token || (password || '').length < 8) return res.status(400).json({ message: 'Password needs 8+ characters' })
  const u = await User.findOne({ resetHash: hash(token), resetExpires: { $gt: new Date() } })
  if (!u) return res.status(400).json({ message: 'This reset link is invalid or has expired' })
  u.password = await bcrypt.hash(password, 12); u.resetHash = undefined; u.resetExpires = undefined; await u.save(); res.json({ ok: true })
}))
r.post('/auth/verify-email', wrap(async (req, res) => {
  const u = await User.findOne({ verifyHash: hash(String(req.body.token || '')) })
  if (!u) return res.status(400).json({ message: 'This verification link is invalid' })
  if (u.pendingEmail) { u.email = u.pendingEmail; u.pendingEmail = undefined } u.emailVerified = true; u.verifyHash = undefined; await u.save(); res.json({ ok: true })
}))
r.post('/auth/change-email', protect, wrap(async (req, res) => {
  const u = await User.findById(req.user._id).select('+password'), e = String(req.body.email || '').toLowerCase()
  if (!(await bcrypt.compare(req.body.password || '', u.password))) return res.status(400).json({ message: 'Wrong password' })
  if (!/^\S+@\S+\.\S+$/.test(e)) return res.status(400).json({ message: 'Enter a valid email' })
  if (await User.findOne({ email: e })) return res.status(409).json({ message: 'That email is already registered' })
  const t = crypto.randomBytes(32).toString('hex'); u.pendingEmail = e; u.verifyHash = hash(t); await u.save()
  await mail(e, 'Confirm your new email', `<p>Confirm your new email address:</p><p><a href="${origin()}/verify-email?token=${t}">Confirm new email</a></p>`)
  res.json({ message: 'We sent a confirmation link to the new address. Your email changes after you confirm.' })
}))
r.post('/auth/resend-verification', protect, wrap(async (req, res) => { const sent = await sendVerification(req.user); res.json({ sent }) }))
r.post('/contact', body('name').notEmpty(), body('message').notEmpty(), body('email').optional({ checkFalsy: true }).isEmail(), wrap(async (req, res) => {
  const e = validationResult(req); if (!e.isEmpty()) return res.status(400).json({ message: 'Please fill name, message and a valid email' })
  const { name, email, phone, message } = req.body; await Message.create({ name, email, phone, message })
  await mail(process.env.CONTACT_EMAIL, `New message from ${name}`, `<p>${name} (${email || '-'}, ${phone || '-'})</p><p>${String(message).replace(/</g, '&lt;')}</p>`)
  res.status(201).json({ ok: true })
}))
r.get('/admin/messages', admin, wrap(async (req, res) => res.json(await Message.find().sort('-createdAt').limit(200))))
r.patch('/admin/messages/:id', admin, wrap(async (req, res) => res.json(await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }))))
export default r
