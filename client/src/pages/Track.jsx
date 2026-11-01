import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { prep } from '../lib/image'
const err = e => e.response?.data?.message || 'Something went wrong'
export default function Track() {
  const { register, handleSubmit } = useForm(), [q, setQ] = useState(null), [r, setR] = useState(null)
  const docs = useForm(), pay = useForm()
  const look = async d => { try { setR((await api.post('/applications/track', d)).data); setQ(d) } catch (e) { setR(null); toast.error(err(e)) } }
  const send = (url, f, ok) => async d => { try { const fd = new FormData(); fd.append('applicationId', q.applicationId); fd.append('contact', q.contact); for (const [k, v] of Object.entries(d)) { if (v instanceof FileList) { for (const x of await prep(v)) fd.append(k, x) } else if (v) fd.append(k, v) }; await api.post(url, fd); toast.success(ok); f.reset(); look(q) } catch (e) { toast.error(err(e)) } }
  const receipt = async () => { const x = await api.post('/applications/receipt', q, { responseType: 'blob' }); const a = document.createElement('a'); a.href = URL.createObjectURL(x.data); a.download = `receipt-${r.applicationId}.pdf`; a.click() }
  return (<div className="max-w-xl mx-auto px-4 py-12 grid gap-4"><h1 className="text-3xl font-bold gold-text">Track application</h1>
    <form onSubmit={handleSubmit(look)} className="grid gap-3"><input className="field" placeholder="Application ID (MAX-XXXXXX)" {...register('applicationId', { required: true })} /><input className="field" placeholder="Registered email or WhatsApp" {...register('contact', { required: true })} /><button className="btn-gold">Check status</button></form>
    {r && <div className="grid gap-4"><div className="bg-coal border border-dgold/30 rounded p-4"><b>{r.fullName}</b><p>Status: <span className="text-gold">{r.status}</span></p><p>Payment: <span className="text-gold">{r.paymentStatus}</span></p>{r.studentNote && <p className="mt-2 text-sm bg-ink p-2 rounded">Message from the institute: {r.studentNote}</p>}<button className="btn-line mt-3" onClick={receipt}>Download receipt (PDF)</button></div>
      {r.status === 'Documents Required' && <form onSubmit={docs.handleSubmit(send('/applications/documents', docs, 'Documents uploaded'))} className="grid gap-2"><h2 className="font-semibold">Upload requested documents</h2><input type="file" multiple accept="image/*,application/pdf" className="field" {...docs.register('documents', { required: true })} /><button className="btn-gold w-fit">Upload</button></form>}
      {!['Verified', 'Refunded'].includes(r.paymentStatus) && <form onSubmit={pay.handleSubmit(send('/applications/payment', pay, 'Payment proof sent for verification'))} className="grid gap-2"><h2 className="font-semibold">Send payment proof</h2><p className="text-xs text-white/50">Your payment counts only after our team verifies it.</p>
        <select className="field" {...pay.register('paymentMethod')}>{['JazzCash', 'Easypaisa', 'Meezan Bank Transfer', 'USDT'].map(x => <option key={x}>{x}</option>)}</select><input className="field" placeholder="Transaction ID" {...pay.register('transactionId')} /><input type="file" accept="image/*" className="field" {...pay.register('paymentScreenshot')} /><button className="btn-gold w-fit">Send proof</button></form>}</div>}</div>)
}
