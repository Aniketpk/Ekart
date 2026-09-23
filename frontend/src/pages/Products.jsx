import React, { useEffect, useState } from 'react'
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
import { toast } from 'sonner'
import axios from 'axios'
import Footer from '../components/ui/Footer'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ITEMS_PER_PAGE = 12

const Products = () => {
    const [searchParams] = useSearchParams()
    const { products } = useSelector(store => store.products)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState(searchParams.get('search') || "")
    const [category, setCategory] = useState(searchParams.get('category') || "All")
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [sortOrder, setSortOrder] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const dispatch = useDispatch()

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/product/getallproducts`)
            if (response.data.success) {
                setAllProducts(response.data.products)
                dispatch(setProducts(response.data.products))
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch products")

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllProducts()
    }, [])

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

    return (
        <>
        <div className='pt-24 pb-12 bg-[#f5f5f7] min-h-screen'>
            <div className='max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row gap-8'>
                {/* Filter Sidebar */}
                <FilterSidebar
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                    brand={brand}
                    setBrand={setBrand}
                    allProducts={allProducts}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange} />
                {/* Products */}
                <div className='flex flex-col flex-1'>
                    {/* Header: count + sort */}
                    <div className='flex items-center justify-between mb-6'>
                        <p className='text-sm font-body text-[#5c5c6d]'>
                            Showing <span className='font-semibold text-[#121212]'>{paginatedProducts.length}</span> of <span className='font-semibold text-[#121212]'>{totalProducts}</span> products
                        </p>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm text-[#5c5c6d] font-body hidden sm:inline'>Sort by</span>
                            <Select onValueChange={(value) => setSortOrder(value)}>
                                <SelectTrigger className="w-[160px] bg-white border-[#e0e0e0] focus:ring-[#1a237e] text-sm">
                                    <SelectValue placeholder="Featured" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="lowTohigh">Price: Low to High</SelectItem>
                                        <SelectItem value="highTolow">Price: High to Low</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Products Grid — 3 columns */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            loading ? (
                                Array.from({ length: 6 }).map((_, idx) => (
                                    <ProductCard key={`skeleton-${idx}`} loading={true} />
                                ))
                            ) : paginatedProducts.length > 0 ? (
                                paginatedProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} loading={false} />
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center text-gray-500 font-body">
                                    No products found.
                                </div>
                            )
                        }
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className='flex items-center justify-center gap-1.5 mt-10'>
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className='w-9 h-9 flex items-center justify-center rounded border border-[#e0e0e0] bg-white text-[#5c5c6d] hover:bg-[#f5f5f7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                            >
                                <ChevronLeft className='w-4 h-4' />
                            </button>
                            {getPageNumbers().map((page, i) => (
                                page === '...' ? (
                                    <span key={`dots-${i}`} className='w-9 h-9 flex items-center justify-center text-sm text-[#5c5c6d]'>…</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                                            currentPage === page
                                                ? 'bg-[#1a237e] text-white'
                                                : 'border border-[#e0e0e0] bg-white text-[#121212] hover:bg-[#f5f5f7]'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className='w-9 h-9 flex items-center justify-center rounded border border-[#e0e0e0] bg-white text-[#5c5c6d] hover:bg-[#f5f5f7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                            >
                                <ChevronRight className='w-4 h-4' />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
        <Footer />
        </>
    )
}

export default Products