import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../lib/api'
const post = (url, onOk) => async d => { try { const { data } = await api.post(url, d); onOk ? onOk(data) : toast.success('Submitted. We will contact you soon.') } catch (e) { toast.error(e.response?.data?.message || 'Failed') } }
const Box = ({ t, children }) => <div className="max-w-xl mx-auto px-4 py-12 grid gap-3"><h1 className="text-3xl font-bold gold-text">{t}</h1>{children}</div>
const In = (p) => <input className="field" {...p} />
export function Track() {
  const { register, handleSubmit, getValues } = useForm(), [r, setR] = useState(null)
  return <Box t="Track application"><form onSubmit={handleSubmit(post('/applications/track', setR))} className="grid gap-3">
    <In placeholder="Application ID (MAX-XXXXXX)" {...register('applicationId', { required: true })} /><In placeholder="Registered email or WhatsApp" {...register('contact', { required: true })} /><button className="btn-gold">Check status</button></form>
    {r && <div className="bg-coal p-4 rounded border border-dgold/30"><b>{r.fullName}</b><p>Status: <span className="text-gold">{r.status}</span></p><p>Payment: {r.paymentStatus}</p><button className="btn-line mt-3" onClick={async () => { const r2 = await api.post('/applications/receipt', getValues(), { responseType: 'blob' }); const a = document.createElement('a'); a.href = URL.createObjectURL(r2.data); a.download = `receipt-${r.applicationId}.pdf`; a.click() }}>Download receipt (PDF)</button></div>}</Box>
}
export function Demo() {
  const { register, handleSubmit } = useForm()
  return <Box t="Free demo class"><form onSubmit={handleSubmit(post('/demo'))} className="grid gap-3"><In placeholder="Full name" {...register('name', { required: true })} /><In placeholder="WhatsApp" {...register('whatsapp', { required: true })} /><In placeholder="Email" {...register('email')} /><In placeholder="Interested course" {...register('course')} /><In placeholder="Preferred time" {...register('time')} />
    <select className="field" {...register('mode')}><option>Online</option><option>Physical</option></select><button className="btn-gold">Register for demo</button></form></Box>
}
export function Office() {
  const { register, handleSubmit } = useForm(), [s, setS] = useState({}), [g, setG] = useState([])
  useEffect(() => { api.get('/settings').then(r => setS(r.data.office || {})); api.get('/content/gallery').then(r => setG(r.data)) }, [])
  return <Box t="Official office"><p className="text-white/70">{s.address || 'Office address will be published by admin.'}</p>
    {s.mapEmbed && <iframe title="map" src={s.mapEmbed} className="w-full h-64 rounded" loading="lazy" />}
    <div className="flex gap-2 flex-wrap">{s.directions && <a className="btn-line" href={s.directions} target="_blank" rel="noreferrer">Get directions</a>}{s.phone && <a className="btn-line" href={`tel:${s.phone}`}>Call office</a>}{s.email && <a className="btn-line" href={`mailto:${s.email}`}>Email</a>}</div>
    {g.length > 0 && <div className="grid grid-cols-2 gap-2">{g.map(i => <img key={i._id} src={i.image} alt={i.title || 'Office'} loading="lazy" className="rounded h-40 w-full object-cover" />)}</div>}
    <h2 className="text-xl mt-4">Book an office visit</h2>
    <form onSubmit={handleSubmit(post('/appointments'))} className="grid gap-3"><In placeholder="Full name" {...register('name', { required: true })} /><In placeholder="Phone" {...register('phone', { required: true })} /><In placeholder="Email" {...register('email')} />
      <In type="date" {...register('date')} /><In placeholder="Preferred time" {...register('time')} /><In placeholder="Purpose of visit" {...register('purpose')} /><textarea className="field" placeholder="Message" {...register('message')} /><button className="btn-gold">Book appointment</button></form></Box>
}
export function Signals() {
  const [rows, setRows] = useState([])
  useEffect(() => { api.get('/signals/free').then(r => setRows(r.data)) }, [])
  return <div className="max-w-5xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold gold-text mb-2">Free signals</h1>
    <p className="text-white/50 text-sm mb-4">Educational information only. Not financial advice. No profit is guaranteed.</p>
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-gold text-left"><tr>{['Pair', 'Direction', 'Entry', 'TP1', 'TP2', 'SL', 'Status', 'Date'].map(h => <th key={h} className="p-2">{h}</th>)}</tr></thead>
      <tbody>{rows.map(s => <tr key={s._id} className="border-t border-white/10"><td className="p-2">{s.pair}</td><td>{s.direction}</td><td>{s.entry}</td><td>{s.tp1}</td><td>{s.tp2}</td><td>{s.sl}</td><td>{s.status}</td><td>{new Date(s.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>
      {!rows.length && <p className="p-4 text-white/50">No free signals published yet.</p>}</div>
    <p className="mt-6 blur-sm select-none">More signals are for VIP members only.</p></div>
}
export const T = {
  about: ['About MAXAM Trader Institute', 'MAXAM Trader Institute teaches Forex, crypto and gold trading through structured courses, live sessions and mentorship. Admin edits this page from settings.'],
  vip: ['VIP Membership', 'Lifetime signals, one-on-one mentorship, private VIP group and live trading room for Rs. 59,999. VIP access is granted only after payment verification by admin.'],
  results: ['Results', 'Only authentic, authorized student results are published here after admin approval. Past results do not guarantee future profit.'],
  mentors: ['Mentors', 'Mentor profiles will be added by admin.'],
  reviews: ['Reviews', 'Verified student reviews will appear here.'],
  contact: ['Contact', 'Use the WhatsApp button or visit the office page to reach us.'],
  faq: ['FAQ', 'How do I enroll? Apply online, pay, upload proof, and wait for admin verification. Is profit guaranteed? No.'],
  privacy: ['Privacy Policy', 'We collect only data needed for admission and learning, and never sell it.'],
  terms: ['Terms & Conditions', 'Course access starts after payment verification and is for the enrolled student only.'],
  refund: ['Refund Policy', 'Refund conditions are set by the institute and shown here by admin.'],
  risk: ['Risk Disclosure', 'Trading Forex, crypto and gold carries a high risk of loss. All content is educational and not financial advice.'],
  verify: ['Certificate Verification', 'Certificate verification will be enabled once certificates are issued.']
}
export const Static = ({ k }) => <div className="max-w-3xl mx-auto px-4 py-16"><h1 className="text-4xl font-bold gold-text">{T[k][0]}</h1><p className="mt-4 text-white/70 leading-7">{T[k][1]}</p></div>
