import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../lib/auth'
export default function StaffDashboard() {
  const { user } = useAuth(), [cls, setCls] = useState([]), [subs, setSubs] = useState([])
  useEffect(() => { api.get('/admin/live').then(r => setCls(r.data.filter(c => new Date(c.date) > Date.now() - 864e5).reverse())); api.get('/admin/submissions').then(r => setSubs(r.data.filter(s => s.status === 'Submitted'))) }, [])
  return (<div className="max-w-4xl mx-auto px-4 py-10 grid gap-6"><h1 className="text-3xl font-bold">Welcome, <span className="gold-text">{user.name}</span></h1>
    <div className="flex gap-2 flex-wrap"><Link to="/admin/academic" className="btn-gold">Attendance, quizzes and assignments</Link><Link to="/admin/manage" className="btn-line">Lessons and live classes</Link></div>
    <section><h2 className="text-xl mb-2">Upcoming classes</h2>{cls.map(c => <p key={c._id} className="text-sm border-t border-white/10 py-1">{c.title} ({c.course}), {new Date(c.date).toLocaleString()}</p>)}{!cls.length && <p className="text-white/50">No upcoming classes.</p>}</section>
    <section><h2 className="text-xl mb-2">Submissions waiting for review ({subs.length})</h2>{subs.slice(0, 8).map(s => <p key={s._id} className="text-sm border-t border-white/10 py-1">{s.user?.name}: {s.assignment?.title}</p>)}</section></div>)
}
