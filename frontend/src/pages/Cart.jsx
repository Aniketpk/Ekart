import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Minus, PackageOpen, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import axios from 'axios'
import { setCart } from '../redux/productsSlice'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function Cart() {
  const { cart } = useSelector((store) => store.products)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const accessToken = localStorage.getItem('accessToken')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const loadCart = useCallback(async () => {
    setLoading(true); setLoadError(false)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_URL}/api/v1/cart/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      if (data.success) dispatch(setCart(data.cart))
    } catch { setLoadError(true) } finally { setLoading(false) }
  }, [accessToken, dispatch])
  useEffect(() => { void loadCart() }, [loadCart])

  const updateQuantity = async (productId, type) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/v1/cart/update`, { productId, type }, { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true })
      if (data.success) { dispatch(setCart(data.cart)); toast.success(data.message) }
    } catch (error) { toast.error(error.response?.data?.message || 'Something went wrong') }
  }
  const removeItem = async (productId) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/cart/remove`, { data: { productId }, headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true })
      if (data.success) { dispatch(setCart(data.cart)); toast.success(data.message) }
    } catch (error) { toast.error(error.response?.data?.message || 'Something went wrong') }
  }
  const items = cart?.items || []
  const subtotal = Number(cart?.totalPrice || 0)
  const shipping = subtotal > 299 ? 0 : subtotal ? 10 : 0
  const tax = subtotal * .05
  const total = subtotal + shipping + tax
  const quantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)

  return <main className="min-h-screen bg-transparent px-4 pb-16 pt-28 sm:px-6 sm:pt-32"><div className="mx-auto max-w-[1240px]">
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono-label mb-2 text-[#426a8c]">Your selection</p><h1 className="font-display text-4xl font-semibold tracking-[-.04em] text-slate-950 sm:text-5xl">Shopping bag<span className="ml-3 align-middle font-body text-base font-medium tracking-normal text-slate-500">{loading ? '' : quantity}</span></h1><p className="mt-3 text-sm text-slate-600">Review items before continuing to checkout.</p></div><Link to="/products" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#173b5c] hover:bg-white/70 sm:inline-flex">Continue browsing <ArrowRight size={15} className="ml-2"/></Link></header>
    {loading ? <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-4">{[1,2].map((item)=><Skeleton key={item} className="h-48 rounded-3xl"/>)}</div><Skeleton className="h-80 rounded-3xl"/></div>
      : loadError ? <div className="glass-surface-strong rounded-[2rem] px-6 py-16 text-center"><PackageOpen className="mx-auto mb-4 text-slate-400"/><h2 className="font-display text-xl font-semibold text-slate-900">Your cart didn’t load.</h2><p className="mt-2 text-sm text-slate-600">Try again to retrieve your latest items.</p><button onClick={() => void loadCart()} className="mt-5 rounded-full bg-[#173b5c] px-6 py-3 text-sm font-semibold text-white">Try again</button></div>
      : items.length ? <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <section aria-label="Cart items" className="space-y-4">{items.map((item,index)=>{const product=item.productId;return <article key={product?._id || index} className="glass-surface group grid gap-4 rounded-[1.65rem] p-4 sm:grid-cols-[128px_minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:p-5">
          <Link to={product?._id ? `/products/${product._id}` : '/products'} className="relative grid aspect-[1.2] w-full place-items-center overflow-hidden rounded-[1.2rem] bg-[radial-gradient(ellipse,rgba(216,229,239,.74),rgba(246,248,250,.8)_72%)] sm:aspect-square sm:w-32"><img src={product?.productImg?.[0]?.url || '/Ekart.png'} alt={product?.productName || 'E-Kart product'} className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"/></Link>
          <div className="min-w-0"><p className="font-mono-label text-[10px] text-slate-500">{product?.brand || product?.category || 'E-Kart'}</p><Link to={product?._id ? `/products/${product._id}` : '/products'} className="mt-1 block line-clamp-2 font-display text-lg font-semibold text-slate-950 hover:text-[#173b5c]">{product?.productName || 'Product details unavailable'}</Link><p className="mt-2 text-sm text-slate-600">{money(product?.productPrice ?? item.price)} <span className="text-slate-400">each</span></p>
          <div className="mt-4 flex flex-wrap items-center gap-3"><div className="glass-control inline-flex h-10 items-center rounded-full p-1"><button type="button" aria-label="Decrease quantity" onClick={()=>updateQuantity(product?._id,'decrease')} disabled={item.quantity<=1} className="grid h-8 w-8 place-items-center rounded-full text-slate-600 transition hover:bg-white disabled:opacity-40"><Minus size={14}/></button><span className="w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span><button type="button" aria-label="Increase quantity" onClick={()=>updateQuantity(product?._id,'increase')} disabled={item.quantity>=99} className="grid h-8 w-8 place-items-center rounded-full text-slate-600 transition hover:bg-white disabled:opacity-40"><Plus size={14}/></button></div><button type="button" onClick={()=>removeItem(product?._id)} className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-700"><Trash2 size={14}/>Remove</button></div>
          </div><div className="flex items-center justify-between border-t border-slate-200/70 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right"><span className="text-xs font-medium uppercase tracking-wider text-slate-500 sm:hidden">Item total</span><span className="font-display text-lg font-semibold text-slate-950">{money((product?.productPrice ?? item.price) * item.quantity)}</span></div>
        </article>})}</section>
        <aside className="glass-surface-strong rounded-[1.75rem] p-5 shadow-xl sm:p-6 lg:sticky lg:top-28"><p className="font-mono-label text-[#426a8c]">At a glance</p><h2 className="mt-2 font-display text-2xl font-semibold text-slate-950">Order summary</h2><div className="mt-6 space-y-4 border-b border-slate-200/80 pb-5 text-sm"><div className="flex justify-between text-slate-600"><span>Subtotal · {quantity} items</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-slate-600"><span>Shipping</span><span>{shipping ? money(shipping) : 'Free'}</span></div><div className="flex justify-between text-slate-600"><span>Estimated tax</span><span>{money(tax)}</span></div></div><div className="flex justify-between gap-4 py-5 text-base font-semibold text-slate-950"><span>Estimated total</span><span className="font-display text-xl">{money(total)}</span></div><p className="-mt-2 mb-5 text-xs leading-5 text-slate-500">Final pricing is calculated by the checkout service.</p><button onClick={()=>navigate('/address')} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#173b5c] px-5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#102c47]">Continue to checkout <ArrowRight size={16}/></button><Link to="/products" className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white/50 text-sm font-semibold text-slate-700 transition hover:bg-white">Continue shopping</Link></aside>
      </div>
      : <div className="glass-surface-strong rounded-[2rem] px-6 py-16 text-center sm:py-24"><span className="mx-auto grid h-16 w-16 place-items-center rounded-[1.4rem] bg-white/75 text-[#426a8c] shadow-sm"><ShoppingBag size={27}/></span><p className="mt-5 font-mono-label text-slate-500">Nothing here yet</p><h2 className="mt-2 font-display text-2xl font-semibold text-slate-950">Your bag is waiting.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">Browse the E-Kart catalog and add products to see them here.</p><Link to="/products" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#173b5c] px-6 text-sm font-semibold text-white shadow-md hover:bg-[#102c47]">Explore products</Link></div>}
  </div></main>
}
