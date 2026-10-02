import { API_BASE_URL } from '@/lib/apiBase'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, CreditCard, PackageSearch, ShieldCheck } from 'lucide-react'
import Hero from '@/components/ui/Hero'
import ShopByCategory from '@/components/ui/ShopByCategory'
import ProductCard from '@/components/ui/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

const SectionTitle = ({ eyebrow, title, description, action }) => (
  <div className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-9">
    <div><p className="font-mono-label mb-2 text-[#173b5c]">{eyebrow}</p><h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>{description && <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>}</div>
    {action}
  </div>
)

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const loadProducts = useCallback(async () => {
    setLoading(true); setError(false)
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/v1/product/getallproducts`)
      if (!data.success || !Array.isArray(data.products)) throw new Error('Catalog unavailable')
      setProducts(data.products)
    } catch { setError(true) } finally { setLoading(false) }
  }, [])
  useEffect(() => { void loadProducts() }, [loadProducts])
  const featureProduct = products.find((item) => item.productImg?.[0]?.url)

  return <>
    <Hero />
    <section className="relative z-10 mx-auto -mt-7 max-w-[1240px] px-4 sm:-mt-9 sm:px-6">
      <div className="glass-surface-strong grid grid-cols-1 divide-y divide-slate-200/70 rounded-[1.5rem] p-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:rounded-[1.75rem] sm:p-3">
        {[{ icon: <PackageSearch size={20} />, title: 'Live catalog', detail: 'Products listed in E-Kart' }, { icon: <ShieldCheck size={20} />, title: 'Verified payment', detail: 'Payment is checked before confirmation' }, { icon: <BadgeCheck size={20} />, title: 'Order history', detail: 'Review orders from your account' }].map(({ icon, title, detail }) => <div key={title} className="flex items-center gap-4 px-4 py-4 sm:px-6"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e8f0f6] text-[#173b5c]">{icon}</span><span><strong className="block text-sm font-semibold text-slate-900">{title}</strong><span className="mt-0.5 block text-xs leading-5 text-slate-500">{detail}</span></span></div>)}
      </div>
    </section>

    <section className="px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-20">
      <div className="mx-auto max-w-[1240px]">
        <SectionTitle eyebrow="From the E-Kart catalog" title="Featured products" description="A closer look at products currently available in the catalog." action={<Link to="/products" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#173b5c] transition hover:bg-white/70">Browse all <ArrowRight size={16} /></Link>} />
        {error ? <div className="glass-surface rounded-2xl px-6 py-12 text-center"><p className="font-semibold text-slate-900">We couldn’t load the catalog.</p><button onClick={() => void loadProducts()} className="mt-4 rounded-full bg-[#173b5c] px-5 py-2.5 text-sm font-semibold text-white">Retry</button></div>
          : loading ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-surface overflow-hidden rounded-3xl"><Skeleton className="aspect-square w-full rounded-none" /><div className="space-y-3 p-4"><Skeleton className="h-4 w-20" /><Skeleton className="h-5 w-4/5" /><Skeleton className="h-10 w-full" /></div></div>)}</div>
            : products.length ? <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">{products.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />)}</div>
              : <div className="glass-surface rounded-2xl px-6 py-12 text-center"><PackageSearch className="mx-auto mb-3 text-slate-400" /><p className="font-semibold text-slate-900">No products are listed yet.</p></div>}
      </div>
    </section>

    <ShopByCategory products={products} loading={loading} />


    {featureProduct && <section className="px-4 py-12 sm:px-6 sm:py-16"><div className="mx-auto max-w-[1240px]"><div className="relative isolate grid overflow-hidden rounded-[2rem] bg-[#112a42] text-white shadow-[0_28px_70px_rgba(20,44,67,.2)] md:min-h-[400px] md:grid-cols-[1fr_1fr]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_72%_45%,rgba(117,165,201,.35),transparent_36%),linear-gradient(110deg,#10243a,#1c405e)]" />
      <div className="flex flex-col justify-center p-7 sm:p-11 lg:p-14"><p className="font-mono-label text-sky-200">A closer look</p><h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{featureProduct.productName}</h2><p className="mt-4 line-clamp-3 max-w-md text-sm leading-6 text-slate-200">{featureProduct.productDesc}</p><div className="mt-6 flex flex-wrap items-center gap-4"><span className="text-2xl font-semibold">₹{Number(featureProduct.productPrice || 0).toLocaleString('en-IN')}</span><Link to={`/products/${featureProduct._id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#173b5c] transition hover:-translate-y-0.5">View product <ArrowRight size={16} /></Link></div></div>
      <Link to={`/products/${featureProduct._id}`} aria-label={`View ${featureProduct.productName}`} className="relative flex min-h-[260px] items-center justify-center p-7 md:min-h-full"><div className="absolute inset-8 rounded-[2rem] border border-white/15 bg-white/[.08] backdrop-blur-sm" /><img src={featureProduct.productImg[0].url} alt={featureProduct.productName} loading="lazy" className="relative max-h-[340px] w-full object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,.32)] transition-transform duration-500 hover:scale-[1.035]" /></Link>
    </div></div></section>}

    <section className="px-4 pb-16 pt-7 sm:px-6 sm:pb-24"><div className="mx-auto max-w-[1240px]"><SectionTitle eyebrow="Shopping with clarity" title="Why E-Kart" description="Product details and order information stay connected to the E-Kart catalog and your account." /><div className="grid gap-4 md:grid-cols-3">{[{ icon: <PackageSearch size={19} />, title: 'One connected catalog', text: 'Browse the products currently listed in the store.' }, { icon: <CreditCard size={19} />, title: 'Checkout with confidence', text: 'Order totals are calculated and confirmed by the checkout service.' }, { icon: <ShieldCheck size={19} />, title: 'Order records', text: 'Return to your account to review submitted orders.' }].map(({ icon, title, text }) => <div key={title} className="glass-surface rounded-2xl p-5 sm:p-7"><span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-white/75 text-[#173b5c] shadow-sm">{icon}</span><h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></div></section>
  </>
}
export default Home
