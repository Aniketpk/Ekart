import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, User } from 'lucide-react'
import { Button } from './button'
import axios from 'axios'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'

const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
]

const Navbar = () => {
    const { user } = useSelector((state) => state.user)
    const { cart } = useSelector((state) => state.products)
    const accessToken = localStorage.getItem('accessToken')
    const admin = user?.role === 'admin'
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [searchQuery, setSearchQuery] = useState('')

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/'
        if (path.includes('#')) return location.pathname === '/products'
        return location.pathname.startsWith(path)
    }

    const isDashboardActive = location.pathname.startsWith('/dashboard')

    const handleSearch = (e) => {
        e.preventDefault()
        const q = searchQuery.trim()
        if (q) {
            navigate(`/products?search=${encodeURIComponent(q)}`)
        } else {
            navigate('/products')
        }
    }

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/logout`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (res.data.success) {
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed')
        } finally {
            localStorage.removeItem('accessToken')
            dispatch(setUser(null))
            navigate('/')
        }
    }

    return (
        <header className="bg-white fixed w-full z-20 border-b border-[#e0e0e0]">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 py-3.5 px-6">
                {/* Logo */}
                <Link to="/" className="shrink-0">
                    <span className="font-display text-2xl font-bold text-[#001B4D] tracking-tight">Ekart</span>
                </Link>

                {/* Center Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map(({ label, path }) => (
                        <Link
                            key={label}
                            to={path}
                            className={`text-sm font-medium transition-colors relative pb-1 ${
                                isActive(path)
                                    ? 'text-[#001B4D] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#001B4D]'
                                    : 'text-[#5c5c6d] hover:text-[#001B4D]'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                    {admin && (
                        <Link
                            to="/dashboard/sales"
                            className={`text-sm font-medium transition-colors relative pb-1 ${
                                isDashboardActive
                                    ? 'text-[#001B4D] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#001B4D]'
                                    : 'text-[#5c5c6d] hover:text-[#001B4D]'
                            }`}
                        >
                            Dashboard
                        </Link>
                    )}
                </nav>

                {/* Search */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c5c6d]" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-[#f0f0f0] border border-[#e0e0e0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#001B4D]/20 focus:border-[#001B4D] font-body"
                        />
                    </div>
                </form>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link to="/cart" className="relative p-2 text-[#121212] hover:text-[#001B4D] transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        {(cart?.items?.length || 0) > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-[#001B4D] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                                {cart.items.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <Link
                            to={`/profile/${user._id}`}
                            className="p-1.5 rounded-full border-2 border-[#e0e0e0] text-[#001B4D] hover:border-[#001B4D] transition-colors"
                        >
                            <User className="w-4 h-4" />
                        </Link>
                    ) : (
                        <Link to="/login" className="p-1.5 text-[#5c5c6d] hover:text-[#001B4D]">
                            <User className="w-5 h-5" />
                        </Link>
                    )}

                    {user ? (
                        <Button
                            onClick={logoutHandler}
                            className="bg-[#001B4D] text-white hover:bg-[#0d1759] rounded-md px-4 py-2 text-sm font-medium cursor-pointer"
                        >
                            Logout
                        </Button>
                    ) : (
                        <Link to="/login">
                            <Button className="bg-[#001B4D] text-white hover:bg-[#0d1759] rounded-md px-4 py-2 text-sm font-medium cursor-pointer">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar
