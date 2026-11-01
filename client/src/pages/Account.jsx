import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import SocialLinks from '../components/Social'
import OfficeMap from '../components/OfficeMap'
import { useSite } from '../lib/useSite'
const Box = ({ t, children }) => <div className="max-w-sm mx-auto px-4 py-16 grid gap-3"><h1 className="text-3xl font-bold gold-text">{t}</h1>{children}</div>
const msg = e => e.response?.data?.message || 'Something went wrong'
export function Forgot() {
  const { register, handleSubmit } = useForm(), [done, setDone] = useState('')
  return <Box t="Forgot password"><form onSubmit={handleSubmit(async d => { try { setDone((await api.post('/auth/forgot', d)).data.message) } catch (e) { toast.error(msg(e)) } })} className="grid gap-3">
    <input className="field" type="email" placeholder="Registered email" {...register('email', { required: true })} /><button className="btn-gold">Send reset link</button></form>{done && <p className="text-profit text-sm">{done}</p>}</Box>
}
export function Reset() {
  const [q] = useSearchParams(), nav = useNavigate(), { register, handleSubmit } = useForm()
  return <Box t="Set new password"><form onSubmit={handleSubmit(async d => { try { await api.post('/auth/reset', { token: q.get('token'), password: d.password }); toast.success('Password updated. Please log in.'); nav('/login') } catch (e) { toast.error(msg(e)) } })} className="grid gap-3">
    <input className="field" type="password" placeholder="New password (8+ characters)" {...register('password', { required: true })} /><button className="btn-gold">Update password</button></form></Box>
}
export function VerifyEmail() {
  const [q] = useSearchParams(), [s, setS] = useState('Checking...')
  useEffect(() => { api.post('/auth/verify-email', { token: q.get('token') }).then(() => setS('Your email is verified.')).catch(e => setS(msg(e))) }, [])
  return <Box t="Email verification"><p>{s}</p><Link to="/dashboard" className="text-gold">Go to dashboard</Link></Box>
}
function OfficeMapBlock() { const { office, contact } = useSite(); return <div className="mt-6"><OfficeMap office={office} wa={(contact.whatsapp || '').replace(/\D/g, '')} height="h-56" /></div> }
export function Contact() {
  const { register, handleSubmit, reset } = useForm()
  return <Box t="Contact us"><form onSubmit={handleSubmit(async d => { try { await api.post('/contact', d); toast.success('Message sent. We will reply soon.'); reset() } catch (e) { toast.error(msg(e)) } })} className="grid gap-3">
    <input className="field" placeholder="Full name" {...register('name', { required: true })} /><input className="field" placeholder="Email" {...register('email')} /><input className="field" placeholder="Phone / WhatsApp" {...register('phone')} />
    <textarea className="field h-32" placeholder="How can we help?" {...register('message', { required: true })} /><button className="btn-gold">Send message</button></form><div className="mt-6"><p className="text-sm text-white/60 mb-2">Follow us</p><SocialLinks /></div><OfficeMapBlock /></Box>
}
