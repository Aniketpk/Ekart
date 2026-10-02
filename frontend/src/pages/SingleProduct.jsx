import { API_BASE_URL } from '@/lib/apiBase'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Breadcrums from '../components/ui/Breadcrums'
import ProductImg from '../components/ui/ProductImg'
import ProductDesc from '../components/ui/ProductDesc'

const SingleProduct = () => {
    const params = useParams()
    const productId = params.id
    const { products } = useSelector(store => store.products)
    const storeProduct = products.find((item) => item._id === productId) || null
    const [productResult, setProductResult] = useState({ productId: null, status: 'loading', product: null })
    const hasResult = productResult.productId === productId
    const loadedProduct = hasResult ? productResult.product : null
    const product = storeProduct || loadedProduct
    const loading = !storeProduct && (!hasResult || productResult.status === 'loading')
    const loadError = !storeProduct && hasResult && productResult.status === 'error'
    useEffect(() => {
        if (storeProduct) return undefined
        let active = true
        axios.get(`${API_BASE_URL}/api/v1/product/getallproducts`)
            .then(({ data }) => {
                if (!data.success || !Array.isArray(data.products)) throw new Error('Catalog unavailable')
                if (active) {
                    setProductResult({ productId, status: 'loaded', product: data.products.find((item) => item._id === productId) || null })
                }
            })
            .catch(() => { if (active) setProductResult({ productId, status: 'error', product: null }) })
        return () => { active = false }
    }, [productId, storeProduct])

    if (loading) return <main className="grid min-h-[60vh] place-items-center px-4 pt-24"><p role="status" className="text-sm text-slate-600">Loading product…</p></main>
    if (loadError || !product) return <main className="grid min-h-[60vh] place-items-center px-4 pt-24"><div className="max-w-md glass-surface-strong rounded-2xl p-8 text-center"><h1 className="text-xl font-bold text-slate-900">{loadError ? 'Product details are unavailable.' : 'Product not found.'}</h1><p className="mt-2 text-sm text-slate-600">Return to the catalog to explore available products.</p><Link to="/products" className="mt-5 inline-flex rounded-xl bg-[#173b5c] px-5 py-2.5 text-sm font-semibold text-white">Browse products</Link></div></main>
    return (
        <main className="relative mx-auto min-h-[75vh] max-w-[1320px] px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
          <div className="absolute inset-x-0 top-24 -z-10 mx-auto h-[min(75vw,760px)] max-w-6xl rounded-full bg-[radial-gradient(ellipse,rgba(204,222,237,.46),rgba(242,245,248,0)_66%)]" />
          <Breadcrums product={product} />
          <div className="mt-6 grid items-center gap-6 lg:mt-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,.8fr)] lg:gap-10">
            <div className="relative rounded-[2rem] border border-white/70 bg-white/32 p-3 sm:p-6 lg:p-8"><div className="pointer-events-none absolute inset-8 rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_50%,rgba(214,229,240,.58),transparent_68%)]"/><div className="relative"><ProductImg image={product.productImg} productName={product.productName} /></div></div>
            <ProductDesc product={product} />
          </div>
        </main>
    )
}

export default SingleProduct
