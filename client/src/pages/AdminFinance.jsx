import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
const rs = n => 'Rs. ' + Number(n || 0).toLocaleString('en-PK')
export default function AdminFinance() {
  const [s, setS] = useState(null), [ex, setEx] = useState([]), [f, setF] = useState({}), [rf, setRf] = useState({})
  const load = () => { api.get('/admin/finance/summary').then(r => setS(r.data)); api.get('/admin/expenses').then(r => setEx(r.data)) }
  useEffect(load, [])
  const run = async (fn, m) => { try { await fn(); toast.success(m); load() } catch (e) { toast.error(e.response?.data?.message || 'Failed') } }
  const exp = async w => { const r = await api.get(`/admin/export/${w}`, { responseType: 'blob' }); const a = document.createElement('a'); a.href = URL.createObjectURL(r.data); a.download = `${w}.csv`; a.click() }
  const set = (o, fn) => k => e => fn({ ...o, [k]: e.target.value })
  if (!s) return <p className="p-10">Loading...</p>
  const cards = [['Revenue (after refunds)', s.revenue], ['Expenses', s.expenses], ['Net', s.net], ['Pending dues', s.dues], ['Refunded', s.refunds]]
  return (<div className="max-w-5xl mx-auto px-4 py-8 grid gap-8"><div><Link to="/admin" className="text-gold text-sm">Back to dashboard</Link><h1 className="text-3xl font-bold gold-text mt-2">Finance</h1></div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">{cards.map(([l, v]) => <div key={l} className="bg-coal p-3 rounded border border-dgold/30"><div className="text-gold font-bold">{rs(v)}</div><div className="text-xs text-white/60">{l}</div></div>)}</div>
    <div className="flex gap-2 flex-wrap">{['students', 'applications', 'expenses'].map(w => <button key={w} className="btn-line" onClick={() => exp(w)}>Export {w} CSV</button>)}</div>
    <section><h2 className="text-xl mb-2">Course-wise revenue</h2>{Object.entries(s.byCourse).map(([c, v]) => <p key={c} className="text-sm border-t border-white/10 py-1">{c}: {rs(v)}</p>)}</section>
    <section><h2 className="text-xl mb-2">Monthly report</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-gold text-left"><tr><th>Month</th><th>Revenue</th><th>Expenses</th><th>Net</th></tr></thead><tbody>{s.byMonth.map(m => <tr key={m.month} className="border-t border-white/10"><td>{m.month}</td><td>{rs(m.revenue)}</td><td>{rs(m.expenses)}</td><td>{rs(m.revenue - m.expenses)}</td></tr>)}</tbody></table></div></section>
    <section><h2 className="text-xl mb-2">Expenses</h2><div className="grid md:grid-cols-4 gap-2 mb-3"><input className="field" placeholder="Title" onChange={set(f, setF)('title')} /><input className="field" placeholder="Category" onChange={set(f, setF)('category')} /><input className="field" type="number" placeholder="Amount" onChange={set(f, setF)('amount')} /><button className="btn-gold" onClick={() => run(() => api.post('/admin/expenses', { ...f, amount: Number(f.amount) }), 'Expense added')}>Add expense</button></div>
      {ex.map(e => <div key={e._id} className="flex flex-wrap gap-2 justify-between border-t border-white/10 py-1 text-sm"><span>{e.title} ({e.category}) {rs(e.amount)}</span><button className="text-loss" onClick={() => run(() => api.delete(`/admin/expenses/${e._id}`), 'Deleted')}>Delete</button></div>)}</section>
    <section><h2 className="text-xl mb-2">Record a refund</h2><div className="grid md:grid-cols-4 gap-2"><input className="field" placeholder="Application ID" onChange={set(rf, setRf)('applicationId')} /><input className="field" type="number" placeholder="Amount" onChange={set(rf, setRf)('amount')} /><input className="field" placeholder="Reason" onChange={set(rf, setRf)('reason')} /><button className="btn-line" onClick={() => run(() => api.post('/admin/refunds', rf), 'Refund recorded')}>Record refund</button></div></section></div>)
}
