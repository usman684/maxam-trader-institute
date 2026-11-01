import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '../lib/api'
export function Maintenance({ children }) {
  const [m, setM] = useState(false), { pathname } = useLocation()
  useEffect(() => { api.get('/settings').then(r => setM(r.data.maintenance === true)).catch(() => {}) }, [])
  const open = ['/admin', '/login', '/dashboard', '/staff'].some(p => pathname.startsWith(p))
  return m && !open ? <div className="max-w-md mx-auto px-4 py-24 text-center"><h1 className="text-3xl font-bold gold-text">We will be right back</h1><p className="mt-3 text-white/60">The website is being updated. Please check again soon.</p></div> : children
}
export const NotFound = () => <div className="max-w-md mx-auto px-4 py-24 text-center"><h1 className="text-4xl font-bold gold-text">Page not found</h1><p className="mt-3 text-white/60">This page does not exist or was moved.</p><Link to="/" className="btn-gold mt-6">Back to home</Link></div>
