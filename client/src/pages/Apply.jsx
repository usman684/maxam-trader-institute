import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { prep } from '../lib/image'
import { useCourses } from '../lib/useCourses'
const F = ({ l, children }) => <label className="block text-sm"><span className="text-white/70">{l}</span>{children}</label>
const Sec = ({ t, children }) => <fieldset className="grid gap-3"><legend className="text-xl font-semibold text-gold mb-1">{t}</legend><div className="grid md:grid-cols-2 gap-4">{children}</div></fieldset>
export function PayInfo() {
  const [p, setP] = useState({}); useEffect(() => { api.get('/payment-info').then(r => setP(r.data)).catch(() => {}) }, [])
  const rows = [['JazzCash', p.jazzcash], ['Easypaisa', p.easypaisa], ['Bank', p.bank], ['Account title', p.title], ['IBAN', p.iban], ['USDT wallet', p.usdt]]
  return <div className="bg-coal border border-dgold/30 rounded p-4 text-sm md:col-span-2"><b className="text-gold">Payment instructions</b><p className="text-white/50 mb-2">Pay first, then enter your transaction ID and upload the screenshot. Payment counts only after our team verifies it.</p>{rows.map(([l, v]) => <p key={l}>{l}: {v || 'Admin will configure'}</p>)}</div>
}
export default function Apply() {
  const [q] = useSearchParams(), courses = useCourses(), [done, setDone] = useState('')
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: { course: q.get('course') || courses[0].slug, mode: 'Online', paymentMethod: 'JazzCash', country: 'Pakistan' } })
  const onSubmit = async d => {
    try {
      const fd = new FormData()
      for (const [k, v] of Object.entries(d)) { if (v instanceof FileList) { for (const f of await prep(v)) fd.append(k, f) } else fd.append(k, v) }
      const { data } = await api.post('/applications', fd); setDone(data.applicationId); window.scrollTo(0, 0)
    } catch (e) { toast.error(e.response?.data?.message || 'Could not submit. Please check the form and try again.') }
  }
  if (done) return <div className="max-w-xl mx-auto px-4 py-16 grid gap-3"><h1 className="text-3xl font-bold gold-text">Application submitted</h1><p>Your Application ID is</p><p className="text-3xl font-display text-gold">{done}</p><p className="text-white/70 text-sm">Save this ID. You need it with your email or WhatsApp number to track your status, upload documents or send more payment proof. We also emailed it to you if email is set up.</p><Link to="/track" className="btn-gold w-fit">Track my application</Link></div>
  const sel = (n, o) => <select className="field" {...register(n)}>{o.map(x => <option key={x}>{x}</option>)}</select>
  const In = (n, p = {}) => <input className="field" {...p} {...register(n, { required: !!p.required })} />
  return (<form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto px-4 py-12 grid gap-8"><h1 className="text-4xl font-bold gold-text">Apply Online</h1>
    <Sec t="Personal information"><F l="Full name">{In('fullName', { required: true })}</F><F l="Father name">{In('fatherName', { required: true })}</F><F l="Date of birth">{In('dob', { type: 'date' })}</F><F l="Gender">{sel('gender', ['Male', 'Female', 'Other'])}</F>
      <F l="WhatsApp number">{In('whatsapp', { required: true })}</F><F l="Alternative phone">{In('altPhone')}</F><F l="Email">{In('email', { type: 'email', required: true })}</F><F l="Country">{In('country')}</F><F l="City">{In('city')}</F><F l="Complete address">{In('address')}</F></Sec>
    <Sec t="Education and experience"><F l="Education level">{sel('educationLevel', ['Matric', 'Intermediate', 'Bachelor', 'Master', 'Other'])}</F><F l="Institution name">{In('institution')}</F><F l="Current occupation">{In('occupation')}</F><F l="Trading experience">{sel('experience', ['None', 'Less than 6 months', '6 to 12 months', '1 to 3 years', 'More than 3 years'])}</F>
      <div className="md:col-span-2"><F l="Previous trading knowledge"><textarea className="field" {...register('priorKnowledge')} /></F></div></Sec>
    <Sec t="Course"><F l="Select course"><select className="field" {...register('course')}>{courses.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}</select></F><F l="Learning mode">{sel('mode', ['Online', 'Physical', 'Hybrid'])}</F><F l="Preferred batch">{In('batch')}</F><F l="Preferred class timing">{In('timing')}</F><F l="Preferred start date">{In('startDate', { type: 'date' })}</F></Sec>
    <Sec t="Payment"><PayInfo /><F l="Payment method">{sel('paymentMethod', ['JazzCash', 'Easypaisa', 'Meezan Bank Transfer', 'USDT'])}</F><F l="Transaction ID">{In('transactionId')}</F><F l="Payment screenshot"><input type="file" accept="image/*" className="field" {...register('paymentScreenshot')} /></F></Sec>
    <Sec t="Additional"><F l="Student photo"><input type="file" accept="image/*" className="field" {...register('photo')} /></F><F l="Additional documents (up to 3)"><input type="file" multiple accept="image/*,application/pdf" className="field" {...register('documents')} /></F><div className="md:col-span-2"><F l="Special requirements"><textarea className="field" {...register('specialRequirements')} /></F></div></Sec>
    <label className="text-sm flex gap-2"><input type="checkbox" {...register('terms', { required: true })} /> I accept the <Link className="text-gold" to="/terms">Terms & Conditions</Link></label>
    <button disabled={isSubmitting} className="btn-gold">{isSubmitting ? 'Submitting...' : 'Submit application'}</button></form>)
}
