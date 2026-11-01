import { Link, useParams } from 'react-router-dom'
import { Star, Users, Award } from 'lucide-react'
import { pkr } from '../data/courses'
import { useCourses } from '../lib/useCourses'
const off = c => c.original && c.original > c.fee ? Math.round((1 - c.fee / c.original) * 100) : 0
const Price = ({ c }) => <p className="mt-3 text-gold text-xl font-bold">{pkr(c.fee)} {c.original > c.fee && <><s className="text-white/40 text-sm font-normal">{pkr(c.original)}</s> <span className="text-xs bg-profit text-ink px-2 py-0.5 rounded">{off(c)}% off</span></>}</p>
const Meta = ({ c }) => <p className="text-white/60 text-sm mt-1 flex gap-3 flex-wrap items-center">{c.duration}, {c.level}{c.rating && <span className="flex items-center gap-1"><Star size={14} className="text-gold" />{c.rating}</span>}{c.enrolled && <span className="flex items-center gap-1"><Users size={14} />{c.enrolled} enrolled</span>}</p>
export function Courses() {
  const courses = useCourses()
  return (<div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-4xl font-bold mb-8">Courses</h1>
    <div className="grid md:grid-cols-2 gap-6">{courses.map(c => <div key={c.slug} className="bg-coal border border-dgold/30 rounded-lg overflow-hidden">
      {c.image && <img src={c.image} alt="" loading="lazy" className="w-full h-44 object-cover" />}
      <div className="p-6"><h2 className="text-xl font-semibold">{c.title} {c.badge && <span className="text-xs bg-gold text-ink px-2 py-0.5 rounded ml-2">{c.badge}</span>}</h2><Meta c={c} /><Price c={c} />
        <div className="mt-4 flex gap-3"><Link to={`/courses/${c.slug}`} className="btn-line">Details</Link><Link to={`/apply?course=${c.slug}`} className="btn-gold">Enroll Now</Link></div></div></div>)}</div></div>)
}
export function CourseDetail() {
  const courses = useCourses(), { slug } = useParams(), c = courses.find(x => x.slug === slug)
  if (!c) return <p className="p-10">Course not found. <Link className="text-gold" to="/courses">See all courses</Link></p>
  return (<div className="max-w-3xl mx-auto px-4 py-12">{c.image && <img src={c.image} alt="" className="w-full h-56 object-cover rounded-lg mb-6" />}
    <h1 className="text-4xl font-bold gold-text">{c.title}</h1><Meta c={c} /><Price c={c} />
    {c.outcomes?.length > 0 && <><h2 className="mt-8 mb-3 text-xl font-semibold">What you will learn</h2><ul className="grid gap-1 text-white/80 list-disc pl-5">{c.outcomes.map(o => <li key={o}>{o}</li>)}</ul></>}
    <h2 className="mt-8 mb-3 text-xl font-semibold">Syllabus</h2>
    {c.syllabus.map(s => <details key={s} className="border-b border-white/10 py-3"><summary className="cursor-pointer">{s}</summary><p className="text-white/60 text-sm mt-2">Lessons, notes and live sessions for this topic are available in your student portal.</p></details>)}
    <div className="mt-8 bg-coal border border-dgold/30 rounded p-4 flex gap-3 items-start text-sm"><Award className="text-gold shrink-0" /><p className="text-white/70">A verifiable certificate with a QR code is issued after you complete the course and the institute confirms your completion.</p></div>
    <p className="mt-4 text-xs text-white/40">Trading involves risk. Course content is educational and does not guarantee profit.</p>
    <Link to={`/apply?course=${c.slug}`} className="btn-gold mt-6">Enroll Now</Link></div>)
}
