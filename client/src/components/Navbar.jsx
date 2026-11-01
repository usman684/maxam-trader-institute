import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import SocialLinks from './Social'
import { useAuth, home } from '../lib/auth'
const base = [['/', 'Home'], ['/about', 'About Institute'], ['/courses', 'Courses'], ['/vip', 'VIP Membership'], ['/results', 'Results'], ['/mentors', 'Mentors'], ['/signals', 'Free Signals'], ['/reviews', 'Reviews'], ['/office', 'Office Location'], ['/contact', 'Contact'], ['/login', 'Student Login']]
export default function Navbar() {
  const [open, setOpen] = useState(false), { user } = useAuth()
  const links = base.map(([t, l]) => t === '/login' && user ? [home(user), ['admin', 'superadmin'].includes(user.role) ? 'Admin Panel' : ['mentor', 'staff'].includes(user.role) ? 'Staff Panel' : 'My Dashboard'] : [t, l])
  return (<header className="sticky top-0 z-50 bg-ink/90 backdrop-blur border-b border-dgold/30">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/"><Logo /></Link>
      <nav className="hidden xl:flex gap-5 text-sm">{links.map(([to, l]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'text-gold' : 'text-white/80 hover:text-gold'}>{l}</NavLink>)}</nav>
      <div className="hidden xl:flex gap-2 items-center"><ThemeToggle /><Link to="/apply" className="btn-line">Apply Online</Link><Link to="/courses" className="btn-gold">Enroll Now</Link></div>
      <button className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div className="xl:hidden bg-coal px-4 py-4 grid gap-3 max-h-[80vh] overflow-y-auto"><div><ThemeToggle /></div>{links.map(([to, l]) => <Link key={to} to={to} onClick={() => setOpen(false)}>{l}</Link>)}
      <Link to="/apply" onClick={() => setOpen(false)} className="btn-gold text-center">Apply Online</Link><SocialLinks /></div>}
  </header>)
}
