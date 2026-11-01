import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
const D = 'Learn Forex, Cryptocurrency and Gold Trading with MAXAM TRADER INSTITUTE. Explore professional courses, expert mentorship, online admission and flexible learning programs.'
const T = { '/': ['MAXAM TRADER INSTITUTE | Professional Trading Education in Pakistan', D], '/courses': ['Trading Courses | MAXAM TRADER INSTITUTE', 'Forex, crypto and gold trading courses with live sessions, mentorship and certificates.'], '/apply': ['Apply Online | MAXAM TRADER INSTITUTE', 'Apply online for a MAXAM trading course and track your application.'], '/office': ['Official Office | MAXAM TRADER INSTITUTE', 'Visit the MAXAM office, see opening hours and book an appointment.'], '/signals': ['Free Educational Signals | MAXAM TRADER INSTITUTE', 'Educational trading signals. Not financial advice.'], '/vip': ['VIP Membership | MAXAM TRADER INSTITUTE', 'Lifetime mentorship, VIP signals and live trading room.'], '/verify': ['Verify Certificate | MAXAM TRADER INSTITUTE', 'Check a MAXAM certificate ID.'] }
const up = (sel, tag, attrs) => { let e = document.head.querySelector(sel); if (!e) { e = document.createElement(tag); document.head.appendChild(e) } Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); return e }
export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    let [t, d] = T[pathname] || ['MAXAM TRADER INSTITUTE', D]
    if (pathname.startsWith('/courses/')) t = pathname.split('/')[2].replace(/-/g, ' ') + ' Course | MAXAM TRADER INSTITUTE'
    document.title = t
    up('meta[name=description]', 'meta', { name: 'description', content: d }); up('meta[property="og:title"]', 'meta', { property: 'og:title', content: t }); up('meta[property="og:description"]', 'meta', { property: 'og:description', content: d })
    up('link[rel=canonical]', 'link', { rel: 'canonical', href: location.origin + pathname })
    const ld = document.head.querySelector('script[data-ld]'); if (pathname !== '/') ld?.remove()
    else up('script[data-ld]', 'script', { type: 'application/ld+json', 'data-ld': '1' }).textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: 'MAXAM TRADER INSTITUTE', description: D, url: location.origin, areaServed: 'PK' })
  }, [pathname])
  return null
}
