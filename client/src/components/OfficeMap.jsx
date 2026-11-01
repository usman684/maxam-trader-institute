import { mapSrc, dirUrl } from '../lib/useSite'
export default function OfficeMap({ office = {}, wa = '', height = 'h-72' }) {
  const src = mapSrc(office), dir = dirUrl(office)
  if (!src) return <div className="bg-coal border border-dgold/30 rounded-lg p-6 text-white/60 text-sm">The office map will appear here once the address is published.</div>
  return (<div className="grid gap-3"><iframe title="Office location" src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className={`w-full ${height} rounded-lg border border-dgold/30`} />
    <div className="flex gap-2 flex-wrap">{dir && <a className="btn-gold" href={dir} target="_blank" rel="noreferrer">Get directions</a>}{office.phone && <a className="btn-line" href={`tel:${office.phone}`}>Call office</a>}{wa && <a className="btn-line" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp</a>}{office.email && <a className="btn-line" href={`mailto:${office.email}`}>Email</a>}</div></div>)
}
