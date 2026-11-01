import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
export default function CourseWork({ course }) {
  const [qz, setQz] = useState([]), [as, setAs] = useState([]), [ans, setAns] = useState({}), [res, setRes] = useState({}), [txt, setTxt] = useState({})
  const load = () => api.get(`/assignments/${course}`).then(r => setAs(r.data)).catch(() => {})
  useEffect(() => { api.get(`/quizzes/${course}`).then(r => setQz(r.data)).catch(() => {}); load() }, [course])
  const submitQ = async q => { const r = await api.post(`/quizzes/${q._id}/submit`, { answers: q.questions.map((_, i) => ans[`${q._id}${i}`]) }); setRes({ ...res, [q._id]: r.data }) }
  const submitA = async a => { try { await api.post(`/assignments/${a._id}/submit`, { text: txt[a._id] }); toast.success('Assignment submitted'); load() } catch { toast.error('Failed') } }
  if (!qz.length && !as.length) return null
  return (<div className="grid gap-8 mt-6">
    {qz.length > 0 && <section><h2 className="text-xl mb-3">Quizzes</h2>{qz.map(q => <div key={q._id} className="bg-coal border border-dgold/30 rounded p-4 mb-4"><b>{q.title}</b>
      {q.questions.map((x, i) => <div key={i} className="mt-3"><p>{i + 1}. {x.q}</p>{x.options.map((o, j) => <label key={j} className="block text-sm text-white/80"><input type="radio" name={`${q._id}${i}`} onChange={() => setAns({ ...ans, [`${q._id}${i}`]: j })} /> {o}</label>)}</div>)}
      <button className="btn-gold mt-3" onClick={() => submitQ(q)}>Submit quiz</button>{res[q._id] && <p className="mt-2 text-gold">Score: {res[q._id].score} / {res[q._id].total}</p>}</div>)}</section>}
    {as.length > 0 && <section><h2 className="text-xl mb-3">Assignments</h2>{as.map(a => <div key={a._id} className="bg-coal border border-dgold/30 rounded p-4 mb-4"><b>{a.title}</b> {a.due && <span className="text-xs text-white/50">Due {new Date(a.due).toLocaleDateString()}</span>}<p className="text-sm text-white/70">{a.description}</p>
      <textarea className="field mt-2" defaultValue={a.submission?.text} placeholder="Write your answer" onChange={e => setTxt({ ...txt, [a._id]: e.target.value })} /><button className="btn-line mt-2" onClick={() => submitA(a)}>{a.submission ? 'Resubmit' : 'Submit'}</button>
      {a.submission && <p className="text-sm mt-2">Status: <span className="text-gold">{a.submission.status}</span>{a.submission.feedback && <span className="text-profit"> Feedback: {a.submission.feedback}</span>}</p>}</div>)}</section>}</div>)
}
