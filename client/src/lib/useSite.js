import { useEffect, useState } from 'react'
import api from './api'
import config from '../config'
let cache
const clean = o => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => v))
const merge = d => ({ social: { ...config.social, ...clean(d.social) }, office: { ...config.office, ...clean(d.office) }, contact: { ...config.contact, ...clean(d.contact) } })
export function useSite() {
  const [s, setS] = useState(merge({}))
  useEffect(() => { cache ||= api.get('/settings').then(r => r.data).catch(() => ({})); cache.then(d => setS(merge(d))) }, [])
  return s
}
export const fullAddress = o => [o.building, o.floor, o.address, o.area, o.city, o.province, o.postal].filter(Boolean).join(', ')
export function mapSrc(o = {}) {
  let m = o.mapEmbed || ''; const f = m.match(/src="([^"]+)"/); if (f) m = f[1]
  if (/^https:\/\/www\.google\.com\/maps\/embed/.test(m)) return m
  const q = fullAddress(o); return q ? `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed` : ''
}
export function dirUrl(o = {}) { if (/^https?:\/\//.test(o.directions || '')) return o.directions; const q = fullAddress(o); return q ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}` : '' }
