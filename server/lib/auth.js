import jwt from 'jsonwebtoken'
import User from '../models/User.js'
export const sign = u => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
export const protect = async (req, res, next) => {
  try {
    const t = (req.headers.authorization || '').replace('Bearer ', '')
    const { id } = jwt.verify(t, process.env.JWT_SECRET)
    const u = await User.findById(id)
    if (!u || u.blocked) return res.status(401).json({ message: 'Access denied' })
    req.user = u; next()
  } catch { res.status(401).json({ message: 'Please log in' }) }
}
export const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Not permitted' })
