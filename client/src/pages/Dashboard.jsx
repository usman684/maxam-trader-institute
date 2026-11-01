import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import api from '../lib/api'
import Extras from './Extras'
import DashCards from './DashCards'
export default function Dashboard() {
  const { user, logout } = useAuth(), [sig, setSig] = useState(null)
  useEffect(() => { if (user.vip) api.get('/signals/vip').then(r => setSig(r.data)) }, [user])
  return (<div className="max-w-5xl mx-auto px-4 py-10 grid gap-6">
    <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Welcome, <span className="gold-text">{user.name}</span></h1><button onClick={logout} className="btn-line">Log out</button></div>
    {!user.emailVerified && <div className="bg-coal border border-dgold/30 rounded p-3 text-sm">Please verify your email. <button className="text-gold" onClick={async () => { const r = await api.post('/auth/resend-verification'); alert(r.data.sent ? 'Verification email sent' : 'Email service is not configured yet') }}>Resend link</button></div>}
    <p className="text-white/60">Student ID: {user.studentId || 'Pending'}</p>
    <Link to="/profile" className="text-gold w-fit">Edit profile and password</Link>
    {['mentor', 'staff'].includes(user.role) && <Link to="/staff" className="btn-gold w-fit">Open staff panel</Link>}
    {['admin', 'superadmin'].includes(user.role) && <Link to="/admin" className="btn-gold w-fit">Open admin panel</Link>}
    <DashCards user={user} />
    <section><h2 className="text-xl mb-2">My courses</h2>{user.courses?.length ? user.courses.map((c, i) => <Link key={i} to={`/learn/${c.course}`} className="block bg-coal p-3 rounded mb-2 hover:border-gold border border-transparent">{c.course} <span className="text-gold text-sm">Open lessons</span></Link>) : <p className="text-white/50">No enrolled course yet. <Link className="text-gold" to="/apply">Apply online</Link></p>}</section>
    <section><h2 className="text-xl mb-2">VIP signals</h2>
      {user.vip ? <div className="overflow-x-auto"><table className="w-full text-sm"><tbody>{(sig || []).map(s => <tr key={s._id} className="border-t border-white/10"><td className="p-2">{s.pair}</td><td>{s.direction}</td><td>{s.entry}</td><td>{s.tp1}</td><td>{s.sl}</td><td>{s.status}</td></tr>)}</tbody></table></div>
        : <div className="bg-coal p-4 rounded border border-dgold/30">VIP signals are locked. <Link to="/courses/vip-lifetime-mentorship" className="text-gold">Upgrade to VIP</Link></div>}
      <p className="text-xs text-white/40 mt-2">Educational information only, not financial advice.</p></section><Extras /></div>)
}
