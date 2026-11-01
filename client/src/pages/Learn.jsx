import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import CourseWork from './CourseWork'
const embed = u => /youtube|youtu\.be|vimeo/.test(u)
export default function Learn() {
  const { course } = useParams(), [d, setD] = useState(null), [cur, setCur] = useState(null), [err, setErr] = useState('')
  useEffect(() => { api.get(`/lessons/${course}`).then(r => { setD(r.data); setCur(r.data.lessons[0]) }).catch(e => setErr(e.response?.data?.message || 'Could not load')) }, [course])
  if (err) return <div className="p-10"><p>{err}</p><Link className="text-gold" to="/courses">Browse courses</Link></div>
  if (!d) return <p className="p-10">Loading...</p>
  const pct = d.lessons.length ? Math.round(d.done.length / d.lessons.length * 100) : 0
  const complete = async () => { await api.post(`/lessons/${cur._id}/complete`); setD((await api.get(`/lessons/${course}`)).data); toast.success('Lesson completed') }
  return (<div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
    <div className="md:col-span-2"><h1 className="text-2xl font-bold gold-text mb-1">{course.replace(/-/g, ' ')}</h1>
      <div className="h-2 bg-coal rounded mb-4"><div className="h-2 bg-gold rounded" style={{ width: `${pct}%` }} /></div><p className="text-sm text-white/60 mb-4">Progress: {pct}%</p>
      {cur ? <><h2 className="text-xl mb-2">{cur.title}</h2>
        {cur.type === 'video' && (embed(cur.url) ? <iframe title={cur.title} src={cur.url} className="w-full aspect-video rounded" allowFullScreen /> : <video src={cur.url} controls controlsList="nodownload" className="w-full rounded" />)}
        {cur.type === 'pdf' && <a href={cur.url} target="_blank" rel="noreferrer" className="btn-line">Open PDF notes</a>}
        {cur.type === 'note' && <p className="text-white/70">{cur.url}</p>}
        <button onClick={complete} disabled={d.done.includes(cur._id)} className="btn-gold mt-4">{d.done.includes(cur._id) ? 'Completed' : 'Mark as complete'}</button></> : <p className="text-white/50">No lessons published yet.</p>}</div>
    <div className="grid gap-2 content-start">{d.lessons.map((l, i) => <button key={l._id} disabled={l.locked} onClick={() => setCur(l)} className={`disabled:opacity-40 text-left p-3 rounded border ${cur?._id === l._id ? 'border-gold' : 'border-white/10'} bg-coal`}>{i + 1}. {l.title} <span className="text-xs text-white/40">{l.type}</span>{l.locked && <span className="text-xs text-loss ml-2">locked, finish the previous lesson</span>}{d.done.includes(l._id) && <span className="text-profit text-xs ml-2">done</span>}</button>)}</div><div className="md:col-span-3"><CourseWork course={course} /></div></div>)
}
