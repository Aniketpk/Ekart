import { API_BASE_URL } from '@/lib/apiBase'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
import { Eye, EyeOff, ArrowUpRight, ShieldCheck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (event) => setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  const submitHandler = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(`${API_BASE_URL}/api/v1/user/login`, formData, { headers: { 'Content-Type': 'application/json' } })
      if (res.data.success) { localStorage.setItem('accessToken', res.data.accessToken); dispatch(setUser(res.data.user)); navigate('/'); toast.success(res.data.message) }
    } catch (error) { toast.error(error.response?.data?.message || 'Something went wrong') }
    finally { setLoading(false) }
  }
  return <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-8 sm:px-6">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_20%,rgba(188,212,231,.6),transparent_35%),radial-gradient(ellipse_at_88%_84%,rgba(212,225,235,.74),transparent_38%)]"/>
    <div className="grid w-full max-w-[1080px] overflow-hidden rounded-[2rem] border border-white/75 bg-white/30 shadow-[0_28px_90px_rgba(25,53,78,.16)] backdrop-blur-sm md:min-h-[610px] md:grid-cols-[1fr_.9fr]">
      <section className="relative hidden overflow-hidden bg-[#10243a] p-10 text-white md:flex md:flex-col md:justify-between lg:p-14"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(113,164,202,.35),transparent_38%),linear-gradient(145deg,#10243a,#244763)]"/><Link to="/" className="relative font-display text-2xl font-semibold">E-Kart</Link><div className="relative"><p className="font-mono-label text-sky-200">Your E-Kart account</p><h1 className="mt-4 max-w-md font-display text-4xl font-semibold leading-tight tracking-[-.04em] lg:text-5xl">Your next good find is closer.</h1><p className="mt-5 max-w-sm text-sm leading-6 text-slate-200">Sign in to manage your cart, checkout, and order history.</p></div><div className="relative flex items-center gap-2 text-xs text-sky-100"><ShieldCheck size={15}/> Your account helps keep your orders in one place.</div><div className="absolute -right-7 bottom-24 h-52 w-52 rounded-full border border-white/15 bg-white/[.05] shadow-[0_0_100px_rgba(132,180,215,.24)] backdrop-blur-xl lg:h-72 lg:w-72"><img src="/hero-phone.png" alt="Electronics from E-Kart" className="h-full w-full rounded-full object-cover opacity-90 mix-blend-screen"/></div></section>
      <section className="glass-surface-strong flex items-center justify-center rounded-[2rem] p-5 sm:p-10 md:rounded-none md:rounded-r-[2rem] lg:p-14">
        <form onSubmit={submitHandler} className="w-full max-w-sm"><Link to="/" className="mb-7 inline-flex font-display text-xl font-bold text-[#173b5c] md:hidden">E-Kart</Link><p className="font-mono-label text-[#426a8c]">Welcome back</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950">Sign in</h2><p className="mt-2 text-sm leading-6 text-slate-600">Use your E-Kart account details to continue.</p>
          <div className="mt-8 grid gap-5"><label className="grid gap-2 text-sm font-medium text-slate-700">Email address<input name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className="glass-input min-h-12 rounded-xl px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-700"/></label><label className="grid gap-2 text-sm font-medium text-slate-700">Password<span className="relative"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={formData.password} onChange={handleChange} placeholder="Enter your password" className="glass-input min-h-12 w-full rounded-xl px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-700"/><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-slate-500 hover:bg-white/70">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span></label></div>
          <button disabled={loading} className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#173b5c] px-5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#102c47] disabled:opacity-70">{loading ? <><Loader2 className="h-4 w-4 animate-spin"/>Signing in…</> : <>Sign in <ArrowUpRight size={16}/></>}</button>
          <p className="mt-6 text-center text-sm text-slate-600">New to E-Kart? <Link to="/signup" className="font-semibold text-[#173b5c] hover:underline">Create an account</Link></p>
        </form>
      </section>
    </div>
  </main>
}
