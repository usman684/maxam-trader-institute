import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
export default function Extras() {
  const [ann, setAnn] = useState([]), [pay, setPay] = useState([]), [tk, setTk] = useState([]), [f, setF] = useState({ subject: '', text: '' })
  const [live, setLive] = useState([]), [att, setAtt] = useState([])
  const [certs, setCerts] = useState([])
  const rc = async id => { try { const r = await api.get(`/my/receipt/${id}`, { responseType: 'blob' }); const a = document.createElement('a'); a.href = URL.createObjectURL(r.data); a.download = `receipt-${id}.pdf`; a.click() } catch { toast.error('Receipt not available') } }
  const dl = async c => { const r = await api.get(`/certificates/${c.certId}/pdf`, { responseType: 'blob' }); const a = document.createElement('a'); a.href = URL.createObjectURL(r.data); a.download = `${c.certId}.pdf`; a.click() }
  const load = () => api.get('/tickets').then(r => setTk(r.data))
  useEffect(() => { api.get('/my/certificates').then(r => setCerts(r.data)); api.get('/live').then(r => setLive(r.data)); api.get('/my/attendance').then(r => setAtt(r.data)); api.get('/content/announcement').then(r => setAnn(r.data)); api.get('/my/payments').then(r => setPay(r.data)); load() }, [])
  const send = async e => { e.preventDefault(); try { await api.post('/tickets', f); setF({ subject: '', text: '' }); toast.success('Ticket sent'); load() } catch { toast.error('Failed') } }
  const reply = async t => { const text = prompt('Your reply'); if (text) { await api.post(`/tickets/${t._id}/reply`, { text }); load() } }
  return (<>
    <section><h2 className="text-xl mb-2">Announcements</h2>{ann.map(a => <div key={a._id} className="bg-coal p-3 rounded mb-2"><b>{a.title}</b><p className="text-sm text-white/70">{a.body}</p></div>)}{!ann.length && <p className="text-white/50">No announcements.</p>}</section>
    <section><h2 className="text-xl mb-2">My payments</h2>{pay.map(p => <div key={p._id} className="bg-coal p-3 rounded mb-2 text-sm">{p.applicationId}, {p.course}, {p.paymentMethod}, TXN {p.transactionId || '-'}: <b className="text-gold">{p.paymentStatus}</b>, paid Rs. {p.amountPaid} <button className="text-gold ml-2" onClick={() => rc(p.applicationId)}>Receipt</button></div>)}{!pay.length && <p className="text-white/50">No payments yet.</p>}</section>
    <section><h2 className="text-xl mb-2">Live classes</h2>{live.map(c => <div key={c._id} className="bg-coal p-3 rounded mb-2 text-sm"><b>{c.title}</b> with {c.mentor || 'mentor'}, {new Date(c.date).toLocaleString()} <span className="text-gold">({c.status})</span> {c.zoomLink && <a className="text-gold ml-2" href={c.zoomLink} target="_blank" rel="noreferrer">Join</a>}</div>)}{!live.length && <p className="text-white/50">No upcoming classes.</p>}</section>
    <section><h2 className="text-xl mb-2">My attendance</h2>{att.map(a => <p key={a._id} className="text-sm">{a.liveClass?.title}, {a.liveClass && new Date(a.liveClass.date).toLocaleDateString()}: <b className="text-gold">{a.status}</b></p>)}{!att.length && <p className="text-white/50">No records yet.</p>}</section>
    <section><h2 className="text-xl mb-2">Certificates</h2>{certs.map(c => <div key={c._id} className="bg-coal p-3 rounded mb-2 text-sm flex justify-between"><span>{c.course} ({c.certId})</span><button className="text-gold" onClick={() => dl(c)}>Download PDF</button></div>)}{!certs.length && <p className="text-white/50">Certificates appear here after course completion and admin verification.</p>}</section>
    <section><h2 className="text-xl mb-2">Support</h2>
      <form onSubmit={send} className="grid gap-2 mb-3"><input className="field" placeholder="Subject" value={f.subject} onChange={e => setF({ ...f, subject: e.target.value })} required /><textarea className="field" placeholder="Describe your issue" value={f.text} onChange={e => setF({ ...f, text: e.target.value })} required /><button className="btn-gold w-fit">Send ticket</button></form>
      {tk.map(t => <div key={t._id} className="bg-coal p-3 rounded mb-2 text-sm"><b>{t.subject}</b> <span className="text-gold">({t.status})</span>{t.messages.map((m, i) => <p key={i} className="text-white/70">{m.from}: {m.text}</p>)}{t.status !== 'Closed' && <button className="text-gold" onClick={() => reply(t)}>Reply</button>}</div>)}</section></>)
}
