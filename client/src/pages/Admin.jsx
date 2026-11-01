import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../lib/auth'
const S = ['Submitted', 'Under Review', 'Documents Required', 'Payment Pending', 'Approved', 'Rejected', 'Enrolled']
const P = ['Pending Verification', 'Verified', 'Rejected', 'Partially Paid', 'Refunded']
export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState('applications'), [st, setSt] = useState({}), [rows, setRows] = useState([])
  const load = () => { api.get('/admin/stats').then(r => setSt(r.data)); api.get(`/admin/${tab}`).then(r => setRows(r.data)) }
  useEffect(load, [tab])
  const act = async (fn, msg) => { try { const r = await fn(); toast.success(msg || 'Saved'); if (r?.data?.tempPassword) alert(`Student ID: ${r.data.studentId}\nTemporary password: ${r.data.tempPassword}\nShare it securely.`); load() } catch (e) { toast.error(e.response?.data?.message || 'Failed') } }
  const cards = [['Students', st.students], ['VIP members', st.vip], ['Pending applications', st.pendingApps], ['Pending payments', st.pendingPay], ['Revenue (Rs.)', st.revenue], ['Appointments', st.appts]]
  return (<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold gold-text mb-4">Admin dashboard</h1><Link to="/admin/manage" className="btn-line mb-4">Manage content, signals, tickets and settings</Link> {user.role === 'superadmin' && <Link to="/admin/finance" className="btn-line mb-4 ml-2">Finance and exports</Link>} <Link to="/admin/academic" className="btn-line mb-4 ml-2">Quizzes, assignments, batches</Link>
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">{cards.map(([l, v]) => <div key={l} className="bg-coal p-3 rounded border border-dgold/30"><div className="text-xl text-gold font-bold">{v ?? 0}</div><div className="text-xs text-white/60">{l}</div></div>)}</div>
    <div className="flex gap-2 mb-4 flex-wrap">{['applications', 'students', 'appointments', 'demo'].map(t => <button key={t} onClick={() => setTab(t)} className={tab === t ? 'btn-gold' : 'btn-line'}>{t}</button>)}</div>
    <div className="overflow-x-auto"><table className="w-full text-sm"><tbody>
      {tab === 'applications' && rows.map(a => <tr key={a._id} className="border-t border-white/10 align-top"><td className="p-2"><b>{a.applicationId}</b><br />{a.fullName}<br />{a.whatsapp} {a.email}<br /><span className="text-white/50">{a.course}</span></td>
        <td>{a.paymentMethod}<br />TXN: {a.transactionId || '-'}<br />{a.paymentScreenshot && <a className="text-gold" href={a.paymentScreenshot} target="_blank" rel="noreferrer">Screenshot</a>}{(a.documents || []).map((d, i) => <a key={i} className="text-gold ml-2" href={d} target="_blank" rel="noreferrer">Doc {i + 1}</a>)}</td>
        <td><select className="field" value={a.status} onChange={e => act(() => api.patch(`/admin/applications/${a._id}`, { status: e.target.value }))}>{S.map(x => <option key={x}>{x}</option>)}</select></td>
        <td><select className="field" value={a.paymentStatus} onChange={e => { const amt = e.target.value === 'Verified' || e.target.value === 'Partially Paid' ? Number(prompt('Amount received (Rs.)', a.amountPaid || '')) : undefined; act(() => api.patch(`/admin/applications/${a._id}/payment`, { paymentStatus: e.target.value, amountPaid: amt })) }}>{[...P, 'Unpaid'].map(x => <option key={x}>{x}</option>)}</select></td>
        <td className="grid gap-1"><button className="btn-gold" onClick={() => act(() => api.post(`/admin/applications/${a._id}/enroll`), 'Enrolled')}>Enroll</button><button className="text-gold text-xs text-left" onClick={() => { const notes = prompt('Internal note (staff only)', a.notes || ''); notes !== null && act(() => api.patch(`/admin/applications/${a._id}`, { notes })) }}>Internal note{a.notes ? ' (has note)' : ''}</button><button className="text-gold text-xs text-left" onClick={() => { const studentNote = prompt('Message the student will see when tracking', a.studentNote || ''); studentNote !== null && act(() => api.patch(`/admin/applications/${a._id}`, { studentNote })) }}>Message to student</button></td></tr>)}
      {tab === 'students' && rows.map(u => <tr key={u._id} className="border-t border-white/10"><td className="p-2">{u.name}<br /><span className="text-white/50">{u.email}</span></td><td>{u.studentId}</td>
        <td><button className="btn-line" onClick={() => act(() => api.patch(`/admin/students/${u._id}`, { vip: !u.vip }))}>{u.vip ? 'Remove VIP' : 'Give VIP'}</button></td>
        <td><button className="btn-line" onClick={() => act(() => api.patch(`/admin/students/${u._id}`, { blocked: !u.blocked }))}>{u.blocked ? 'Unblock' : 'Block'}</button></td>
        <td><button className="btn-line" onClick={() => { const course = prompt('Course slug'); const days = course && prompt('Extend by how many days?'); days && act(() => api.post(`/admin/students/${u._id}/extend`, { course, days: Number(days) }), 'Access extended') }}>Extend access</button></td>
        <td><button className="btn-line" onClick={() => confirm('Email a password reset link to this student?') && act(() => api.post(`/admin/students/${u._id}/reset-link`), 'Reset link sent')}>Send reset link</button></td></tr>)}
      {tab === 'appointments' && rows.map(a => <tr key={a._id} className="border-t border-white/10"><td className="p-2">{a.name}<br />{a.phone}</td><td>{a.date} {a.time}</td><td>{a.purpose}</td>
        <td><select className="field" value={a.status} onChange={e => act(() => api.patch(`/admin/appointments/${a._id}`, { status: e.target.value }))}>{['Pending', 'Approved', 'Rejected', 'Rescheduled', 'Visited'].map(x => <option key={x}>{x}</option>)}</select></td></tr>)}
      {tab === 'demo' && rows.map(d => <tr key={d._id} className="border-t border-white/10"><td className="p-2">{d.name}</td><td>{d.whatsapp}</td><td>{d.course}</td><td><select className="field" value={d.status} onChange={e => act(() => api.patch(`/admin/demo/${d._id}`, { status: e.target.value }))}>{['New', 'Contacted', 'Scheduled', 'Attended', 'Follow-up', 'Converted'].map(x => <option key={x}>{x}</option>)}</select></td></tr>)}
    </tbody></table>{!rows.length && <p className="p-4 text-white/50">Nothing here yet.</p>}</div></div>)
}
