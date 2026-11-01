import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth, home } from '../lib/auth'
export function Login() { return <AuthForm signup={false} /> }
export function Signup() { return <AuthForm signup /> }
function AuthForm({ signup }) {
  const { register, handleSubmit } = useForm(), { login } = useAuth(), nav = useNavigate()
  const go = async d => { try { const u = await login(signup ? '/auth/signup' : '/auth/login', d); nav(home(u)) } catch (e) { toast.error(e.response?.data?.message || 'Failed') } }
  return (<form onSubmit={handleSubmit(go)} className="max-w-sm mx-auto px-4 py-16 grid gap-3">
    <h1 className="text-3xl font-bold gold-text">{signup ? 'Create student account' : 'Student login'}</h1>
    {signup && <><input className="field" placeholder="Full name" {...register('name', { required: true })} /><input className="field" placeholder="Phone" {...register('phone')} /></>}
    <input className="field" type="email" placeholder="Email" {...register('email', { required: true })} />
    <input className="field" type="password" placeholder="Password (8+ characters)" {...register('password', { required: true })} />
    <button className="btn-gold">{signup ? 'Sign up' : 'Log in'}</button>
    {!signup && <Link className="text-gold text-sm" to="/forgot">Forgot password?</Link>}
    <Link className="text-gold text-sm" to={signup ? '/login' : '/signup'}>{signup ? 'Already registered? Log in' : 'New student? Sign up'}</Link>
  </form>)
}
