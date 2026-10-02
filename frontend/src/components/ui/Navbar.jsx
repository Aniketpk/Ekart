import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react'
import { Button } from './button'
import axios from 'axios'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'

const navLinks = [{ label: 'Home', path: '/' }, { label: 'Products', path: '/products' }, { label: 'Categories', path: '/products#catalog-categories' }]

const Navbar = () => {
  const { user } = useSelector((state) => state.user)
  const { cart } = useSelector((state) => state.products)
  const accessToken = localStorage.getItem('accessToken')
  const admin = user?.role === 'admin'
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(window.scrollY > 24)
  const headerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!menuOpen) return undefined
    const outside = (event) => { if (!headerRef.current?.contains(event.target)) setMenuOpen(false) }
    const escape = (event) => { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [menuOpen])

  const isActive = (path) => path === '/' ? location.pathname === '/' : path.includes('#') ? location.pathname === path.split('#')[0] : location.pathname.startsWith(path)
  const handleSearch = (event) => {
    event.preventDefault()
    setMenuOpen(false)
    navigate(`/products${searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : ''}`)
  }
  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/logout`, {}, { headers: { Authorization: `Bearer ${accessToken}` } })
      if (res.data.success) toast.success(res.data.message)
    } catch (error) { toast.error(error.response?.data?.message || 'Logout failed') }
    finally { setMenuOpen(false); localStorage.removeItem('accessToken'); dispatch(setUser(null)); navigate('/') }
  }
  const linkClass = (path) => `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive(path) ? 'bg-white/75 text-[#173b5c] shadow-sm' : 'text-slate-600 hover:bg-white/55 hover:text-[#173b5c]'}`

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className={`glass-nav relative mx-auto flex max-w-[1240px] items-center justify-between gap-3 rounded-full px-3 transition-all duration-300 sm:px-5 ${scrolled ? 'min-h-[58px] bg-white/88 shadow-[0_10px_32px_rgba(20,44,67,.13)]' : 'min-h-[68px] bg-white/72 shadow-[0_12px_38px_rgba(20,44,67,.10)]'}`}>
        <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0 rounded-full px-2 py-1 font-display text-[21px] font-bold tracking-tight text-[#173b5c]">E-Kart</Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ label, path }) => <Link key={path} to={path} className={linkClass(path)}>{label}</Link>)}
          {admin && <Link to="/dashboard/sales" className={linkClass('/dashboard')}>Dashboard</Link>}
        </nav>
        <form onSubmit={handleSearch} className="hidden max-w-[300px] flex-1 md:block lg:mx-2">
          <label className="glass-control flex h-10 items-center gap-2 rounded-full px-3.5 text-slate-500 focus-within:ring-2 focus-within:ring-sky-600/25">
            <Search aria-hidden="true" size={16} /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search products" placeholder="Search the catalog" className="!w-full !border-0 !bg-transparent !p-0 text-sm !shadow-none outline-none placeholder:text-slate-500" />
          </label>
        </form>
        <div className="flex shrink-0 items-center gap-1">
          <Link to="/cart" onClick={() => setMenuOpen(false)} aria-label="Shopping cart" className="relative grid h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-white/70 hover:text-[#173b5c]"><ShoppingCart size={19} />{(cart?.items?.length || 0) > 0 && <span className="absolute right-0 top-0 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-[#173b5c] px-1 text-[10px] font-bold text-white">{cart.items.length}</span>}</Link>
          {user ? <Link to={`/profile/${user._id}`} aria-label="My account" className="hidden h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-white/70 sm:grid"><User size={18} /></Link> : <Link to="/login" aria-label="Log in" className="hidden h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-white/70 sm:grid"><User size={18} /></Link>}
          {user ? <Button onClick={logoutHandler} className="hidden h-10 rounded-full bg-[#173b5c] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#102c47] sm:inline-flex">Log out</Button> : <Link to="/login" className="hidden sm:inline-flex"><Button className="h-10 rounded-full bg-[#173b5c] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#102c47]">Log in</Button></Link>}
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-white/70 lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
        {menuOpen && <div id="mobile-navigation" className="glass-surface-strong absolute left-0 right-0 top-[calc(100%+10px)] rounded-[1.5rem] p-4 shadow-xl lg:hidden">
          <form onSubmit={handleSearch} className="glass-control mb-3 flex h-11 items-center gap-2 rounded-xl px-3 text-slate-500 md:hidden"><Search size={16} /><input type="search" aria-label="Search products" placeholder="Search products" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="!w-full !border-0 !bg-transparent !p-0 text-sm !shadow-none outline-none" /></form>
          <nav aria-label="Mobile navigation" className="grid gap-1">
            {navLinks.map(({ label, path }) => <Link key={path} to={path} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-white/75">{label}</Link>)}
            {user ? <><Link to={`/profile/${user._id}`} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white/75">My account</Link><Link to="/my-orders" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white/75">My orders</Link>{admin && <Link to="/dashboard/sales" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white/75">Dashboard</Link>}<button type="button" onClick={logoutHandler} className="rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-white/75">Log out</button></> : <><Link to="/cart" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white/75">Shopping cart</Link><Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white/75">Log in</Link><Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white/75">Create account</Link></>}
          </nav>
        </div>}
      </div>
    </header>
  )
}
export default Navbar
