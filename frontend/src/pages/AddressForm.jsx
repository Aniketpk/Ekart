import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { ArrowLeft, Check, LockKeyhole, MapPin, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { addAddress, setCart, setSelectedAddress } from '../redux/productsSlice'

const emptyAddress = { fullName: '', phone: '', email: '', address: '', city: '', state: '', zipCode: '', country: 'India' }
const EMPTY_ITEMS = []
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function AddressForm() {
  const { cart, addresses = [], selectedAddress } = useSelector((store) => store.products)
  const [formData, setFormData] = useState(emptyAddress)
  const [showForm, setShowForm] = useState(addresses.length === 0)
  const [paying, setPaying] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = Array.isArray(cart?.items) ? cart.items : EMPTY_ITEMS
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.productId?.productPrice || item.price || 0) * Number(item.quantity || 0), 0), [items])
  const shipping = subtotal > 299 ? 0 : subtotal ? 10 : 0
  const tax = Number((subtotal * 0.05).toFixed(2))
  const previewTotal = subtotal + shipping + tax
  const selected = addresses[selectedAddress] || null

  const saveAddress = (event) => {
    event.preventDefault()
    dispatch(addAddress(formData))
    const nextIndex = addresses.length
    dispatch(setSelectedAddress(nextIndex))
    toast.success('Delivery address saved')
    setShowForm(false)
    setFormData(emptyAddress)
  }

  const startPayment = async () => {
    if (!selected || !items.length) return
    const accessToken = localStorage.getItem('accessToken')
    const apiUrl = (import.meta.env.VITE_URL || '').trim()
    const razorpayKeyId = (import.meta.env.VITE_RAZORPAY_KEY_ID || '').trim()
    if (!window.Razorpay || !razorpayKeyId) {
      toast.error('Payment is unavailable right now. Please try again later.')
      return
    }
    setPaying(true)
    try {
      const { data } = await axios.post(`${apiUrl}/api/v1/order/create-order`, {
        address: {
          fullName: selected.fullName,
          email: selected.email,
          phone: selected.phone,
          street: selected.address,
          city: selected.city,
          state: selected.state,
          zipCode: selected.zipCode,
          country: selected.country,
        },
      }, { headers: { Authorization: `Bearer ${accessToken}` } })
      if (!data.success || !data.order?.id) throw new Error(data.message || 'Could not create your order')
      const payment = new window.Razorpay({
        key: razorpayKeyId,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: 'E-Kart',
        description: 'Secure order payment',
        prefill: { name: selected.fullName, email: selected.email, contact: selected.phone },
        theme: { color: '#155eef' },
        handler: async (response) => {
          try {
            const verified = await axios.post(`${apiUrl}/api/v1/order/verify-payment`, response, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            if (!verified.data.success) throw new Error('Payment could not be verified')
            dispatch(setCart({ items: [], totalPrice: 0 }))
            toast.success('Payment confirmed')
            navigate('/order-success')
          } catch (error) {
            toast.error(error.response?.data?.message || 'Payment verification failed. Contact support if you were charged.')
          } finally {
            setPaying(false)
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      })
      payment.on('payment.failed', () => {
        setPaying(false)
        toast.error('Payment was not completed. You can try again.')
      })
      payment.open()
    } catch (error) {
      setPaying(false)
      toast.error(error.response?.data?.message || error.message || 'Unable to start checkout')
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-4 pb-16 pt-28 sm:px-6 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        <button onClick={() => navigate('/cart')} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#173b5c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
          <ArrowLeft size={16} /> Back to cart
        </button>
        <div className="mb-8"><p className="mb-2 font-mono-label text-[#426a8c]">Secure checkout</p><h1 className="font-display text-4xl font-semibold tracking-[-.04em] text-slate-950 sm:text-5xl">Delivery &amp; payment</h1><p className="mt-3 text-sm text-slate-600 sm:text-base">Confirm the delivery details for your order.</p><div className="mt-6 flex max-w-md items-center gap-3"><span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#173b5c] px-4 text-xs font-semibold text-white"><span className="grid h-5 w-5 place-items-center rounded-full bg-white/20">1</span> Delivery</span><span className="h-px flex-1 bg-slate-300"></span><span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/80 bg-white/55 px-4 text-xs font-semibold text-slate-600"><span className="grid h-5 w-5 place-items-center rounded-full bg-slate-200">2</span> Payment</span></div></div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          <section className="glass-surface rounded-2xl p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-[#173b5c]"><MapPin size={19} /></span>
              <div><h2 className="text-lg font-semibold text-slate-900">Delivery details</h2><p className="text-sm text-slate-500">Your address is used only to fulfill this order.</p></div>
            </div>
            {showForm ? (
              <form onSubmit={saveAddress} className="grid gap-4 sm:grid-cols-2">
                {[
                  ['fullName', 'Full name', 'text', 'Name for delivery'], ['phone', 'Phone number', 'tel', 'Include country code'],
                  ['email', 'Email address', 'email', 'Email for order updates'], ['address', 'Street address', 'text', 'Building, street, area'],
                  ['city', 'City', 'text', 'Enter city'], ['state', 'State', 'text', 'Enter state or region'],
                  ['zipCode', 'Postal code', 'text', 'Postal code'], ['country', 'Country', 'text', 'Country'],
                ].map(([name, label, type, placeholder]) => (
                  <label key={name} className={`grid gap-1.5 text-sm font-medium text-slate-700 ${name === 'address' ? 'sm:col-span-2' : ''}`}>
                    {label}
                    <input required type={type} name={name} autoComplete={name === 'address' ? 'street-address' : name} placeholder={placeholder} value={formData[name]} onChange={(event) => setFormData({ ...formData, [name]: event.target.value })} className="glass-input min-h-12 rounded-xl px-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#426a8c]" />
                  </label>
                ))}
                <button type="submit" className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#173b5c] px-5 font-semibold text-white transition hover:bg-[#102c47] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173b5c] sm:col-span-2"><Check size={17} /> Save delivery address</button>
              </form>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">Saved addresses</h3>
                {addresses.map((address, index) => (
                  <label key={`${address.email}-${index}`} className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${selectedAddress === index ? 'border-[#426a8c] bg-sky-50/50 ring-2 ring-sky-100' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="delivery-address" checked={selectedAddress === index} onChange={() => dispatch(setSelectedAddress(index))} className="mt-1 accent-[#173b5c]" />
                    <span className="text-sm leading-6 text-slate-700"><strong className="block text-slate-950">{address.fullName}</strong>{address.address}, {address.city}, {address.state} {address.zipCode}<br />{address.country} · {address.phone}<br />{address.email}</span>
                  </label>
                ))}
                <button onClick={() => setShowForm(true)} className="text-sm font-semibold text-[#173b5c] hover:text-[#102c47]">+ Add another address</button>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5"><LockKeyhole size={14} /> Secure payment</span>
              <span className="inline-flex items-center gap-1.5"><Truck size={15} /> Tracked delivery</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} /> Protected checkout</span>
            </div>
          </section>
          <aside className="glass-surface-strong rounded-2xl p-5 shadow-xl sm:p-6 lg:sticky lg:top-28">
            <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700"><PackageCheck size={19} /></span><div><h2 className="font-semibold text-slate-950">Order summary</h2><p className="text-sm text-slate-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p></div></div>
            <div className="mb-5 max-h-56 space-y-3 overflow-auto">
              {items.map((item) => <div key={item.productId?._id || item.productId} className="flex justify-between gap-4 text-sm"><span className="min-w-0 text-slate-600">{item.productId?.productName || 'Product'} <span className="text-slate-400">× {item.quantity}</span></span><span className="shrink-0 font-medium text-slate-800">{money((item.productId?.productPrice || item.price) * item.quantity)}</span></div>)}
              {!items.length && <p className="text-sm text-slate-500">Your cart is empty.</p>}
            </div>
            <div className="space-y-3 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Shipping</span><span>{shipping ? money(shipping) : 'Free'}</span></div>
              <div className="flex justify-between text-slate-600"><span>Estimated tax</span><span>{money(tax)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-950"><span>Total estimate</span><span>{money(previewTotal)}</span></div>
            </div>
            <button disabled={!selected || !items.length || paying} onClick={startPayment} className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-[#173b5c] px-4 font-semibold text-white transition hover:bg-[#102c47] disabled:cursor-not-allowed disabled:bg-slate-300">{paying ? 'Connecting to payment…' : 'Place order'}</button>
            <p className="mt-3 text-center text-xs leading-5 text-slate-500">Final pricing is confirmed securely when your order is created.</p>
          </aside>
        </div>
      </div>
    </main>
  )
}
