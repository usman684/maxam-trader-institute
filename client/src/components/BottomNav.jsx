import { NavLink } from 'react-router-dom'
import { Home, BookOpen, FileText, LineChart, User } from 'lucide-react'
import { useAuth, home } from '../lib/auth'
export default function BottomNav() {
  const { user } = useAuth()
  const items = [['/', Home, 'Home'], ['/courses', BookOpen, 'Courses'], ['/apply', FileText, 'Apply'], ['/signals', LineChart, 'Signals'], [user ? home(user) : '/login', User, user ? 'Account' : 'Login']]
  return (<><div className="h-14 xl:hidden" /><nav className="xl:hidden fixed bottom-0 inset-x-0 z-40 bg-ink/95 backdrop-blur border-t border-dgold/30 flex justify-around pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
    {items.map(([to, I, l]) => <NavLink key={l} to={to} className={({ isActive }) => `flex flex-col items-center text-[11px] ${isActive ? 'text-gold' : 'text-white/60'}`}><I size={20} />{l}</NavLink>)}</nav></>)
}
