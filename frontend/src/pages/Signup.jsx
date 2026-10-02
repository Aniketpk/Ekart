import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Eye, EyeOff, ArrowUpRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  const navigate = useNavigate()
  const handleChange = (event) => setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  const submitHandler = async (event) => {
    event.preventDefault()
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match.'); return }
    try {
      setLoading(true)
      const { firstName, lastName, email, password } = formData
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/register`, { firstName, lastName, email, password }, { headers: { 'Content-Type': 'application/json' } })
      if (res.data.success) { navigate('/verify'); toast.success(res.data.message) }
    } catch (error) { toast.error(error.response?.data?.message || 'Something went wrong') }
    finally { setLoading(false) }
  }
  return <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-8 sm:px-6">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_16%_12%,rgba(188,212,231,.6),transparent_36%),radial-gradient(ellipse_at_86%_88%,rgba(212,225,235,.72),transparent_38%)]"/>
    <div className="grid w-full max-w-[1080px] overflow-hidden rounded-[2rem] border border-white/75 bg-white/30 shadow-[0_28px_90px_rgba(25,53,78,.16)] backdrop-blur-sm md:min-h-[680px] md:grid-cols-[.86fr_1.14fr]">
      <section className="relative hidden overflow-hidden bg-[#10243a] p-10 text-white md:flex md:flex-col md:justify-between lg:p-14"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(113,164,202,.35),transparent_38%),linear-gradient(145deg,#10243a,#244763)]"/><Link to="/" className="relative font-display text-2xl font-semibold">E-Kart</Link><div className="relative"><p className="font-mono-label text-sky-200">Make it yours</p><h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-.04em] lg:text-5xl">Good technology, all in one place.</h1><p className="mt-5 max-w-sm text-sm leading-6 text-slate-200">Create your account to save your cart and keep track of your E-Kart orders.</p></div><div className="relative rounded-2xl border border-white/15 bg-white/[.08] p-4 text-sm text-slate-100 backdrop-blur-xl">E-Kart account · Shopping, orders, and profile</div></section>
      <section className="glass-surface-strong flex items-center justify-center rounded-[2rem] p-5 sm:p-9 md:rounded-none md:rounded-r-[2rem] lg:p-12"><form onSubmit={submitHandler} className="w-full max-w-md"><Link to="/" className="mb-5 inline-flex font-display text-xl font-bold text-[#173b5c] md:hidden">E-Kart</Link><p className="font-mono-label text-[#426a8c]">Start here</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950">Create account</h2><p className="mt-2 text-sm text-slate-600">Add your details to get started.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-slate-700">First name<input name="firstName" autoComplete="given-name" required value={formData.firstName} onChange={handleChange} placeholder="First name" className="glass-input min-h-12 rounded-xl px-4 text-sm outline-none focus:border-sky-700"/></label><label className="grid gap-2 text-sm font-medium text-slate-700">Last name<input name="lastName" autoComplete="family-name" required value={formData.lastName} onChange={handleChange} placeholder="Last name" className="glass-input min-h-12 rounded-xl px-4 text-sm outline-none focus:border-sky-700"/></label><label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">Email address<input name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className="glass-input min-h-12 rounded-xl px-4 text-sm outline-none focus:border-sky-700"/></label><label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">Password<span className="relative"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={10} maxLength={128} required value={formData.password} onChange={handleChange} placeholder="At least 10 characters" className="glass-input min-h-12 w-full rounded-xl px-4 pr-12 text-sm outline-none focus:border-sky-700"/><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-slate-500 hover:bg-white/70">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span></label><label className="grid gap-2 text-sm font-medium text-slate-700 sm:col-span-2">Confirm password<input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={10} maxLength={128} required value={formData.confirmPassword} onChange={handleChange} placeholder="Enter your password again" className="glass-input min-h-12 rounded-xl px-4 text-sm outline-none focus:border-sky-700"/></label></div>
        <button disabled={loading} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#173b5c] px-5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#102c47] disabled:opacity-70">{loading ? <><Loader2 className="h-4 w-4 animate-spin"/>Creating account…</> : <>Create account <ArrowUpRight size={16}/></>}</button><p className="mt-5 text-center text-sm text-slate-600">Already registered? <Link to="/login" className="font-semibold text-[#173b5c] hover:underline">Sign in</Link></p>
      </form></section>
    </div>
  </main>
}
