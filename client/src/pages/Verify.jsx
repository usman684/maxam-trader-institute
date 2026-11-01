import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../lib/api'
export default function Verify() {
  const [q] = useSearchParams(), [id, setId] = useState(q.get('id') || ''), [r, setR] = useState(null)
  const check = async e => { e?.preventDefault(); try { setR((await api.get(`/verify/${id.trim()}`)).data) } catch (x) { setR(x.response?.data || { valid: false, message: 'Could not check' }) } }
  return (<div className="max-w-md mx-auto px-4 py-16 grid gap-3"><h1 className="text-3xl font-bold gold-text">Verify certificate</h1>
    <form onSubmit={check} className="grid gap-3"><input className="field" placeholder="Certificate ID (MXC-XXXXXXXX)" value={id} onChange={e => setId(e.target.value)} /><button className="btn-gold">Verify</button></form>
    {r && (r.valid ? <div className="bg-coal border border-profit rounded p-4"><b className="text-profit">Valid certificate</b><p>{r.studentName}</p><p className="text-white/70">{r.course}</p><p className="text-white/50 text-sm">{new Date(r.completedAt).toLocaleDateString()}</p></div> : <p className="text-loss">{r.message}</p>)}</div>)
}
