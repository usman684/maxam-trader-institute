import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, RESET_ADMIN } = process.env
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) { console.error('Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in server/.env'); process.exit(1) }
await mongoose.connect(MONGODB_URI)
const email = ADMIN_EMAIL.toLowerCase().trim(), existing = await User.findOne({ email })
if (!existing) { await User.create({ name: 'Super Admin', email, password: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'superadmin', emailVerified: true }); console.log('Super admin created:', email) }
else if (RESET_ADMIN === 'yes') { existing.password = await bcrypt.hash(ADMIN_PASSWORD, 12); existing.role = 'superadmin'; existing.blocked = false; await existing.save(); console.log('Super admin reset (password and role updated):', email) }
else console.log('An account with this email already exists (role: ' + existing.role + '). To reset its password and make it Super Admin, add RESET_ADMIN=yes to server/.env and run again.')
process.exit(0)
