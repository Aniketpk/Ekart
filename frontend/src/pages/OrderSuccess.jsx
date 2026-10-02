import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle2, MapPin, PackageCheck, ShoppingBag } from 'lucide-react'

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function OrderSuccess() {
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const loadLatestOrder = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const { data } = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/myorder`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const paidOrders = (data.orders || []).filter((item) => item.status === 'Paid')
      paidOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setOrder(paidOrders[0] || null)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadLatestOrder() }, 0)
    return () => window.clearTimeout(timer)
  }, [loadLatestOrder])

  const address = order?.address

  return (
    <main className="min-h-[70vh] bg-transparent px-4 pb-16 pt-28 sm:px-6 lg:pt-32">
      <div className="mx-auto max-w-3xl">
        <section className="glass-surface-strong rounded-[2rem] p-6 text-center shadow-xl sm:p-10">
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={34} /></span>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">Payment confirmed</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Your order is confirmed.</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">Thanks for shopping with E-Kart. Your order details are available from your orders page.</p>
          {loading ? <p className="mt-5 text-sm text-slate-500" role="status">Loading order details…</p> : null}
          {!loading && order && <p className="mt-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Order ref · {order.razorpayOrderId ? `EK-${order.razorpayOrderId.slice(-8).toUpperCase()}` : 'Confirmed'}</p>}
          {!loading && !order && <p className="mt-5 text-sm text-slate-500">{loadError ? 'Your payment was confirmed. Order details are temporarily unavailable.' : 'Your payment was confirmed. Order details will appear in My orders shortly.'}</p>}
        </section>

        {order && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section className="glass-surface rounded-2xl p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-700"><PackageCheck size={18} /></span><div><h2 className="font-semibold text-slate-950">Order details</h2><p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div></div>
              <div className="space-y-3">
                {(order.products || []).map((item, index) => <div key={`${item.productId?._id || index}-${index}`} className="flex justify-between gap-4 text-sm"><span className="text-slate-600">{item.productId?.productName || 'Product'} × {item.quantity}</span><span className="font-medium text-slate-900">{money(Number(item.price ?? item.productId?.productPrice) * item.quantity)}</span></div>)}
              </div>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between text-slate-600"><span>Shipping</span><span>{Number(order.shipping) ? money(order.shipping) : 'Free'}</span></div>
                <div className="flex justify-between text-slate-600"><span>Tax</span><span>{money(order.tax)}</span></div>
                <div className="flex justify-between pt-2 text-base font-bold text-slate-950"><span>Total paid</span><span>{money(order.amount)}</span></div>
                <p className="pt-1 text-xs font-medium text-emerald-700">Status: {order.status}</p>
              </div>
            </section>

            <section className="glass-surface rounded-2xl p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-700"><MapPin size={18} /></span><div><h2 className="font-semibold text-slate-950">Delivering to</h2><p className="text-sm text-slate-500">{address?.fullName || 'Shipping address'}</p></div></div>
              {address ? <p className="text-sm leading-6 text-slate-600">{address.street}<br />{address.city}, {address.state} {address.zipCode}<br />{address.country}<br />{address.phone}</p> : <p className="text-sm text-slate-500">Address details are unavailable for this order.</p>}
              <p className="mt-4 text-sm text-slate-600">{order.products?.length || 0} products in this shipment</p>
            </section>
          </div>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={() => navigate('/products')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 font-semibold text-white transition hover:bg-blue-800"><ShoppingBag size={17} /> Continue shopping</button>
          <button onClick={() => navigate('/my-orders')} className="min-h-12 rounded-lg border border-white/80 bg-white/65 backdrop-blur px-6 font-semibold text-slate-800 transition hover:bg-slate-50">View my orders</button>
        </div>
      </div>
    </main>
  )
}
