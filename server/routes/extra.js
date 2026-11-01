import { Router } from 'express'
import Application from '../models/Application.js'
import { Signal } from '../models/index.js'
import { Content, Ticket } from '../models/extra.js'
import { protect, allow } from '../lib/auth.js'
import User from '../models/User.js'
import { upload, toCloud } from '../lib/upload.js'
const r = Router(), admin = [protect, allow('admin', 'superadmin')]
const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(500).json({ message: e.message }))
r.get('/content/:type', wrap(async (req, res) => res.json(await Content.find({ type: req.params.type, approved: true, ...(req.query.category && { category: String(req.query.category) }) }).sort('-createdAt'))))
r.get('/admin/content', admin, wrap(async (req, res) => res.json(await Content.find().sort('-createdAt'))))
r.post('/admin/content', admin, wrap(async (req, res) => res.status(201).json(await Content.create(req.body))))
r.delete('/admin/content/:id', admin, wrap(async (req, res) => res.json(await Content.findByIdAndDelete(req.params.id))))
r.patch('/admin/content/:id', admin, wrap(async (req, res) => res.json(await Content.findByIdAndUpdate(req.params.id, { approved: !!req.body.approved }, { new: true }))))
r.post('/reviews', wrap(async (req, res) => {
  const { name, text, rating, website } = req.body
  if (website) return res.json({ ok: true })
  if (!name || !text || String(text).length > 500 || String(name).length > 80) return res.status(400).json({ message: 'Please enter your name and a review under 500 characters' })
  await Content.create({ type: 'review', title: String(name).slice(0, 80), body: String(text).slice(0, 500), rating: Math.min(5, Math.max(1, Number(rating) || 5)), approved: false })
  res.status(201).json({ ok: true })
}))
r.get('/my/payments', protect, wrap(async (req, res) => res.json(await Application.find({ email: req.user.email }).select('applicationId course paymentMethod transactionId paymentStatus amountPaid createdAt').sort('-createdAt'))))
r.get('/admin/signals', admin, wrap(async (req, res) => res.json(await Signal.find().sort('-createdAt'))))
r.post('/tickets', protect, wrap(async (req, res) => res.status(201).json(await Ticket.create({ user: req.user._id, subject: req.body.subject, messages: [{ from: 'student', text: req.body.text }] }))))
r.get('/tickets', protect, wrap(async (req, res) => res.json(await Ticket.find({ user: req.user._id }).sort('-updatedAt'))))
r.post('/tickets/:id/reply', protect, wrap(async (req, res) => { const t = await Ticket.findOne({ _id: req.params.id, user: req.user._id }); t.messages.push({ from: 'student', text: req.body.text }); await t.save(); res.json(t) }))
r.get('/admin/tickets', admin, wrap(async (req, res) => res.json(await Ticket.find().populate('user', 'name email').sort('-updatedAt'))))
r.post('/admin/tickets/:id/reply', admin, wrap(async (req, res) => { const t = await Ticket.findById(req.params.id); t.messages.push({ from: 'staff', text: req.body.text }); if (req.body.close) t.status = 'Closed'; await t.save(); res.json(t) }))
r.patch('/auth/profile', protect, upload.single('photo'), wrap(async (req, res) => {
  const { name, phone, address } = req.body, u = await User.findById(req.user._id)
  if (name) u.name = name; if (phone !== undefined) u.phone = phone; if (address !== undefined) u.address = address
  if (req.file) u.photo = await toCloud(req.file, 'students')
  await u.save(); res.json(u)
}))
export default r
