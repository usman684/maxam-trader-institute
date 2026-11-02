import { Router } from 'express'
import PDFDocument from 'pdfkit'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Application from '../models/Application.js'
import { LiveClass, Attendance } from '../models/learn.js'
import { protect, allow, sign } from '../lib/auth.js'
import { upload, toCloud } from '../lib/upload.js'
import crypto from 'crypto'
import { mail, hash, origin } from '../lib/mail.js'
import { Demo } from '../models/index.js'
import { Content } from '../models/extra.js'
const r = Router(), admin = [protect, allow('admin', 'superadmin')], staffRole = [protect, allow('admin', 'superadmin', 'mentor', 'staff')]
const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(500).json({ message: e.message }))
const Staff = mongoose.models.Staff || mongoose.model('Staff', new mongoose.Schema({ name: String, role: String, department: String, phone: String, email: String, status: { type: String, default: 'Active' }, duties: String }, { timestamps: true }))
r.get('/admin/staff', admin, wrap(async (q, s) => s.json(await Staff.find().sort('-createdAt'))))
r.post('/admin/staff', admin, wrap(async (q, s) => s.status(201).json(await Staff.create(q.body))))
r.delete('/admin/staff/:id', admin, wrap(async (q, s) => s.json(await Staff.findByIdAndDelete(q.params.id))))
r.post('/admin/upload', admin, upload.single('file'), wrap(async (req, res) => req.file ? res.json({ url: await toCloud(req.file, 'content') }) : res.status(400).json({ message: 'Choose an image' })))
r.get('/admin/reports/attendance', staffRole, wrap(async (req, res) => {
  const m = /^\d{4}-\d{2}$/.test(req.query.month || '') ? req.query.month : new Date().toISOString().slice(0, 7)
  const from = new Date(m + '-01T00:00:00Z'), to = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1))
  const classes = await LiveClass.find({ date: { $gte: from, $lt: to } }), recs = await Attendance.find({ liveClass: { $in: classes.map(c => c._id) } }).populate('user', 'name studentId')
  const by = {}; for (const a of recs) { if (!a.user) continue; const e = (by[a.user._id] ||= { name: a.user.name, studentId: a.user.studentId, Present: 0, Absent: 0, Late: 0, Excused: 0 }); e[a.status]++ }
  res.json({ month: m, classes: classes.length, students: Object.values(by) })
}))
const sendReceipt = (a, res) => {
  const d = new PDFDocument({ size: 'A5', margin: 40 }); res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', `attachment; filename=receipt-${a.applicationId}.pdf`); d.pipe(res)
  d.fontSize(18).fillColor('#B8860B').text('MAXAM TRADER INSTITUTE', { align: 'center' }); d.fontSize(12).fillColor('#000').text('Application Receipt', { align: 'center' }).moveDown()
  ;[['Application ID', a.applicationId], ['Name', a.fullName], ['Course', a.course], ['Status', a.status], ['Payment status', a.paymentStatus], ['Amount verified', 'Rs. ' + a.amountPaid], ['Date', a.createdAt.toLocaleDateString('en-GB')]].forEach(([k, v]) => d.text(`${k}: ${v}`))
  d.moveDown().fontSize(9).fillColor('#666').text('Payment counts only after verification by our team. This receipt is not proof of enrollment.'); d.end()
}
r.get('/my/receipt/:appId', protect, wrap(async (req, res) => {
  const a = await Application.findOne({ applicationId: req.params.appId })
  if (!a || String(a.email).toLowerCase() !== String(req.user.email).toLowerCase()) return res.status(404).json({ message: 'Receipt not found' })
  sendReceipt(a, res)
}))
r.post('/admin/students/:id/reset-link', admin, wrap(async (req, res) => {
  const u = await User.findById(req.params.id); if (!u) return res.status(404).json({ message: 'Student not found' })
  const t = crypto.randomBytes(32).toString('hex'); u.resetHash = hash(t); u.resetExpires = new Date(Date.now() + 36e5); await u.save()
  const sent = await mail(u.email, 'Reset your password', `<p>Our team sent you a password reset link (valid for 1 hour):</p><p><a href="${origin()}/reset?token=${t}">Reset password</a></p>`)
  res.json({ sent })
}))
r.post('/applications/receipt', wrap(async (req, res) => {
  const { applicationId, contact } = req.body, a = await Application.findOne({ applicationId, $or: [{ email: String(contact).toLowerCase() }, { whatsapp: contact }] })
  if (!a) return res.status(404).json({ message: 'No matching application' })
  sendReceipt(a, res)
}))
const sup = [protect, allow('superadmin')]
r.post('/auth/admin-login', wrap(async (req, res) => {
  const u = await User.findOne({ email: String(req.body.email || '').toLowerCase() }).select('+password')
  const why = !u ? 'no account with this email' : u.blocked ? 'account is blocked' : u.role === 'student' ? 'this is a student account (role: student)' : !(await bcrypt.compare(req.body.password || '', u.password)) ? 'wrong password' : ''
  if (why) { if (process.env.NODE_ENV !== 'production') console.log('team login failed:', why); return res.status(401).json({ message: 'Invalid team login' }) }
  res.json({ token: sign(u), user: { id: u._id, name: u.name, role: u.role } })
}))
r.patch('/admin/users/role', sup, wrap(async (req, res) => {
  const { email, role } = req.body
  if (!['admin', 'mentor', 'staff', 'student'].includes(role)) return res.status(400).json({ message: 'Choose a role' })
  const u = await User.findOne({ email: String(email || '').toLowerCase() }); if (!u) return res.status(404).json({ message: 'No user with this email' })
  if (u.role === 'superadmin') return res.status(400).json({ message: 'The Super Admin role cannot be changed here' })
  u.role = role; await u.save(); res.json({ email: u.email, role: u.role })
}))
r.patch('/admin/users/:id/block', sup, wrap(async (req, res) => {
  const u = await User.findById(req.params.id); if (!u || u.role === 'superadmin') return res.status(400).json({ message: 'Not allowed' })
  u.blocked = !u.blocked; await u.save(); res.json({ blocked: u.blocked })
}))
r.get('/admin/users', sup, wrap(async (q, s) => s.json(await User.find({ role: { $ne: 'student' } }).select('name email role blocked createdAt').sort('-createdAt'))))
r.post('/admin/users', sup, wrap(async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || (password || '').length < 8 || !['admin', 'mentor', 'staff'].includes(role)) return res.status(400).json({ message: 'Name, email, role and an 8+ character password are required' })
  if (await User.findOne({ email: String(email).toLowerCase() })) return res.status(409).json({ message: 'Email already registered' })
  const u = await User.create({ name, email, role, password: await bcrypt.hash(password, 12), emailVerified: true }); res.status(201).json({ id: u._id, email: u.email, role: u.role })
}))
const match = b => Application.findOne({ applicationId: b.applicationId, $or: [{ email: String(b.contact || '').toLowerCase() }, { whatsapp: b.contact }] })
r.post('/applications/payment', upload.single('paymentScreenshot'), wrap(async (req, res) => {
  const a = await match(req.body); if (!a) return res.status(404).json({ message: 'No matching application' })
  if (['Verified', 'Refunded'].includes(a.paymentStatus)) return res.status(400).json({ message: 'This payment is already verified' })
  if (!req.body.transactionId && !req.file) return res.status(400).json({ message: 'Add a transaction ID or a screenshot' })
  if (req.body.transactionId) a.transactionId = req.body.transactionId
  if (req.body.paymentMethod) a.paymentMethod = req.body.paymentMethod
  if (req.file) a.paymentScreenshot = await toCloud(req.file, 'payments')
  a.paymentStatus = 'Pending Verification'; await a.save(); res.json({ paymentStatus: a.paymentStatus })
}))
r.post('/applications/documents', upload.array('documents', 3), wrap(async (req, res) => {
  const a = await match(req.body); if (!a) return res.status(404).json({ message: 'No matching application' })
  if (!req.files?.length) return res.status(400).json({ message: 'Choose at least one file' })
  a.documents.push(...await Promise.all(req.files.map(f => toCloud(f, 'documents')))); if (a.status === 'Documents Required') a.status = 'Under Review'
  await a.save(); res.json({ status: a.status })
}))
r.patch('/admin/demo/:id', admin, wrap(async (req, res) => res.json(await Demo.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }))))
const esc = t => String(t || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
r.post('/admin/announce-email/:id', admin, wrap(async (req, res) => {
  const c = await Content.findById(req.params.id); if (!c || c.type !== 'announcement') return res.status(404).json({ message: 'Announcement not found' })
  const us = await User.find({ role: 'student', blocked: false }).select('email').limit(1000); let n = 0
  for (let i = 0; i < us.length; i += 50) { const chunk = us.slice(i, i + 50); if (await mail(null, c.title, `<p><b>${esc(c.title)}</b></p><p>${esc(c.body)}</p>`, chunk.map(u => u.email))) n += chunk.length }
  res.json({ sent: n })
}))
r.get('/live/public', wrap(async (q, s) => s.json(await LiveClass.find({ date: { $gte: new Date() } }).sort('date').limit(5).select('title date mentor course'))))
r.get('/cron/expiry', wrap(async (req, res) => {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ message: 'Unauthorized' })
  const soon = new Date(Date.now() + 3 * 864e5), users = await User.find({ 'courses.expiresAt': { $gt: new Date(), $lte: soon } }); let n = 0
  for (const u of users) for (const c of u.courses) if (c.expiresAt > new Date() && c.expiresAt <= soon) { await mail(u.email, 'Your course access ends soon', `<p>Dear ${u.name}, your access to <b>${c.course}</b> ends on ${c.expiresAt.toLocaleDateString('en-GB')}. Contact the office to extend it.</p>`); n++ }
  let k = 0
  const cls = await LiveClass.find({ date: { $gt: new Date(), $lte: new Date(Date.now() + 864e5) } })
  for (const c of cls) { const st = await User.find({ role: 'student', $or: [{ vip: true }, { 'courses.course': c.course }] }).select('email name').limit(200); for (const u of st) { await mail(u.email, `Class tomorrow: ${c.title}`, `<p>Dear ${u.name}, reminder: <b>${c.title}</b> on ${c.date.toLocaleString('en-GB')}${c.mentor ? ' with ' + c.mentor : ''}. Join from your dashboard.</p>`); k++ } }
  res.json({ reminders: n, classReminders: k })
}))
export default r
