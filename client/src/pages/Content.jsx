import { useEffect, useState } from 'react'
import api from '../lib/api'
import { T } from './Public'
const type = { mentors: 'mentor', results: 'result', reviews: 'review', faq: 'faq' }
export default function ContentPage({ k }) {
  const [items, setItems] = useState([]), [end, setEnd] = useState(null), [left, setLeft] = useState('')
  useEffect(() => { if (type[k]) api.get(`/content/${type[k]}`).then(r => setItems(r.data)); if (k === 'vip') api.get('/settings').then(r => setEnd(r.data.offerEnd)) }, [k])
  useEffect(() => { if (!end) return; const f = () => { const d = new Date(end) - Date.now(); setLeft(d > 0 ? `${Math.floor(d / 864e5)}d ${Math.floor(d % 864e5 / 36e5)}h ${Math.floor(d % 36e5 / 6e4)}m ${Math.floor(d % 6e4 / 1e3)}s` : 'Offer ended') }; f(); const id = setInterval(f, 1000); return () => clearInterval(id) }, [end])
  return (<div className="max-w-3xl mx-auto px-4 py-16"><h1 className="text-4xl font-bold gold-text">{T[k][0]}</h1><p className="mt-4 text-white/70 leading-7">{T[k][1]}</p>
    {left && <p className="mt-6 text-2xl text-gold font-display">Offer ends in {left}</p>}
    <div className="mt-8 grid gap-4">{items.map(i => <div key={i._id} className="bg-coal border border-dgold/30 rounded p-4 flex gap-4">{i.image && <img src={i.image} alt="" loading="lazy" className="w-20 h-20 object-cover rounded" />}<div><b>{i.title}</b><p className="text-white/70 text-sm mt-1">{i.body}</p></div></div>)}</div>
    {k === 'results' && <p className="text-xs text-white/40 mt-6">Results are shared with permission. Past performance does not guarantee future results.</p>}</div>)
}
