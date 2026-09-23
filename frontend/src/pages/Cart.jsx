import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import axios from 'axios'
import { setCart } from '../redux/productsSlice'
import { toast } from 'sonner'

const Cart = () => {
    const { cart } = useSelector((store) => store.products)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const accessToken = localStorage.getItem('accessToken')

    const handleUpdateQuantity = async (productId, type) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/cart/update`, { productId, type }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setCart(res.data.cart))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const loadCart = async ()=>{
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/cart/`,{
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            })
            if (res.data.success){
                dispatch(setCart(res.data.cart)) 
            }
        } catch (error) {
          console.log(error);  
        }
    }

    const handleRemove = async (productId) => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/cart/remove`, {
                data: { productId },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setCart(res.data.cart))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    useEffect(()=>{
        loadCart();
    },[dispatch])

    const subtotal = cart?.totalPrice || 0
    const shipping = subtotal > 299 ? 0 : 10
    const tax = subtotal * 0.05 // 5% tax
    const total = subtotal + shipping + tax

    return (
        <div className='pt-28 bg-[#fcf9f8] min-h-screen'>
            {
                cart?.items?.length > 0 ? (
                    <div className='max-w-7xl mx-auto px-4'>
                        <h1 className='text-2xl font-bold text-gray-800 mb-8'>Shopping Cart</h1>
                        <div className='flex flex-col lg:flex-row gap-8'>
                            <div className='flex flex-col gap-6 flex-1'>
                                {cart?.items?.map((product, index) => {
                                    return (
                                        <Card key={index} className="overflow-hidden shadow-ambient border-[#f0edec]">
                                            <div className='flex flex-col sm:flex-row justify-between items-center p-4 gap-4'>
                                                <div className='flex items-center gap-4 w-full sm:w-auto'>
                                                    <img
                                                        src={product?.productId?.productImg?.[0]?.url || ""}
                                                        alt={product?.productId?.productName}
                                                        className='w-24 h-24 object-cover rounded-md'
                                                    />
                                                    <div className='flex-1'>
                                                        <h1 className='text-lg font-semibold text-gray-800 line-clamp-1'>{product?.productId?.productName}</h1>
                                                        <p className="text-[#1a237e] font-medium font-display">₹{product?.productId?.productPrice}</p>
                                                    </div>
                                                </div>

                                                <div className='flex gap-4 items-center'>
                                                    <div className='flex items-center border border-[#e0e0e0] rounded-md'>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleUpdateQuantity(product?.productId?._id, 'decrease')}
                                                            disabled={product.quantity <= 1}
                                                        >
                                                            -
                                                        </Button>
                                                        <span className='w-8 text-center'>{product?.quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleUpdateQuantity(product?.productId?._id, 'increase')}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </div>

                                                <p className="font-semibold text-gray-800 w-24 text-center">
                                                    ₹{(product?.productId?.productPrice) * (product?.quantity)}
                                                </p>

                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleRemove(product?.productId?._id)}
                                                    className='text-red-500 hover:text-red-600 hover:bg-red-50 gap-1'
                                                >
                                                    <Trash2 className='w-4 h-4' />
                                                    <span className="hidden sm:inline">Remove</span>
                                                </Button>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>

                            <div className='w-full lg:w-[400px]'>
                                <Card className="shadow-ambient border-[#f0edec]">
                                    <CardHeader>
                                        <CardTitle>Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                        <div className='flex justify-between' >
                                            <span>Subtotal ({cart?.items?.length} items)</span>
                                            <span>₹{cart?.totalPrice.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Shipping</span>
                                            <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                                                {shipping === 0 ? "Free" : `₹${shipping}`}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Tax (5%)</span>
                                            <span>₹{tax.toFixed(2)}</span>
                                        </div>
                                        <Separator />
                                        <div className='flex justify-between font-bold text-lg'>
                                            <span>Total</span>
                                            <span className="text-[#1a237e] font-display font-bold">₹{total.toFixed(2)}</span>
                                        </div>
                                        <div className='space-y-3 pt-4'>
                                            <div className='flex space-x-2'>
                                                <Input placeholder='Promo code' className="bg-white" />
                                                <Button variant="outline">Apply</Button>
                                            </div>
                                            <Button onClick={() => navigate('/address')} className='w-full bg-[#1a237e] text-white hover:bg-[#0d1759] h-11'>
                                                Place Order
                                            </Button>
                                            <Link to="/products" className="block">
                                                <Button variant="outline" className="w-full">
                                                    Continue Shopping
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className='text-xs text-muted-foreground pt-4 space-y-1'>
                                            <p>• Free shipping on orders above ₹299</p>
                                            <p>• 10-days return policy</p>
                                            <p>• Secure Checkout with SSL encryption</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-24 text-center px-4'>
                        <div className="bg-[#f5f5f7] p-6 rounded-full mb-6 border border-[#e0e0e0]">
                            <Trash2 className="w-12 h-12 text-[#5c5c6d]" />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Check out our latest products!</p>
                        <Link to="/products">
                            <Button className="bg-[#1a237e] hover:bg-[#0d1759] text-white px-8 py-6 text-lg rounded-full shadow-sm hover:shadow-ambient">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

export default Cart
