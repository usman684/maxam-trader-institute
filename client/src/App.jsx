import { lazy, Suspense } from 'react'
import Seo from './components/Seo'
import BottomNav from './components/BottomNav'
import { Maintenance, NotFound } from './components/Gate'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Skeleton from './components/Skeleton'
import Home from './pages/Home'
import { AuthProvider, Guard } from './lib/auth'
const Courses = lazy(() => import('./pages/Courses').then(m => ({ default: m.Courses })))
const CourseDetail = lazy(() => import('./pages/Courses').then(m => ({ default: m.CourseDetail })))
const Login = lazy(() => import('./pages/Auth').then(m => ({ default: m.Login })))
const Signup = lazy(() => import('./pages/Auth').then(m => ({ default: m.Signup })))
const Track = lazy(() => import('./pages/Track'))
const Demo = lazy(() => import('./pages/Public').then(m => ({ default: m.Demo })))
const Office = lazy(() => import('./pages/Office'))
const Signals = lazy(() => import('./pages/Public').then(m => ({ default: m.Signals })))
const Static = lazy(() => import('./pages/Public').then(m => ({ default: m.Static })))
const Verify = lazy(() => import('./pages/Verify'))
const Forgot = lazy(() => import('./pages/Account').then(m => ({ default: m.Forgot })))
const Reset = lazy(() => import('./pages/Account').then(m => ({ default: m.Reset })))
const VerifyEmail = lazy(() => import('./pages/Account').then(m => ({ default: m.VerifyEmail })))
const Contact = lazy(() => import('./pages/Account').then(m => ({ default: m.Contact })))
const AdminFinance = lazy(() => import('./pages/AdminFinance')), AdminAcademic = lazy(() => import('./pages/AdminAcademic'))
const StaffDashboard = lazy(() => import('./pages/StaffDashboard'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const Results = lazy(() => import('./pages/Showcase').then(m => ({ default: m.Results })))
const Mentors = lazy(() => import('./pages/Showcase').then(m => ({ default: m.Mentors })))
const Reviews = lazy(() => import('./pages/Showcase').then(m => ({ default: m.Reviews })))
const Learn = lazy(() => import('./pages/Learn'))
const Apply = lazy(() => import('./pages/Apply')), Dashboard = lazy(() => import('./pages/Dashboard')), Admin = lazy(() => import('./pages/Admin'))
const AdminManage = lazy(() => import('./pages/AdminManage')), ContentPage = lazy(() => import('./pages/Content')), Profile = lazy(() => import('./pages/Profile'))
const dyn = ['vip', 'faq'], statics = ['about', 'privacy', 'terms', 'refund', 'risk', ...dyn]
const adm = ['admin', 'superadmin', 'mentor', 'staff']
export default function App() {
  return (<AuthProvider><Toaster position="top-center" /><Navbar /><Seo /><Maintenance><Suspense fallback={<Skeleton />}>
    <Routes><Route path="/" element={<Home />} /><Route path="/courses" element={<Courses />} /><Route path="/courses/:slug" element={<CourseDetail />} /><Route path="/apply" element={<Apply />} />
      <Route path="/login" element={<Login />} /><Route path="/signup" element={<Signup />} /><Route path="/track" element={<Track />} /><Route path="/demo" element={<Demo />} /><Route path="/office" element={<Office />} /><Route path="/signals" element={<Signals />} />
      <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} /><Route path="/learn/:course" element={<Guard><Learn /></Guard>} /><Route path="/verify" element={<Verify />} /><Route path="/forgot" element={<Forgot />} /><Route path="/reset" element={<Reset />} /><Route path="/verify-email" element={<VerifyEmail />} /><Route path="/contact" element={<Contact />} /><Route path="/admin/finance" element={<Guard roles={['superadmin']}><AdminFinance /></Guard>} /><Route path="/admin/academic" element={<Guard roles={adm}><AdminAcademic /></Guard>} /><Route path="/staff" element={<Guard roles={adm}><StaffDashboard /></Guard>} /><Route path="/admin/login" element={<AdminLogin />} /><Route path="/results" element={<Results />} /><Route path="/mentors" element={<Mentors />} /><Route path="/reviews" element={<Reviews />} /><Route path="/profile" element={<Guard><Profile /></Guard>} />
      <Route path="/admin" element={<Guard roles={adm}><Admin /></Guard>} /><Route path="/admin/manage" element={<Guard roles={adm}><AdminManage /></Guard>} />
      {statics.map(k => <Route key={k} path={`/${k}`} element={dyn.includes(k) ? <ContentPage k={k} /> : <Static k={k} />} />)}<Route path="*" element={<NotFound />} /></Routes></Suspense></Maintenance><Footer /><BottomNav /></AuthProvider>)
}
