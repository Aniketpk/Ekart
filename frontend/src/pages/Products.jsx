import { API_BASE_URL } from '@/lib/apiBase'
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterSidebar from '../components/ui/FilterSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '../redux/productsSlice'
import ProductCard from '../components/ui/ProductCard'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios'
import Footer from '../components/ui/Footer'
import { ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react'

const ITEMS_PER_PAGE = 12

const Products = () => {
    const [searchParams] = useSearchParams()
    const { products } = useSelector(store => store.products)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadError, setLoadError] = useState(false)
    const [search, setSearch] = useState(searchParams.get('search') || "")
    const [category, setCategory] = useState(searchParams.get('category') || "All")
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [sortOrder, setSortOrder] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const dispatch = useDispatch()

    const getAllProducts = useCallback(async () => {
        try {
            setLoading(true)
            setLoadError(false)
            const response = await axios.get(`${API_BASE_URL}/api/v1/product/getallproducts`)
            if (response.data.success) {
                setAllProducts(response.data.products)
                dispatch(setProducts(response.data.products))
            }
        } catch (error) {
            console.log(error);
            setLoadError(true)

        } finally {
            setLoading(false)
        }
    }, [dispatch])
    useEffect(() => {
        getAllProducts()
    }, [getAllProducts])

    useEffect(() => {
        if (allProducts.length === 0) return
        let filtered = [...allProducts]
        if (search.trim() !== "") {
            filtered = filtered.filter((p) => p.productName?.toLowerCase().includes(search.toLowerCase()))
        }
        if (category !== "All") {
            filtered = filtered.filter((p) => p.category === category)
        }
        if (brand !== "All") {
            filtered = filtered.filter((p) => p.brand === brand)
        }

        filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

        if (sortOrder === "lowTohigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        }
        else if (sortOrder === "highTolow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }
        dispatch(setProducts(filtered))
        setCurrentPage(1) // Reset to page 1 on filter change
    }, [search, category, brand, priceRange, allProducts, sortOrder, dispatch])

    // Sync URL query params to state (for homepage category card navigation)
    useEffect(() => {
        const urlCategory = searchParams.get('category')
        const urlSearch = searchParams.get('search')
        if (urlCategory) setCategory(urlCategory)
        if (urlSearch) setSearch(urlSearch)
    }, [searchParams])

    // Pagination logic
    const totalProducts = products.length
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const getPageNumbers = () => {
        const pages = []
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (currentPage > 3) pages.push('...')
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i)
            }
            if (currentPage < totalPages - 2) pages.push('...')
            pages.push(totalPages)
        }
        return pages
    }

    const categories = [...new Set(allProducts.map((item) => item.category).filter(Boolean))]

    return (
        <>
        <main className="min-h-screen bg-transparent pb-16 pt-28 sm:pt-32">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
            <div className="mb-7 sm:mb-10">
              <p className="font-mono-label mb-2 text-[#173b5c]">The E-Kart collection</p>
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div><h1 className="font-display text-4xl font-semibold tracking-[-.04em] text-slate-950 sm:text-5xl">Find your next essential.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">Explore products listed in the E-Kart catalog and narrow the collection to what you need.</p></div>
                <span className="text-sm text-slate-500">{totalProducts} {totalProducts === 1 ? 'product' : 'products'} listed</span>
              </div>
            </div>

            <div className="glass-surface-strong mb-7 rounded-[1.5rem] p-3 sm:p-4">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <label className="glass-control flex min-h-12 items-center gap-3 rounded-full px-4 text-slate-500"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search products" placeholder="Search by product name" value={search} onChange={(event) => setSearch(event.target.value)} className="!w-full !border-0 !bg-transparent !p-0 text-sm !shadow-none outline-none placeholder:text-slate-500" /></label>
                <div className="flex items-center gap-2"><span className="hidden text-xs font-medium uppercase tracking-wider text-slate-500 sm:block">Sort</span><Select value={sortOrder || 'featured'} onValueChange={(value) => setSortOrder(value === 'featured' ? '' : value)}><SelectTrigger className="glass-control h-12 w-full rounded-full border-white/80 bg-white/55 px-4 text-sm sm:w-[190px]"><SelectValue placeholder="Featured" /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="featured">Featured</SelectItem><SelectItem value="lowTohigh">Price: Low to High</SelectItem><SelectItem value="highTolow">Price: High to Low</SelectItem></SelectGroup></SelectContent></Select></div>
              </div>
              <div id="catalog-categories" className="mt-3 flex scroll-mt-28 items-center gap-2 overflow-x-auto pb-1" aria-label="Filter by category">
                {[['All', 'All products'], ...categories.map((name) => [name, name])].map(([value, label]) => <button key={value} type="button" onClick={() => setCategory(value)} aria-pressed={category === value} className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-semibold transition ${category === value ? 'border-[#173b5c] bg-[#173b5c] text-white shadow-md' : 'glass-control text-slate-600 hover:text-[#173b5c]'}`}>{label}</button>)}
                <details className="relative ml-auto shrink-0">
                  <summary className="glass-control flex min-h-10 cursor-pointer list-none items-center rounded-full px-4 text-xs font-semibold text-slate-700">More filters</summary>
                  <div className="glass-surface-strong absolute right-0 top-12 z-20 w-[min(86vw,360px)] rounded-2xl p-4 shadow-2xl sm:p-5"><FilterSidebar className="grid gap-4" search={search} setSearch={setSearch} category={category} setCategory={setCategory} brand={brand} setBrand={setBrand} allProducts={allProducts} priceRange={priceRange} setPriceRange={setPriceRange} /></div>
                </details>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm text-slate-600">Showing <strong className="text-slate-900">{paginatedProducts.length}</strong> of {totalProducts}</p>{(category !== 'All' || brand !== 'All' || search || priceRange[0] > 0 || priceRange[1] < 999999) && <button onClick={() => { setSearch(''); setCategory('All'); setBrand('All'); setPriceRange([0, 999999]) }} className="text-xs font-semibold text-[#173b5c] hover:underline">Clear filters</button>}</div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? Array.from({ length: 8 }).map((_, index) => <ProductCard key={`skeleton-${index}`} loading />)
                : loadError ? <div className="glass-surface col-span-full rounded-2xl px-6 py-16 text-center"><p className="font-semibold text-slate-900">The catalog could not be loaded.</p><p className="mt-1 text-sm text-slate-600">Check the connection and try again.</p><button onClick={() => void getAllProducts()} className="mt-5 rounded-full bg-[#173b5c] px-5 py-2.5 text-sm font-semibold text-white">Retry</button></div>
                : paginatedProducts.length ? paginatedProducts.map((product) => <ProductCard key={product._id} product={product} />)
                : <div className="glass-surface col-span-full rounded-2xl border-dashed px-6 py-16 text-center"><PackageSearch className="mx-auto mb-3 text-slate-400"/><p className="font-semibold text-slate-900">No products match those filters.</p><p className="mt-1 text-sm text-slate-600">Try another category or search term.</p><button onClick={() => { setSearch(''); setCategory('All'); setBrand('All'); setPriceRange([0, 999999]) }} className="mt-4 text-sm font-semibold text-[#173b5c]">Clear filters</button></div>}
            </div>
            {totalPages > 1 && <nav aria-label="Product pages" className="glass-surface mx-auto mt-10 flex w-fit items-center gap-1 rounded-full p-1.5"><button type="button" aria-label="Previous page" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="grid h-9 w-9 place-items-center rounded-full text-slate-600 hover:bg-white/80 disabled:opacity-35"><ChevronLeft size={17}/></button>{getPageNumbers().map((page,index)=>page === '...' ? <span key={`dots-${index}`} className="px-2 text-slate-400">…</span> : <button type="button" key={page} onClick={() => setCurrentPage(page)} aria-current={currentPage === page ? 'page' : undefined} className={`h-9 min-w-9 rounded-full px-2 text-sm font-semibold ${currentPage === page ? 'bg-[#173b5c] text-white' : 'text-slate-600 hover:bg-white/80'}`}>{page}</button>)}<button type="button" aria-label="Next page" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="grid h-9 w-9 place-items-center rounded-full text-slate-600 hover:bg-white/80 disabled:opacity-35"><ChevronRight size={17}/></button></nav>}
          </div>
        </main>
        <Footer />
        </>
    )
}

export default Products
