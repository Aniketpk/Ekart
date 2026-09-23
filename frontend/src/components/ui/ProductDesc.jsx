import React from 'react'
import { Input } from './input'
import { Button } from './button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '../../redux/productsSlice'
const ProductDesc = ({ product }) => {
    const dispatch = useDispatch()
    const accessToken = localStorage.getItem('accessToken')
    const addtocart = async (productId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/cart/add`, { productId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                toast.success('product added to cart')
                dispatch(setCart(res.data.cart))
            }
        } catch (error) {
            console.log(error);

        }

    }
    return (
        <div className='flex flex-col gap-4'>
            <h1 className='font-display font-bold text-4xl text-[#121212]'>{product?.productName}</h1>
            <p className='text-[#5c5c6d] font-body text-sm'>{product?.category} | {product?.brand}</p>
            <h2 className='text-[#1a237e] font-display font-bold text-2xl'>₹{product?.productPrice?.toLocaleString('en-IN')}</h2>
            <p className='line-clamp-6 text-muted-foreground'>{product?.productDesc}</p>
            <div className='flex gap-2 items-center w-[300px] mt-2'>
                <p className='text-[#121212] font-semibold'>Quantity :</p>
                <Input type='number' className='w-14 border-[#e0e0e0]' defaultValue={1} />
            </div>
            <Button onClick={() => addtocart(product._id)} className='bg-[#1a237e] hover:bg-[#0d1759] text-white mt-4'>Add to Cart</Button>
        </div>
    )
}

export default ProductDesc