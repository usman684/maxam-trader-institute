import { Router } from 'express'
import crypto from 'crypto'
import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import User from '../models/User.js'
import { Course } from '../models/index.js'
import { Lesson, Progress } from '../models/learn.js'
import { Certificate } from '../models/cert.js'
import { protect, allow } from '../lib/auth.js'
import { origin } from '../lib/mail.js'
const r = Router(), admin = [protect, allow('admin', 'superadmin')]
const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(500).json({ message: e.message }))
r.get('/admin/courses', admin, wrap(async (req, res) => res.json(await Course.find().sort('order'))))
r.post('/admin/courses/seed', admin, wrap(async (req, res) => {
  for (const [i, c] of req.body.courses.entries()) await Course.updateOne({ slug: c.slug }, { $setOnInsert: { ...c, originalFee: c.original, order: i, active: true } }, { upsert: true })
  res.json({ ok: true })
}))
r.post('/admin/certificates', admin, wrap(async (req, res) => {
  const { userId, course, force } = req.body, u = await User.findById(userId)
  if (!u) return res.status(404).json({ message: 'Student not found' })
  const lessons = await Lesson.find({ course }), done = await Progress.countDocuments({ user: u._id, lesson: { $in: lessons.map(l => l._id) } })
  if (!force && (!lessons.length || done < lessons.length)) return res.status(400).json({ message: `Course not completed (${done}/${lessons.length} lessons). Issue anyway only if you have verified completion.` })
  res.status(201).json(await Certificate.create({ certId: 'MXC-' + crypto.randomBytes(4).toString('hex').toUpperCase(), user: u._id, studentName: u.name, course, completedAt: new Date() }))
}))
r.get('/admin/certificates', admin, wrap(async (req, res) => res.json(await Certificate.find().sort('-createdAt'))))
r.get('/my/certificates', protect, wrap(async (req, res) => res.json(await Certificate.find({ user: req.user._id }).sort('-createdAt'))))
r.get('/verify/:id', wrap(async (req, res) => {
  const c = await Certificate.findOne({ certId: req.params.id.toUpperCase() })
  c ? res.json({ valid: true, certId: c.certId, studentName: c.studentName, course: c.course, completedAt: c.completedAt }) : res.status(404).json({ valid: false, message: 'No certificate with this ID' })
}))
r.get('/certificates/:id/pdf', protect, wrap(async (req, res) => {
  const c = await Certificate.findOne({ certId: req.params.id })
  if (!c || (String(c.user) !== String(req.user._id) && !['admin', 'superadmin'].includes(req.user.role))) return res.status(403).json({ message: 'Not allowed' })
  const qr = await QRCode.toBuffer(`${origin()}/verify?id=${c.certId}`, { margin: 1 })
  const d = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 }); res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', `attachment; filename=${c.certId}.pdf`); d.pipe(res)
  const W = d.page.width, H = d.page.height, gold = '#B8860B'
  d.rect(0, 0, W, H).fill('#050505'); d.rect(20, 20, W - 40, H - 40).lineWidth(3).stroke('#FFD700'); d.rect(30, 30, W - 60, H - 60).lineWidth(1).stroke(gold)
  const cx = W / 2, hx = [[0, -34], [30, -17], [30, 17], [0, 34], [-30, 17], [-30, -17]].map(([x, y]) => [cx + x, 90 + y])
  d.polygon(...hx).lineWidth(3).stroke('#FFD700'); d.fillColor('#FFD700').font('Helvetica-Bold').fontSize(30).text('M', cx - 20, 72, { width: 40, align: 'center' })
  d.fontSize(16).text('MAXAM TRADER INSTITUTE', 0, 140, { align: 'center', width: W }); d.fillColor('#fff').font('Helvetica').fontSize(30).text('Certificate of Completion', 0, 185, { align: 'center', width: W })
  d.fontSize(14).fillColor('#aaa').text('This certifies that', 0, 245, { align: 'center', width: W }); d.fillColor('#FFD700').font('Helvetica-Bold').fontSize(34).text(c.studentName, 0, 275, { align: 'center', width: W })
  d.fillColor('#aaa').font('Helvetica').fontSize(14).text('has successfully completed', 0, 330, { align: 'center', width: W }); d.fillColor('#fff').fontSize(24).text(c.course.replace(/-/g, ' ').toUpperCase(), 0, 358, { align: 'center', width: W })
  d.fillColor('#aaa').fontSize(12).text(`Certificate ID: ${c.certId}   Completed: ${c.completedAt.toLocaleDateString('en-GB')}`, 0, 410, { align: 'center', width: W })
  d.image(qr, W - 150, H - 150, { width: 90 }); d.fontSize(9).text('Scan to verify', W - 150, H - 55, { width: 90, align: 'center' })
  d.moveTo(80, H - 80).lineTo(260, H - 80).stroke(gold); d.fontSize(10).text('Authorized signature', 80, H - 72); d.end()
}))
export default r
