import { useEffect, useState } from 'react'
import api from '../lib/api'
export default function DashCards({ user }) {
  const [next, setNext] = useState(null)
  useEffect(() => { api.get('/live').then(r => setNext(r.data.find(c => new Date(c.date) > Date.now()) || null)).catch(() => {}) }, [])
  const exp = (user.courses || []).filter(c => c.expiresAt).sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt))[0]
  const days = exp ? Math.ceil((new Date(exp.expiresAt) - Date.now()) / 864e5) : null
  const Card = ({ t, children }) => <div className="bg-coal border border-dgold/30 rounded-lg p-4"><p className="text-xs text-white/50 mb-1">{t}</p>{children}</div>
  return (<div className="grid md:grid-cols-2 gap-4">
    <Card t="Next live class">{next ? <><b>{next.title}</b><p className="text-sm text-white/70">{new Date(next.date).toLocaleString()}{next.mentor && `, ${next.mentor}`}</p>{next.zoomLink && <a href={next.zoomLink} target="_blank" rel="noreferrer" className="text-gold text-sm">Join class</a>}</> : <p className="text-white/50 text-sm">No class scheduled yet.</p>}</Card>
    <Card t="Course access">{user.vip ? <b className="text-gold">Lifetime access (VIP)</b> : exp ? <><b className={days <= 7 ? 'text-loss' : 'text-gold'}>{days > 0 ? `${days} days left` : 'Access ended'}</b><p className="text-sm text-white/70">{exp.course}, ends {new Date(exp.expiresAt).toLocaleDateString()}</p></> : <p className="text-white/50 text-sm">{user.courses?.length ? 'No expiry date set for your course.' : 'No enrolled course yet.'}</p>}</Card></div>)
}
