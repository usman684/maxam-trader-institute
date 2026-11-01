import mongoose from 'mongoose'
export const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', new mongoose.Schema({ certId: { type: String, unique: true }, user: mongoose.Schema.Types.ObjectId, studentName: String, course: String, completedAt: Date }, { timestamps: true }))
