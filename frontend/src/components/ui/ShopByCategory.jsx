import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, PackageSearch } from 'lucide-react'

const ShopByCategory = ({ products = [], loading = false }) => {
    const navigate = useNavigate()
    const categories = [...new Set(products.map((item) => item.category).filter(Boolean))].slice(0, 3)

    if (!loading && !categories.length) return null

    return (
        <section id="catalog-categories" className="bg-white/35 px-4 py-14 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
                    <div>
                        <p className="font-mono-label mb-2 text-[#173b5c]">Explore the catalog</p>
                        <h2 className="font-display text-3xl font-bold text-[#111827] sm:text-4xl">Shop by category</h2>
                    </div>
                    <button onClick={() => navigate('/products')} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#173b5c] hover:text-[#102c47]">
                        View all <ArrowRight size={16} />
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                    {loading ? Array.from({ length: 3 }).map((_, index) => <div key={index} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />) : categories.map((category) => {
                        const product = products.find((item) => item.category === category && item.productImg?.[0]?.url)
                        return (
                            <button key={category} type="button" onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)} className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/60 bg-slate-200/70 text-left shadow-[0_18px_45px_rgba(20,44,67,.14)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
                                {product?.productImg?.[0]?.url ? <img src={product.productImg[0].url} alt={product.productName || category} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <div className="absolute inset-0 grid place-items-center text-slate-400"><PackageSearch size={40} /></div>}
                                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
                                    <span className="min-w-0"><span className="block text-xs font-semibold uppercase tracking-[.16em] text-white/75">Category</span><span className="mt-1 block truncate font-display text-xl font-bold text-white sm:text-2xl">{category}</span></span>
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-white transition group-hover:bg-white group-hover:text-[#173b5c]"><ArrowRight size={18} /></span>
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default ShopByCategory
