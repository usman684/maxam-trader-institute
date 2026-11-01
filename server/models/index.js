import mongoose from 'mongoose'
const m = (n, def, opt = { timestamps: true }) => mongoose.models[n] || mongoose.model(n, new mongoose.Schema(def, opt))
export const Course = m('Course', { slug: { type: String, unique: true }, title: String, fee: Number, originalFee: Number, duration: String, level: String, badge: String, image: String, rating: Number, enrolled: Number, outcomes: [String], syllabus: [String], active: { type: Boolean, default: true }, order: { type: Number, default: 0 } })
export const Signal = m('Signal', { pair: String, direction: String, entry: String, tp1: String, tp2: String, sl: String, status: { type: String, default: 'Active', enum: ['Active', 'TP1 Hit', 'TP2 Hit', 'SL Hit', 'Closed'] }, vip: { type: Boolean, default: true } })
export const Setting = m('Setting', { key: { type: String, unique: true }, value: mongoose.Schema.Types.Mixed })
export const Appointment = m('Appointment', { name: String, phone: String, email: String, date: String, time: String, purpose: String, message: String, status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected', 'Rescheduled', 'Visited'] } })
export const Demo = m('Demo', { name: String, whatsapp: String, email: String, course: String, time: String, mode: String, status: { type: String, default: 'New' } })
