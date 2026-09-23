import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Breadcrums from '../components/ui/Breadcrums'
import ProductImg from '../components/ui/ProductImg'
import ProductDesc from '../components/ui/ProductDesc'

const SingleProduct = () => {
    const params = useParams()
    const productId = params.id
    const { products } = useSelector(store => store.products)
    const product = products.find((item) => item._id === productId)
    return (
        <div className='pt-25 py-10 max-w-7xl mx-auto'>
            <Breadcrums product={product} />
            <div className='mt-10 grid grid-cols-2 items-start'>
                <ProductImg image={product.productImg} />
                <ProductDesc product={product} />
            </div>
        </div>
    )
}

export default SingleProduct