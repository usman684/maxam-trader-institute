import { Router } from 'express'
import User from '../models/User.js'
import { Lesson, Progress, LiveClass, Attendance } from '../models/learn.js'
import { protect, allow } from '../lib/auth.js'
const r = Router(), staff = [protect, allow('admin', 'superadmin', 'mentor', 'staff')]
const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(500).json({ message: e.message }))
const can = (u, slug) => ['admin', 'superadmin', 'mentor', 'staff'].includes(u.role) || u.vip || u.courses.some(c => c.course === slug && (!c.expiresAt || c.expiresAt > new Date()))
r.get('/lessons/:course', protect, wrap(async (req, res) => {
  if (!can(req.user, req.params.course)) return res.status(403).json({ message: 'You are not enrolled in this course' })
  const lessons = await Lesson.find({ course: req.params.course }).sort('order')
  const done = (await Progress.find({ user: req.user._id, lesson: { $in: lessons.map(l => l._id) } })).map(p => String(p.lesson))
  const staffView = ['admin', 'superadmin', 'mentor', 'staff'].includes(req.user.role)
  const out = lessons.map((l, i) => { const o = l.toObject(); o.locked = !staffView && i > 0 && !done.includes(String(lessons[i - 1]._id)); if (o.locked) o.url = undefined; return o })
  res.json({ lessons: out, done })
}))
r.post('/lessons/:id/complete', protect, wrap(async (req, res) => {
  const l = await Lesson.findById(req.params.id)
  if (!l || !can(req.user, l.course)) return res.status(403).json({ message: 'Not allowed' })
  if (!['admin', 'superadmin', 'mentor', 'staff'].includes(req.user.role)) {
    const all = await Lesson.find({ course: l.course }).sort('order'), i = all.findIndex(x => String(x._id) === String(l._id))
    if (i > 0 && !(await Progress.findOne({ user: req.user._id, lesson: all[i - 1]._id }))) return res.status(403).json({ message: 'Complete the previous lesson first' })
  }
  await Progress.updateOne({ user: req.user._id, lesson: l._id }, {}, { upsert: true }); res.json({ ok: true })
}))
r.get('/live', protect, wrap(async (req, res) => {
  const list = await LiveClass.find({ date: { $gte: new Date(Date.now() - 864e5) } }).sort('date')
  res.json(list.filter(c => can(req.user, c.course)))
}))
r.get('/my/attendance', protect, wrap(async (req, res) => res.json(await Attendance.find({ user: req.user._id }).populate('liveClass', 'title date'))))
r.get('/admin/lessons', staff, wrap(async (req, res) => res.json(await Lesson.find().sort('course order'))))
r.post('/admin/lessons', staff, wrap(async (req, res) => res.status(201).json(await Lesson.create(req.body))))
r.delete('/admin/lessons/:id', staff, wrap(async (req, res) => res.json(await Lesson.findByIdAndDelete(req.params.id))))
r.get('/admin/live', staff, wrap(async (req, res) => res.json(await LiveClass.find().sort('-date'))))
r.post('/admin/live', staff, wrap(async (req, res) => res.status(201).json(await LiveClass.create(req.body))))
r.delete('/admin/live/:id', staff, wrap(async (req, res) => res.json(await LiveClass.findByIdAndDelete(req.params.id))))
r.get('/admin/live/:id/roster', staff, wrap(async (req, res) => {
  const c = await LiveClass.findById(req.params.id)
  const students = await User.find({ role: 'student', $or: [{ vip: true }, { 'courses.course': c.course }] }).select('name studentId')
  const marks = await Attendance.find({ liveClass: c._id })
  res.json({ students, marks: Object.fromEntries(marks.map(m => [String(m.user), m.status])) })
}))
r.post('/admin/attendance', staff, wrap(async (req, res) => {
  const { classId, records } = req.body
  await Promise.all(records.map(x => Attendance.updateOne({ user: x.user, liveClass: classId }, { status: x.status }, { upsert: true })))
  res.json({ ok: true })
}))
export default r
