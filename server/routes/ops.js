import { Router } from 'express'
import User from '../models/User.js'
import Application from '../models/Application.js'
import { Course } from '../models/index.js'
import { Expense, Refund, Quiz, QuizResult, Assignment, Submission, Batch } from '../models/ops.js'
import { protect, allow } from '../lib/auth.js'
const r = Router(), admin = [protect, allow('admin', 'superadmin')], sup = [protect, allow('superadmin')], staff = [protect, allow('admin', 'superadmin', 'mentor', 'staff')]
const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(500).json({ message: e.message }))
const can = (u, slug) => ['admin', 'superadmin', 'mentor', 'staff'].includes(u.role) || u.vip || u.courses.some(c => c.course === slug && (!c.expiresAt || c.expiresAt > new Date()))
const crud = (path, Model, guard = staff) => { r.get(`/admin/${path}`, guard, wrap(async (q, s) => s.json(await Model.find().sort('-createdAt').limit(300)))); r.post(`/admin/${path}`, guard, wrap(async (q, s) => s.status(201).json(await Model.create(q.body)))); r.delete(`/admin/${path}/:id`, guard, wrap(async (q, s) => s.json(await Model.findByIdAndDelete(q.params.id)))) }
crud('expenses', Expense, sup); crud('quizzes', Quiz); crud('assignments', Assignment)
r.get('/admin/refunds', sup, wrap(async (q, s) => s.json(await Refund.find().sort('-createdAt'))))
r.post('/admin/refunds', sup, wrap(async (req, res) => {
  const { applicationId, amount, reason } = req.body, a = await Application.findOne({ applicationId }), n = Number(amount)
  if (!a || !(n > 0) || n > a.amountPaid) return res.status(400).json({ message: 'Check application ID and amount (cannot exceed amount paid)' })
  a.amountPaid -= n; if (a.amountPaid === 0) a.paymentStatus = 'Refunded'; await a.save()
  res.status(201).json(await Refund.create({ applicationId, amount: n, reason }))
}))
r.get('/admin/finance/summary', sup, wrap(async (req, res) => {
  const paid = { paymentStatus: { $in: ['Verified', 'Partially Paid'] } }, apps = await Application.find(paid), fees = Object.fromEntries((await Course.find()).map(c => [c.slug, c.fee]))
  const byCourse = {}, byMonth = {}; let revenue = 0, dues = 0
  for (const a of apps) { revenue += a.amountPaid; byCourse[a.course] = (byCourse[a.course] || 0) + a.amountPaid; const k = a.createdAt.toISOString().slice(0, 7); (byMonth[k] ||= { revenue: 0, expenses: 0 }).revenue += a.amountPaid; if (a.paymentStatus === 'Partially Paid') dues += Math.max(0, (fees[a.course] || 0) - a.amountPaid) }
  const ex = await Expense.find(); let expenses = 0
  for (const e of ex) { expenses += e.amount; (byMonth[e.date.toISOString().slice(0, 7)] ||= { revenue: 0, expenses: 0 }).expenses += e.amount }
  const refunds = (await Refund.find()).reduce((t, x) => t + x.amount, 0)
  res.json({ revenue, expenses, refunds, net: revenue - expenses, dues, byCourse, byMonth: Object.entries(byMonth).sort().map(([month, v]) => ({ month, ...v })) })
}))
const cell = v => { let t = String(v ?? ''); if (/^[=+\-@]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"` }
r.get('/admin/export/:what', sup, wrap(async (req, res) => {
  const map = { students: [User.find({ role: 'student' }), ['name', 'email', 'phone', 'studentId', 'vip', 'blocked', 'createdAt']], applications: [Application.find(), ['applicationId', 'fullName', 'email', 'whatsapp', 'course', 'status', 'paymentStatus', 'amountPaid', 'createdAt']], expenses: [Expense.find(), ['title', 'category', 'amount', 'date']] }
  const x = map[req.params.what]; if (!x) return res.status(404).json({ message: 'Unknown export' })
  const rows = await x[0].lean(); res.setHeader('Content-Type', 'text/csv'); res.send([x[1].join(','), ...rows.map(d => x[1].map(k => cell(d[k])).join(','))].join('\n'))
}))
r.get('/quizzes/:course', protect, wrap(async (req, res) => { if (!can(req.user, req.params.course)) return res.status(403).json({ message: 'Not enrolled' }); res.json((await Quiz.find({ course: req.params.course })).map(q => ({ _id: q._id, title: q.title, questions: q.questions.map(x => ({ q: x.q, options: x.options })) }))) }))
r.post('/quizzes/:id/submit', protect, wrap(async (req, res) => {
  const q = await Quiz.findById(req.params.id); if (!q || !can(req.user, q.course)) return res.status(403).json({ message: 'Not allowed' })
  const score = q.questions.reduce((t, x, i) => t + (Number(req.body.answers?.[i]) === x.answer ? 1 : 0), 0)
  await QuizResult.create({ user: req.user._id, quiz: q._id, score, total: q.questions.length }); res.json({ score, total: q.questions.length })
}))
r.get('/assignments/:course', protect, wrap(async (req, res) => {
  if (!can(req.user, req.params.course)) return res.status(403).json({ message: 'Not enrolled' })
  const list = await Assignment.find({ course: req.params.course }).sort('due'), subs = await Submission.find({ user: req.user._id, assignment: { $in: list.map(a => a._id) } })
  res.json(list.map(a => ({ ...a.toObject(), submission: subs.find(s => String(s.assignment) === String(a._id)) || null })))
}))
r.post('/assignments/:id/submit', protect, wrap(async (req, res) => {
  const a = await Assignment.findById(req.params.id); if (!a || !can(req.user, a.course)) return res.status(403).json({ message: 'Not allowed' })
  res.json(await Submission.findOneAndUpdate({ user: req.user._id, assignment: a._id }, { text: req.body.text, status: 'Submitted' }, { upsert: true, new: true }))
}))
r.get('/admin/submissions', staff, wrap(async (req, res) => res.json(await Submission.find().populate('user', 'name studentId').populate('assignment', 'title course').sort('-updatedAt').limit(200))))
r.patch('/admin/submissions/:id', staff, wrap(async (req, res) => res.json(await Submission.findByIdAndUpdate(req.params.id, { status: req.body.status, feedback: req.body.feedback }, { new: true }))))
r.get('/admin/batches', staff, wrap(async (req, res) => res.json(await Batch.find().populate('students', 'name studentId').sort('-createdAt'))))
r.post('/admin/batches', staff, wrap(async (req, res) => res.status(201).json(await Batch.create(req.body))))
r.delete('/admin/batches/:id', staff, wrap(async (req, res) => res.json(await Batch.findByIdAndDelete(req.params.id))))
r.post('/admin/batches/:id/add', staff, wrap(async (req, res) => { const u = await User.findOne({ studentId: req.body.studentId }); if (!u) return res.status(404).json({ message: 'Student ID not found' }); res.json(await Batch.findByIdAndUpdate(req.params.id, { $addToSet: { students: u._id } }, { new: true })) }))
r.post('/admin/students/:id/extend', admin, wrap(async (req, res) => {
  const u = await User.findById(req.params.id), c = u.courses.find(x => x.course === req.body.course), days = Number(req.body.days)
  if (!c || !(days > 0)) return res.status(400).json({ message: 'Student is not enrolled in that course, or days is invalid' })
  c.expiresAt = new Date(Math.max(Date.now(), c.expiresAt || 0) + days * 864e5); await u.save(); res.json({ expiresAt: c.expiresAt })
}))
export default r
