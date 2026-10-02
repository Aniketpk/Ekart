import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PackageSearch, ShoppingCart } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCart } from '../../redux/productsSlice'
import { toast } from 'sonner'

const ProductCard = ({ product, loading = false }) => {
  const [imageFailed, setImageFailed] = useState(false)
  const [adding, setAdding] = useState(false)
  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const productName = product?.productName || 'Product'
  const image = product?.productImg?.[0]?.url

  const addToCart = async () => {
    if (!accessToken) { toast.error('Sign in to add products to your cart.'); navigate('/login'); return }
    setAdding(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/cart/add`, { productId: product._id }, { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true })
      if (res.data.success) { dispatch(setCart(res.data.cart)); toast.success('Added to your cart') }
    } catch (error) { toast.error(error.response?.data?.message || 'Could not add this product. Please try again.') }
    finally { setAdding(false) }
  }

  if (loading) return <div className="glass-product-card flex h-full flex-col overflow-hidden rounded-[1.65rem]"><Skeleton className="aspect-square w-full rounded-none" /><div className="flex flex-1 flex-col gap-3 p-4 sm:p-5"><Skeleton className="h-3 w-20" /><Skeleton className="h-5 w-4/5" /><Skeleton className="mt-auto h-10 w-full" /></div></div>

  return <article className="glass-product-card group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.65rem] border border-white/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(29,54,79,.16)]">
    <Link to={`/products/${product._id}`} aria-label={`View ${productName}`} className="relative m-2 block aspect-square overflow-hidden rounded-[1.25rem] bg-[radial-gradient(ellipse_at_50%_45%,rgba(210,225,237,.65),rgba(244,247,249,.9)_60%,rgba(232,239,245,.75))] sm:m-3">
      {image && !imageFailed ? <img src={image} alt={productName} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.045] sm:p-7" /> : <div className="grid h-full place-items-center text-slate-400"><PackageSearch size={36} strokeWidth={1.4} /></div>}
      <span className="glass-control absolute left-3 top-3 max-w-[80%] truncate rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-700">{product?.category || product?.brand || 'E-Kart catalog'}</span>
    </Link>
    <div className="flex flex-1 flex-col px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
      <p className="mb-1 truncate text-[11px] font-medium uppercase tracking-[.16em] text-slate-500">{product?.brand || 'E-Kart'}</p>
      <Link to={`/products/${product._id}`} className="line-clamp-2 min-h-11 font-display text-[15px] font-semibold leading-5 text-slate-900 transition-colors hover:text-[#173b5c] sm:text-base">{productName}</Link>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4"><span className="font-display text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">₹{Number(product?.productPrice || 0).toLocaleString('en-IN')}</span><span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Listed price</span></div>
      <button type="button" onClick={addToCart} disabled={adding} aria-label={`Add ${productName} to cart`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#173b5c] px-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(23,59,92,.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#102c47] active:translate-y-0 disabled:cursor-wait disabled:opacity-70"><ShoppingCart size={16} />{adding ? 'Adding…' : 'Add to cart'}</button>
    </div>
  </article>
}
export default ProductCard
