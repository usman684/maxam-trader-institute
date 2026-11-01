import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../lib/api'
const embed = u => /youtube\.com\/embed|player\.vimeo/.test(u || '')
const Wrap = ({ t, note, children }) => <div className="max-w-6xl mx-auto px-4 py-12"><h1 className="text-4xl font-bold gold-text">{t}</h1>{note && <p className="mt-2 text-white/60 max-w-2xl">{note}</p>}<div className="mt-8">{children}</div></div>
const safe = u => /^https?:\/\//.test(u)
export function Results() {
  const [cat, setCat] = useState(''), [rows, setRows] = useState(null)
  useEffect(() => { setRows(null); api.get('/content/result', { params: cat ? { category: cat } : {} }).then(r => setRows(r.data)).catch(() => setRows([])) }, [cat])
  return (<Wrap t="Student results" note="Only authentic, authorized student results are published after review. Past results do not guarantee future profit.">
    <div className="flex gap-2 mb-6 flex-wrap">{['', 'Forex', 'Crypto', 'Gold'].map(c => <button key={c} onClick={() => setCat(c)} className={cat === c ? 'btn-gold' : 'btn-line'}>{c || 'All'}</button>)}</div>
    {rows === null ? <p className="text-white/50">Loading...</p> : !rows.length ? <p className="text-white/50">No results published in this category yet.</p> :
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{rows.map(r => <div key={r._id} className="bg-coal border border-dgold/30 rounded-lg overflow-hidden">
        {r.image && <img src={r.image} alt={r.title} loading="lazy" className="w-full h-48 object-cover" />}
        {r.videoUrl && (embed(r.videoUrl) ? <iframe title={r.title} src={r.videoUrl} loading="lazy" className="w-full aspect-video" allowFullScreen /> : safe(r.videoUrl) && <a href={r.videoUrl} target="_blank" rel="noreferrer" className="block p-3 text-gold text-sm">Watch video testimonial</a>)}
        <div className="p-4"><span className="text-xs text-gold">{r.category}</span><b className="block">{r.title}</b><p className="text-sm text-white/70 mt-1">{r.body}</p></div></div>)}</div>}
    <p className="text-xs text-white/40 mt-8">Trading carries a high risk of loss. Results shown are individual and not typical or guaranteed.</p></Wrap>)
}
export function Mentors() {
  const [rows, setRows] = useState(null)
  useEffect(() => { api.get('/content/mentor').then(r => setRows(r.data)).catch(() => setRows([])) }, [])
  return (<Wrap t="Our mentors" note="Meet the team who teach and guide MAXAM students.">
    {rows === null ? <p className="text-white/50">Loading...</p> : !rows.length ? <p className="text-white/50">Mentor profiles will be published soon.</p> :
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{rows.map(m => <div key={m._id} className="bg-coal border border-dgold/30 rounded-lg overflow-hidden">
        {m.image && <img src={m.image} alt={m.title} loading="lazy" className="w-full h-56 object-cover" />}
        <div className="p-4"><b className="text-lg">{m.title}</b>{m.specialization && <p className="text-gold text-sm">{m.specialization}</p>}{m.experience && <p className="text-xs text-white/50 mt-1">Experience: {m.experience}</p>}
          <p className="text-sm text-white/70 mt-2">{m.body}</p>
          <div className="mt-3 flex gap-3 flex-wrap text-sm">{(m.social || '').split(/[\s,]+/).filter(safe).map(u => { let h = u; try { h = new URL(u).hostname.replace('www.', '') } catch {} return <a key={u} href={u} target="_blank" rel="noreferrer" className="text-gold">{h}</a> })}</div></div></div>)}</div>}</Wrap>)
}
export function Reviews() {
  const [rows, setRows] = useState(null), { register, handleSubmit, reset } = useForm({ defaultValues: { rating: 5 } })
  useEffect(() => { api.get('/content/review').then(r => setRows(r.data)).catch(() => setRows([])) }, [])
  const send = async d => { try { await api.post('/reviews', d); toast.success('Thank you. Your review will appear after approval.'); reset() } catch (e) { toast.error(e.response?.data?.message || 'Failed') } }
  return (<Wrap t="Student reviews" note="Reviews are shown after our team approves them.">
    <div className="grid md:grid-cols-3 gap-5">{(rows || []).map(r => <div key={r._id} className="bg-coal border border-dgold/30 rounded-lg p-4"><p className="text-gold">{'★'.repeat(r.rating || 5)}<span className="text-white/20">{'★'.repeat(5 - (r.rating || 5))}</span></p><p className="text-sm text-white/80 mt-1">{r.body}</p><b className="block mt-2 text-sm">{r.title}</b></div>)}</div>
    {rows && !rows.length && <p className="text-white/50">No reviews yet. Be the first.</p>}
    <form onSubmit={handleSubmit(send)} className="max-w-md mt-10 grid gap-3"><h2 className="text-xl font-semibold">Write a review</h2>
      <input className="field" placeholder="Your name" {...register('name', { required: true })} />
      <select className="field" {...register('rating')}>{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} stars</option>)}</select>
      <textarea className="field h-28" maxLength={500} placeholder="Share your honest experience" {...register('text', { required: true })} />
      <input className="hidden" tabIndex={-1} autoComplete="off" {...register('website')} /><button className="btn-gold">Submit review</button></form></Wrap>)
}
