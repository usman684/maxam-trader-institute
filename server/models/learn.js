import mongoose from 'mongoose'
const m = (n, d) => mongoose.models[n] || mongoose.model(n, new mongoose.Schema(d, { timestamps: true }))
const ref = { type: mongoose.Schema.Types.ObjectId }
export const Lesson = m('Lesson', { course: String, title: String, type: { type: String, enum: ['video', 'pdf', 'note'], default: 'video' }, url: String, order: { type: Number, default: 0 } })
export const Progress = m('Progress', { user: ref, lesson: ref })
export const LiveClass = m('LiveClass', { title: String, course: String, date: Date, mentor: String, zoomLink: String, status: { type: String, default: 'Scheduled' } })
export const Attendance = m('Attendance', { user: ref, liveClass: ref, status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused'] } })
