import { API_BASE_URL } from '@/lib/apiBase'
import React, { useState } from 'react'
import { Button } from './button'
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '../../redux/productsSlice'
import { useNavigate } from 'react-router-dom'

const ProductDesc = ({ product }) => {
  const [adding, setAdding] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const accessToken = localStorage.getItem('accessToken')

  const addToCart = async (buyNow = false) => {
    if (!accessToken) { toast.error('Sign in to add products to your cart.'); navigate('/login'); return }
    setAdding(true)
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/v1/cart/add`, { productId: product._id }, { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true })
      if (!data.success) throw new Error(data.message || 'Could not add product')
      dispatch(setCart(data.cart))
      toast.success('Added to your cart')
      if (buyNow) navigate('/address')
    } catch (error) { toast.error(error.response?.data?.message || error.message || 'Could not add this product. Please try again.') }
    finally { setAdding(false) }
  }

  return <section className="glass-surface-strong rounded-[1.75rem] p-5 shadow-xl sm:p-7 lg:p-9">
    <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-[#426a8c]">{[product?.category, product?.brand].filter(Boolean).join(' · ') || 'E-Kart catalog'}</p>
    <h1 className="font-display text-3xl font-semibold leading-[1.08] tracking-[-.035em] text-slate-950 sm:text-4xl">{product?.productName}</h1>
    <p className="mt-4 max-h-36 overflow-auto whitespace-pre-line text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{product?.productDesc}</p>
    <div className="my-6 flex items-end justify-between gap-4 border-y border-slate-200/70 py-5"><div><p className="text-xs font-medium uppercase tracking-wider text-slate-500">Listed price</p><p className="mt-1 font-display text-3xl font-semibold tracking-tight text-slate-950">₹{Number(product?.productPrice || 0).toLocaleString('en-IN')}</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/85 px-3 py-1.5 text-xs font-semibold text-emerald-800"><ShieldCheck size={14}/> In catalog</span></div>
    <div className="grid gap-3 sm:grid-cols-2"><Button disabled={adding} onClick={() => addToCart(false)} className="min-h-12 rounded-full bg-[#173b5c] text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#102c47]"><ShoppingCart size={17} className="mr-2"/>{adding ? 'Adding…' : 'Add to cart'}</Button><Button disabled={adding} variant="outline" onClick={() => addToCart(true)} className="min-h-12 rounded-full border-[#173b5c]/20 bg-white/60 text-[#173b5c] hover:bg-white"><span>Buy now</span><ArrowRight size={16} className="ml-2"/></Button></div>
    <p className="mt-4 text-center text-xs leading-5 text-slate-500">Availability and final order totals are confirmed during checkout.</p>
  </section>
}
export default ProductDesc
