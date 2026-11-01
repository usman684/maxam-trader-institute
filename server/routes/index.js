import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import Application from '../models/Application.js'
import { Course, Signal, Setting, Appointment, Demo } from '../models/index.js'
import { sign, protect, allow } from '../lib/auth.js'
import { upload, toCloud } from '../lib/upload.js'
import { mail, sendVerification } from '../lib/mail.js'

const r = Router()
const admin = [protect, allow('admin', 'superadmin')]
const sup = [protect, allow('superadmin')]
const check = (req, res, next) => { const e = validationResult(req); return e.isEmpty() ? next() : res.status(400).json({ message: e.array()[0].msg }) }
const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(500).json({ message: e.message }))

// AUTH
r.post('/auth/signup', body('email').isEmail(), body('password').isLength({ min: 8 }).withMessage('Password needs 8+ characters'), body('name').notEmpty(), check, wrap(async (req, res) => {
  const { name, email, phone, password } = req.body
  if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' })
  const u = await User.create({ name, email, phone, password: await bcrypt.hash(password, 12), studentId: 'MX' + Date.now().toString().slice(-7) })
  await sendVerification(u)
  res.status(201).json({ token: sign(u), user: { id: u._id, name: u.name, role: u.role } })
}))
r.post('/auth/login', wrap(async (req, res) => {
  const u = await User.findOne({ email: String(req.body.email).toLowerCase() }).select('+password')
  if (!u || u.blocked || !(await bcrypt.compare(req.body.password || '', u.password))) return res.status(401).json({ message: 'Invalid email or password' })
  res.json({ token: sign(u), user: { id: u._id, name: u.name, role: u.role, vip: u.vip } })
}))
r.get('/auth/me', protect, (req, res) => res.json(req.user))
r.post('/auth/change-password', protect, wrap(async (req, res) => {
  const u = await User.findById(req.user._id).select('+password')
  if (!(await bcrypt.compare(req.body.current || '', u.password)) || (req.body.next || '').length < 8) return res.status(400).json({ message: 'Check current and new password' })
  u.password = await bcrypt.hash(req.body.next, 12); await u.save(); res.json({ ok: true })
}))

// APPLICATIONS
const files = upload.fields([{ name: 'paymentScreenshot', maxCount: 1 }, { name: 'photo', maxCount: 1 }, { name: 'documents', maxCount: 3 }])
r.post('/applications', files, body('fullName').notEmpty(), body('email').isEmail(), body('whatsapp').notEmpty(), body('course').notEmpty(), body('terms').equals('true').withMessage('Please accept the terms'), check, wrap(async (req, res) => {
  const f = req.files || {}
  const a = await Application.create({ ...req.body, notes: undefined, applicationId: 'MAX-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
    paymentScreenshot: await toCloud(f.paymentScreenshot?.[0], 'payments'), photo: await toCloud(f.photo?.[0], 'students'), documents: await Promise.all((f.documents || []).map(x => toCloud(x, 'documents'))),
    status: 'Submitted', paymentStatus: req.body.transactionId ? 'Pending Verification' : 'Unpaid', amountPaid: 0 })
  await mail(a.email, `Application received: ${a.applicationId}`, `<p>Dear ${a.fullName}, we received your application. Your Application ID is <b>${a.applicationId}</b>. Keep it to track your status. Payment is confirmed only after our team verifies it.</p>`)
  res.status(201).json({ applicationId: a.applicationId, status: a.status })
}))
r.post('/applications/track', wrap(async (req, res) => {
  const { applicationId, contact } = req.body
  const a = await Application.findOne({ applicationId, $or: [{ email: String(contact).toLowerCase() }, { whatsapp: contact }] })
  if (!a) return res.status(404).json({ message: 'No matching application' })
  res.json({ applicationId: a.applicationId, fullName: a.fullName, course: a.course, status: a.status, paymentStatus: a.paymentStatus, studentNote: a.studentNote })
}))
r.get('/admin/applications', admin, wrap(async (req, res) => res.json(await Application.find(req.query.status ? { status: req.query.status } : {}).sort('-createdAt').limit(200))))
r.patch('/admin/applications/:id', admin, wrap(async (req, res) => {
  const { status, notes, studentNote } = req.body
  const a = await Application.findByIdAndUpdate(req.params.id, { ...(status && { status }), ...(notes !== undefined && { notes }), ...(studentNote !== undefined && { studentNote }) }, { new: true })
  if (status) await mail(a.email, `Application ${a.applicationId}: ${status}`, `<p>Dear ${a.fullName}, your application status is now <b>${status}</b>.</p>`)
  res.json(a)
}))
// Payment is verified ONLY by an admin, never by upload.
r.patch('/admin/applications/:id/payment', admin, wrap(async (req, res) => {
  const { paymentStatus, amountPaid } = req.body
  const a = await Application.findByIdAndUpdate(req.params.id, { paymentStatus, ...(amountPaid !== undefined && { amountPaid }) }, { new: true })
  await mail(a.email, `Payment ${paymentStatus}: ${a.applicationId}`, `<p>Dear ${a.fullName}, your payment status is now <b>${paymentStatus}</b>.</p>`)
  res.json(a)
}))
r.post('/admin/applications/:id/enroll', admin, wrap(async (req, res) => {
  const a = await Application.findById(req.params.id)
  if (a.paymentStatus !== 'Verified') return res.status(400).json({ message: 'Verify payment before enrolling' })
  const temp = crypto.randomBytes(5).toString('hex')
  let u = await User.findOne({ email: a.email })
  if (!u) u = await User.create({ name: a.fullName, email: a.email, phone: a.whatsapp, password: await bcrypt.hash(temp, 12), studentId: 'MX' + Date.now().toString().slice(-7) })
  u.courses.push({ course: a.course, enrolledAt: new Date() }); if (a.course === 'vip-lifetime-mentorship') u.vip = true
  await u.save(); a.status = 'Enrolled'; await a.save()
  await mail(u.email, 'You are enrolled', `<p>Dear ${u.name}, you are enrolled. Your Student ID is <b>${u.studentId}</b>. Use "Forgot password" on the login page to set your own password, or use the temporary password from our office.</p>`)
  res.json({ studentId: u.studentId, tempPassword: temp })
}))

