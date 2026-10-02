import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowUpRight, ShoppingBag } from 'lucide-react'

export default function Footer() {
  const { user } = useSelector((state) => state.user)
  const linkClass = 'inline-flex min-h-9 items-center text-sm text-slate-300/85 transition hover:text-white'
  return <footer className="relative isolate overflow-hidden bg-[#10243a] text-white">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_0%,rgba(67,111,148,.32),transparent_35%),linear-gradient(140deg,#10243a,#132f49)]"/>
    <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:px-7 sm:py-16 md:grid-cols-[1.5fr_1fr_1fr]">
      <div className="max-w-sm"><Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-white/10"><ShoppingBag size={17}/></span>E-Kart</Link><p className="mt-4 text-sm leading-6 text-slate-300">Explore the E-Kart catalog, keep your cart close, and review your orders from your account.</p><Link to="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-200 transition hover:text-white">Explore the catalog <ArrowUpRight size={15}/></Link></div>
      <nav aria-label="Shop links"><h2 className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-sky-200">Shop</h2><ul className="grid">{[['Home','/'],['Products','/products'],['Cart','/cart']].map(([label,to])=><li key={to}><Link className={linkClass} to={to}>{label}</Link></li>)}</ul></nav>
      <nav aria-label="Account links"><h2 className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-sky-200">Your account</h2><ul className="grid">{user ? <><li><Link className={linkClass} to={`/profile/${user._id}`}>Profile</Link></li><li><Link className={linkClass} to="/my-orders">Orders</Link></li></> : <><li><Link className={linkClass} to="/login">Sign in</Link></li><li><Link className={linkClass} to="/signup">Create account</Link></li></>}</ul></nav>
    </div>
    <div className="border-t border-white/10"><div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-7"><span>© {new Date().getFullYear()} E-Kart</span><span>Product and order details are provided by the E-Kart service.</span></div></div>
  </footer>
}
