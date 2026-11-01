import { useEffect, useState } from 'react'
import api from './api'
import { courses as fallback } from '../data/courses'
export function useCourses() {
  const [list, setList] = useState(fallback)
  useEffect(() => { api.get('/courses').then(r => { if (r.data.length) setList(r.data.map(c => ({ ...c, original: c.originalFee || c.original }))) }).catch(() => {}) }, [])
  return list
}
