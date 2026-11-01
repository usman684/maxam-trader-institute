import { Facebook, Instagram, Youtube, Twitter, Linkedin, Send } from 'lucide-react'
import { useSite } from '../lib/useSite'
const Tik = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9a7.4 7.4 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5z" /></svg>
const P = [['facebook', 'Facebook', Facebook, 1], ['instagram', 'Instagram', Instagram, 1], ['youtube', 'YouTube', Youtube, 1], ['tiktok', 'TikTok', Tik, 1], ['x', 'X', Twitter], ['linkedin', 'LinkedIn', Linkedin], ['telegram', 'Telegram', Send]]
export default function SocialLinks() {
  const { social } = useSite()
  return <div className="flex gap-2 flex-wrap">{P.map(([k, l, I, always]) => {
    const on = /^https?:\/\//.test(social[k] || '')
    if (!on && !always) return null
    const cls = 'p-2 rounded border border-dgold/40 text-gold'
    return on ? <a key={k} href={social[k]} target="_blank" rel="noopener noreferrer" aria-label={l} title={l} className={`${cls} hover:bg-gold hover:text-ink`}><I size={20} /></a>
      : <span key={k} title={`${l}: link coming soon`} className={`${cls} opacity-40`}><I size={20} /></span>
  })}</div>
}
