import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth, home } from '../lib/auth'
import Logo from '../components/Logo'
export default function AdminLogin() {
  const { register, handleSubmit } = useForm(), { login } = useAuth(), nav = useNavigate()
  const go = async d => { try { nav(home(await login('/auth/admin-login', d))) } catch (e) { toast.error(e.response?.data?.message || 'Login failed') } }
  return (<form onSubmit={handleSubmit(go)} className="max-w-sm mx-auto px-4 py-16 grid gap-3">
    <Logo /><h1 className="text-3xl font-bold gold-text mt-2">Team login</h1><p className="text-sm text-white/60">For admins, mentors and staff only. Students please use the student login.</p>
    <input className="field" type="email" placeholder="Work email" autoComplete="username" {...register('email', { required: true })} />
    <input className="field" type="password" placeholder="Password" autoComplete="current-password" {...register('password', { required: true })} />
    <button className="btn-gold">Log in</button><Link to="/forgot" className="text-gold text-sm">Forgot password?</Link><Link to="/login" className="text-white/50 text-sm">Student login</Link></form>)
}
