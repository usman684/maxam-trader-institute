import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'
export default function ThemeToggle() {
  const [t, setT] = useState(document.documentElement.dataset.theme || 'dark')
  const flip = () => { const n = t === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = n; localStorage.setItem('theme', n); setT(n) }
  return <button onClick={flip} aria-label={t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} className="p-2 rounded border border-dgold/40 text-gold">{t === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
}
