import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types
const m = (n, d) => mongoose.models[n] || mongoose.model(n, new mongoose.Schema(d, { timestamps: true }))
export const Expense = m('Expense', { title: String, amount: Number, category: String, date: { type: Date, default: Date.now } })
export const Refund = m('Refund', { applicationId: String, amount: Number, reason: String })
export const Quiz = m('Quiz', { course: String, title: String, questions: [{ q: String, options: [String], answer: Number }] })
export const QuizResult = m('QuizResult', { user: ObjectId, quiz: ObjectId, score: Number, total: Number })
export const Assignment = m('Assignment', { course: String, title: String, description: String, due: Date })
export const Submission = m('Submission', { user: { type: ObjectId, ref: 'User' }, assignment: { type: ObjectId, ref: 'Assignment' }, text: String, status: { type: String, default: 'Submitted' }, feedback: String })
export const Batch = m('Batch', { name: String, course: String, mentor: String, startDate: Date, students: [{ type: ObjectId, ref: 'User' }] })
