import mongoose from 'mongoose'
const m = (n, d) => mongoose.models[n] || mongoose.model(n, new mongoose.Schema(d, { timestamps: true }))
export const Content = m('Content', { type: { type: String, enum: ['mentor', 'result', 'review', 'faq', 'announcement', 'gallery'] }, title: String, body: String, image: String, category: String, videoUrl: String, experience: String, specialization: String, social: String, rating: Number, approved: { type: Boolean, default: true } })
export const Ticket = m('Ticket', { user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, subject: String, status: { type: String, default: 'Open' }, messages: [{ from: String, text: String, at: { type: Date, default: Date.now } }] })
