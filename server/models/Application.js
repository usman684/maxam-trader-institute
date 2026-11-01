import mongoose from 'mongoose'
const s = new mongoose.Schema({
  applicationId: { type: String, unique: true },
  fullName: String, fatherName: String, whatsapp: String, email: String, city: String,
  dob: String, gender: String, altPhone: String, country: String, address: String, educationLevel: String, institution: String, occupation: String, experience: String, priorKnowledge: String, batch: String, timing: String, startDate: String, specialRequirements: String, documents: [String], studentNote: String, course: String, mode: String, paymentMethod: String, transactionId: String, paymentScreenshot: String, photo: String,
  status: { type: String, default: 'Submitted', enum: ['Draft', 'Submitted', 'Under Review', 'Documents Required', 'Payment Pending', 'Approved', 'Rejected', 'Enrolled'] },
  paymentStatus: { type: String, default: 'Pending Verification', enum: ['Unpaid', 'Pending Verification', 'Verified', 'Rejected', 'Partially Paid', 'Refunded'] },
  amountPaid: { type: Number, default: 0 }, notes: String
}, { timestamps: true })
export default mongoose.models.Application || mongoose.model('Application', s)
