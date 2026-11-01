import mongoose from 'mongoose'
const s = new mongoose.Schema({
  name: { type: String, required: true }, email: { type: String, required: true, unique: true, lowercase: true },
  phone: String, password: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'admin', 'superadmin', 'mentor', 'staff'], default: 'student' },
  studentId: String, vip: { type: Boolean, default: false }, blocked: { type: Boolean, default: false },
  courses: [{ course: String, enrolledAt: Date, expiresAt: Date }], photo: String, emailVerified: { type: Boolean, default: false }, pendingEmail: String, verifyHash: { type: String, select: false }, resetHash: { type: String, select: false }, resetExpires: { type: Date, select: false }, address: String
}, { timestamps: true })
export default mongoose.models.User || mongoose.model('User', s)