// COURSES / SETTINGS / SIGNALS
r.get('/courses', wrap(async (req, res) => res.json(await Course.find({ active: true }).sort('order'))))
r.post('/admin/courses', admin, wrap(async (req, res) => res.status(201).json(await Course.create(req.body))))
r.put('/admin/courses/:id', admin, wrap(async (req, res) => res.json(await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }))))
r.delete('/admin/courses/:id', sup, wrap(async (req, res) => res.json(await Course.findByIdAndDelete(req.params.id))))
r.get('/settings', wrap(async (req, res) => { const all = await Setting.find({ key: { $ne: 'payment' } }); res.json(Object.fromEntries(all.map(s => [s.key, s.value]))) }))
r.get('/payment-info', wrap(async (req, res) => res.json((await Setting.findOne({ key: 'payment' }))?.value || {})))
r.put('/admin/settings/:key', sup, wrap(async (req, res) => res.json(await Setting.findOneAndUpdate({ key: req.params.key }, { value: req.body.value }, { upsert: true, new: true }))))
r.get('/signals/free', wrap(async (req, res) => res.json(await Signal.find({ vip: false }).sort('-createdAt').limit(3))))
r.get('/signals/vip', protect, wrap(async (req, res) => req.user.vip || ['admin', 'superadmin'].includes(req.user.role) ? res.json(await Signal.find().sort('-createdAt')) : res.status(403).json({ message: 'VIP membership required' })))
r.post('/admin/signals', admin, wrap(async (req, res) => res.status(201).json(await Signal.create(req.body))))
r.put('/admin/signals/:id', admin, wrap(async (req, res) => res.json(await Signal.findByIdAndUpdate(req.params.id, req.body, { new: true }))))

// APPOINTMENTS / DEMO
r.post('/appointments', body('name').notEmpty(), body('phone').notEmpty(), check, wrap(async (req, res) => res.status(201).json(await Appointment.create(req.body))))
r.get('/admin/appointments', admin, wrap(async (req, res) => res.json(await Appointment.find().sort('-createdAt'))))
r.patch('/admin/appointments/:id', admin, wrap(async (req, res) => res.json(await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }))))
r.post('/demo', body('name').notEmpty(), body('whatsapp').notEmpty(), check, wrap(async (req, res) => res.status(201).json(await Demo.create(req.body))))
r.get('/admin/demo', admin, wrap(async (req, res) => res.json(await Demo.find().sort('-createdAt'))))

// ADMIN
r.get('/admin/stats', admin, wrap(async (req, res) => {
  const [students, vip, pendingApps, pendingPay, courses, appts] = await Promise.all([
    User.countDocuments({ role: 'student' }), User.countDocuments({ vip: true }), Application.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } }),
    Application.countDocuments({ paymentStatus: 'Pending Verification' }), Course.countDocuments(), Appointment.countDocuments({ status: 'Pending' })])
  const rev = await Application.aggregate([{ $match: { paymentStatus: { $in: ['Verified', 'Partially Paid'] } } }, { $group: { _id: null, t: { $sum: '$amountPaid' } } }])
  res.json({ students, vip, pendingApps, pendingPay, courses, appts, revenue: rev[0]?.t || 0 })
}))
r.get('/admin/students', admin, wrap(async (req, res) => res.json(await User.find({ role: 'student' }).sort('-createdAt').limit(200))))
r.patch('/admin/students/:id', admin, wrap(async (req, res) => { const { vip, blocked } = req.body; res.json(await User.findByIdAndUpdate(req.params.id, { ...(vip !== undefined && { vip }), ...(blocked !== undefined && { blocked }) }, { new: true })) }))
export default r
