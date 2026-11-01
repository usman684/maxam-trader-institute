import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) { console.error('Set MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD'); process.exit(1) }
await mongoose.connect(MONGODB_URI)
if (await User.findOne({ email: ADMIN_EMAIL.toLowerCase() })) console.log('Admin already exists')
else { await User.create({ name: 'Super Admin', email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'superadmin' }); console.log('Super admin created') }
process.exit(0)
