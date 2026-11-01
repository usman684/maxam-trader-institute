import { useState, useEffect } from 'react'
import api from '../lib/api'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomeExtra from './HomeExtra'
import Ticker from '../components/Ticker'
import { pkr } from '../data/courses'
import { useCourses } from '../lib/useCourses'
export default function Home() {
  const courses = useCourses(), [st, setSt] = useState({})
  useEffect(() => { api.get('/settings').then(r => setSt(r.data.stats || {})) }, [])
  const [noVideo, setNoVideo] = useState(false)
  return (<>
    <section className="theme-dark relative min-h-[88vh] flex items-center overflow-hidden">
      {!noVideo && <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline poster="/hero.jpg" onError={() => setNoVideo(true)}><source src="/hero.mp4" type="video/mp4" onError={() => setNoVideo(true)} /></video>}
      {noVideo && <div className="candles" aria-hidden>{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ animationDelay: `${i * .25}s` }} />)}</div>}
      <div className="absolute inset-0 bg-black/70" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="relative max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-7xl font-extrabold gold-text">MAXAM TRADER INSTITUTE</h1>
        <p className="mt-5 text-xl md:text-2xl max-w-2xl">Pakistan's Leading Professional Trading Education Institute</p>
        <p className="mt-3 text-white/70 max-w-xl">Master Forex, Cryptocurrency and Gold Trading with Professional Mentorship.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/apply" className="btn-gold">Apply Online</Link><Link to="/courses" className="btn-line">Explore Courses</Link><Link to="/demo" className="btn-line">Watch Free Demo</Link></div>
      </motion.div>
    </section>
    <Ticker />
    <section className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {[[st.students || '6,500+', 'Students'], [st.rating || '4.9/5', 'Student Rating'], [st.years || '3+', 'Years Experience'], [st.positive || '92%', 'Positive Reviews']].map(([n, l]) => <div key={l}><div className="text-3xl font-display font-bold text-gold">{n}</div><div className="text-white/60 text-sm">{l}</div></div>)}
    </section>
    <section className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6">Featured Courses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">{courses.map(c => <Link key={c.slug} to={`/courses/${c.slug}`} className="bg-coal border border-dgold/30 rounded-lg p-5 hover:border-gold">
        {c.badge && <span className="text-xs bg-gold text-ink px-2 py-0.5 rounded">{c.badge}</span>}
        <h3 className="mt-2 font-semibold text-lg">{c.title}</h3><p className="text-white/60 text-sm">{c.duration}</p>
        <p className="mt-3 text-gold font-bold">{pkr(c.fee)} {c.original && <s className="text-white/40 text-sm font-normal">{pkr(c.original)}</s>}</p></Link>)}</div>
    </section>
    <HomeExtra />
  </>)
}
