import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useSite, fullAddress } from '../lib/useSite'
import OfficeMap from '../components/OfficeMap'
import SocialLinks from '../components/Social'
export default function Office() {
  const { office: o, contact } = useSite(), { register, handleSubmit, reset } = useForm(), [g, setG] = useState([])
  useEffect(() => { api.get('/content/gallery').then(r => setG(r.data)).catch(() => {}) }, [])
  const wa = (contact.whatsapp || '').replace(/\D/g, '')
  const book = async d => { try { await api.post('/appointments', d); toast.success('Appointment request sent. We will confirm it soon.'); reset() } catch (e) { toast.error(e.response?.data?.message || 'Failed') } }
  const rows = [['Address', fullAddress(o)], ['Opening hours', o.hours], ['Phone', o.phone], ['Email', o.email], ['Office manager', o.manager]].filter(r => r[1])
  return (<div className="max-w-5xl mx-auto px-4 py-12 grid gap-8">
    <div><h1 className="text-4xl font-bold gold-text">MAXAM TRADER INSTITUTE, Official Office</h1><p className="text-white/60 mt-2">Visit us, meet the team and ask about admission in person.</p></div>
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="grid gap-2 text-sm">{rows.length ? rows.map(([k, v]) => <p key={k}><span className="text-gold">{k}:</span> {v}</p>) : <p className="text-white/60">Office details will be published soon.</p>}<div className="mt-3"><p className="text-xs text-white/50 mb-2">Follow us</p><SocialLinks /></div></div>
      <OfficeMap office={o} wa={wa} /></div>
    {g.length > 0 && <div className="grid grid-cols-2 md:grid-cols-3 gap-2">{g.map(i => <img key={i._id} src={i.image} alt={i.title || 'Office'} loading="lazy" className="rounded h-40 w-full object-cover" />)}</div>}
    <form onSubmit={handleSubmit(book)} className="grid gap-3 max-w-xl"><h2 className="text-2xl font-semibold">Book an office visit</h2>
      <input className="field" placeholder="Full name" {...register('name', { required: true })} /><input className="field" placeholder="Phone number" {...register('phone', { required: true })} /><input className="field" placeholder="Email" {...register('email')} />
      <div className="grid grid-cols-2 gap-3"><input className="field" type="date" {...register('date', { required: true })} /><input className="field" placeholder="Preferred time" {...register('time')} /></div>
      <input className="field" placeholder="Purpose of visit" {...register('purpose')} /><textarea className="field" placeholder="Message" {...register('message')} /><button className="btn-gold">Request appointment</button></form></div>)
}
