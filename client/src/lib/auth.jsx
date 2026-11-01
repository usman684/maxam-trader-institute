import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from './api'
const Ctx = createContext()
export const useAuth = () => useContext(Ctx)
export const home = u => ['admin', 'superadmin'].includes(u.role) ? '/admin' : ['mentor', 'staff'].includes(u.role) ? '/staff' : '/dashboard'
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [ready, setReady] = useState(false)
  useEffect(() => { if (!localStorage.getItem('token')) return setReady(true); api.get('/auth/me').then(r => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setReady(true)) }, [])
  const login = async (path, body) => { const { data } = await api.post(path, body); localStorage.setItem('token', data.token); const u = (await api.get('/auth/me')).data; setUser(u); return u }
  const logout = () => { localStorage.removeItem('token'); setUser(null) }
  return <Ctx.Provider value={{ user, ready, login, logout }}>{children}</Ctx.Provider>
}
export function Guard({ roles, children }) {
  const { user, ready } = useAuth()
  if (!ready) return <p className="p-10">Loading...</p>
  if (!user) return <Navigate to={roles ? '/admin/login' : '/login'} />
  return !roles || roles.includes(user.role) ? children : <Navigate to="/dashboard" />
}
