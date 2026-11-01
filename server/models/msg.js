import mongoose from 'mongoose'
export const Message = mongoose.models.Message || mongoose.model('Message', new mongoose.Schema({ name: String, email: String, phone: String, message: String, status: { type: String, default: 'New' } }, { timestamps: true }))
