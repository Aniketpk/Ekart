import React from 'react'
import { Link } from 'react-router-dom'
import { PackageCheck, ShoppingBag } from 'lucide-react'
import { Skeleton } from './skeleton'

const money = (amount, currency = 'INR') => `${currency === 'INR' ? '₹' : `${currency} `}${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const OrderCard = ({ userOrder, loading, error = false, title = 'My Orders' }) => (
    <section className="w-full">
        <div className="mb-6 flex items-end justify-between gap-4">
            <div><p className="font-mono-label mb-2 text-[#173b5c]">Your account</p><h1 className="font-display text-3xl font-bold text-slate-950">{title}</h1></div>
            <Link to="/products" className="hidden text-sm font-semibold text-[#173b5c] hover:underline sm:inline">Continue shopping</Link>
        </div>
        {loading ? <div className="space-y-4" role="status" aria-label="Loading orders">{[1, 2].map((item) => <div key={item} className="glass-surface rounded-2xl p-5"><Skeleton className="mb-4 h-5 w-48" /><Skeleton className="h-16 w-full" /></div>)}</div>
            : error ? <div className="glass-surface rounded-2xl p-8 text-center"><p className="font-semibold text-slate-900">Orders are unavailable right now.</p><p className="mt-1 text-sm text-slate-600">Refresh the page to try again.</p></div>
            : !userOrder?.length ? <div className="glass-surface rounded-2xl px-6 py-14 text-center"><ShoppingBag className="mx-auto mb-3 text-slate-400" size={30} /><p className="font-semibold text-slate-900">No orders yet</p><p className="mt-1 text-sm text-slate-600">Your placed orders will appear here.</p><Link to="/products" className="mt-5 inline-flex rounded-xl bg-[#173b5c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#102c47]">Browse products</Link></div>
            : <div className="space-y-4">
                {userOrder.map((order) => <details key={order._id} className="glass-surface group rounded-2xl shadow-sm">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 p-4 marker:hidden sm:p-5">
                        <span className="min-w-0"><span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Order · {order.razorpayOrderId ? `EK-${order.razorpayOrderId.slice(-8).toUpperCase()}` : String(order._id).slice(-8).toUpperCase()}</span><span className="mt-1 block text-sm text-slate-700">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date unavailable'}</span></span>
                        <span className="flex items-center gap-3 sm:gap-5"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : order.status === 'Failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{order.status}</span><span className="font-display font-bold text-slate-950">{money(order.amount, order.currency)}</span><span className="hidden text-xs font-semibold text-[#173b5c] sm:inline">Details ↓</span></span>
                    </summary>
                    <div className="border-t border-slate-100 px-4 py-4 sm:px-5">
                        <div className="glass-control mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl px-4 py-3"><div className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#173b5c] text-xs font-bold text-white">1</span><span><span className="block text-xs font-semibold text-slate-800">Order submitted</span><span className="block text-[11px] text-slate-500">{order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Date unavailable'}</span></span></div><span className="h-px w-8 bg-slate-300"/><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${order.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : order.status === 'Failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>Payment · {order.status}</span></div>
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"><PackageCheck size={17} className="text-[#173b5c]" /> Items in this order</div>
                        <div className="space-y-3">
                            {order.products?.map((item, index) => {
                                const product = item.productId
                                const content = <><span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-50 text-slate-300">{product?.productImg?.[0]?.url ? <img src={product.productImg[0].url} alt="" className="h-full w-full object-contain p-1" /> : <ShoppingBag size={20} />}</span><span className="min-w-0 flex-1"><span className="block truncate font-medium text-slate-800">{product?.productName || 'Product no longer available'}</span><span className="mt-1 block text-xs text-slate-500">Qty {item.quantity}</span></span><span className="shrink-0 text-sm font-semibold text-slate-800">{money(Number(item.price ?? product?.productPrice) * item.quantity, order.currency)}</span></>
                                return product?._id ? <Link key={`${product._id}-${index}`} to={`/products/${product._id}`} className="flex min-w-0 items-center gap-3 rounded-xl p-2 hover:bg-slate-50">{content}</Link> : <div key={`${order._id}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl p-2">{content}</div>
                            })}
                        </div>
                        {order.address && <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600"><strong className="text-slate-800">Delivery address:</strong> {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipCode}, {order.address.country}</p>}
                    </div>
                </details>)}
            </div>}
        <Link to="/products" className="mt-5 inline-flex text-sm font-semibold text-[#173b5c] hover:underline sm:hidden">Continue shopping</Link>
    </section>
)
