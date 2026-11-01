import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { prep } from '../lib/image'
import { useAuth } from '../lib/auth'
export default function Profile() {
  const { user } = useAuth(), a = useForm({ defaultValues: { name: user.name, phone: user.phone, address: user.address } }), b = useForm(), c = useForm()
  const save = async d => { try { const fd = new FormData(); ['name', 'phone', 'address'].forEach(k => fd.append(k, d[k] || '')); for (const f of await prep(d.photo || [])) fd.append('photo', f); await api.patch('/auth/profile', fd); toast.success('Profile saved') } catch (e) { toast.error(e.response?.data?.message || 'Failed') } }
  const pw = async d => { try { await api.post('/auth/change-password', d); toast.success('Password changed'); b.reset() } catch (e) { toast.error(e.response?.data?.message || 'Failed') } }
  return (<div className="max-w-md mx-auto px-4 py-12 grid gap-8">
    <form onSubmit={a.handleSubmit(save)} className="grid gap-3"><h1 className="text-3xl font-bold gold-text">My profile</h1>{user.photo && <img src={user.photo} alt="" className="w-24 h-24 rounded-full object-cover" />}
      <input className="field" placeholder="Name" {...a.register('name')} /><input className="field" placeholder="Phone" {...a.register('phone')} /><input className="field" placeholder="Address" {...a.register('address')} /><input type="file" accept="image/*" className="field" {...a.register('photo')} /><button className="btn-gold">Save profile</button></form>
    <form onSubmit={b.handleSubmit(pw)} className="grid gap-3"><h2 className="text-xl">Change password</h2><input type="password" className="field" placeholder="Current password" {...b.register('current', { required: true })} /><input type="password" className="field" placeholder="New password (8+)" {...b.register('next', { required: true })} /><button className="btn-line">Change password</button></form>
    <form onSubmit={c.handleSubmit(async d => { try { const r = await api.post('/auth/change-email', d); toast.success(r.data.message); c.reset() } catch (e) { toast.error(e.response?.data?.message || 'Failed') } })} className="grid gap-3"><h2 className="text-xl">Change email</h2><p className="text-xs text-white/50">Your email changes only after you confirm it from the new address.</p><input type="email" className="field" placeholder="New email" {...c.register('email', { required: true })} /><input type="password" className="field" placeholder="Your password" {...c.register('password', { required: true })} /><button className="btn-line">Send confirmation</button></form></div>)
}
