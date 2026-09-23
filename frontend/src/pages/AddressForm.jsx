import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAddress, setSelectedAddress, deleteAddress, setCart } from '../redux/productsSlice'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'



const AddressForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",

    })
    const { cart, addresses, selectedAddress } = useSelector((store) => store.products)
    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSave = () => {
        dispatch(addAddress(formData))
        toast.success("Address saved successfully")
        setShowForm(false)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const subtotal = Number(cart?.totalPrice) || 0
    const shipping = subtotal > 299 ? 0 : 10;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + shipping + tax).toFixed(2));

    console.log(cart)

    const handlePayment = async () => {
        const accessToken = localStorage.getItem("accessToken")
        const viteUrl = (import.meta.env.VITE_URL || "").trim();
        const razorpayKeyId = (import.meta.env.VITE_RAZORPAY_KEY_ID || "").trim();
        try {
            const { data } = await axios.post(`${viteUrl}/api/v1/order/create-order`, {
                products: cart?.items?.map(item => ({
                    productId: item.productId?._id || item.productId,
                    quantity: item.quantity
                })).filter(item => item.productId),
                tax,
                shipping,
                amount: total,
                currency: "INR"
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (!data.success && !data.sucess) return toast.error("Something went wrong ")
            console.log("razorpay data :", data)
            const options = {
                key: razorpayKeyId,
                amount: data.order.amount,
                currency: data.order.currency,
                order_id: data.order.id,
                name: "Ekart",
                description: "order Payment",
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${viteUrl}/api/v1/order/verify-payment`,
                            response, {

                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        })
                        if (verifyRes.data.success || verifyRes.data.sucess) {
                            toast.success("✅ Payment Verified Successfully")
                            dispatch(setCart({ items: [], totalPrice: 0 }))
                            navigate("/order-success")
                        } else {
                            toast.error("❌ Payment Failed")
                        }
                    } catch (error) {
                        console.error(error)
                        toast.error("❌ Payment Verification Failed")
                    }
                },
                modal: {
                    ondismiss: async function () {
                        await axios.post(`${viteUrl}/api/v1/order/verify-payment`,
                            {
                                razorpay_order_id: data.order.id,
                                paymentFailed: true
                            }, {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        })
                        toast.error("❌ Payment Cancelled")
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "rgba(200, 19, 125, 1)212"
                }
            };
            const rzp = new window.Razorpay(options)
            // Listen for errors
            rzp.on("payment.failed", async function (response) {
                await axios.post(`${viteUrl}/api/v1/order/verify-payment`,
                    {
                        razorpay_order_id: data.order.id,
                        paymentFailed: true
                    }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                toast.error("❌ Payment Failed pls try again")

            })

            rzp.open();
        } catch (error) {
            console.log(error)
            toast.error("❌ Something went wrong please try again")
        }
    }
    return (
        <div className='max-w-7xl mx-auto grid place-items-center p-10'>
            <div className='grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto'></div>
            <div className='space-y-4 p-6 bg-white'>
                {
                    showForm ? (
                        <>
                            <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input type="text"
                                    id="fullName"
                                    name="fullName"
                                    required
                                    placeholder="john Doe"
                                    value={formData.fullName}
                                    onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input type="number"
                                    id="phone"
                                    name="phone"
                                    required
                                    placeholder="1234567890"
                                    value={formData.phone}
                                    onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="[EMAIL_ADDRESS]"
                                    value={formData.email}
                                    onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input type="text"
                                    id="address"
                                    name="address"
                                    required
                                    placeholder="123 Main St"
                                    value={formData.address}
                                    onChange={handleChange} />
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input type="text"
                                            id="city"
                                            name="city"
                                            required
                                            placeholder="Mumbai"
                                            value={formData.city}
                                            onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State</Label>
                                        <Input type="text"
                                            id="state"
                                            name="state"
                                            required
                                            placeholder="Maharashtra"
                                            value={formData.state}
                                            onChange={handleChange} />
                                    </div>
                                </div>

                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <div>
                                        <Label htmlFor="zipCode">Zip Code</Label>
                                        <Input type="text"
                                            id="zipCode"
                                            name="zipCode"
                                            required
                                            placeholder="400001"
                                            value={formData.zipCode}
                                            onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input type="text"
                                            id="country"
                                            name="country"
                                            required
                                            placeholder="India"
                                            value={formData.country}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                                <Button onClick={handleSave} className="w-full bg-[#1a237e] hover:bg-[#0d1759] text-white">Save Address</Button>

                            </div>
                        </>
                    ) : (
                        <div className='space-y-4'>
                            <h2 className='text-lg font-semibold'>Saved Addresses</h2>
                            {
                                addresses.map((addr, index) => {
                                    return <div
                                        onClick={() => dispatch(setSelectedAddress(index))} key={index} className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-[#1a237e] bg-[#f5f5f7] shadow-ambient" : " border-[#e0e0e0] hover:shadow-ambient"}`}>
                                        <p className='font-medium'>{addr.fullName}</p>
                                        <p className='text-sm text-gray-600'>{addr.phone}</p>
                                        <p className='text-sm text-gray-600'>{addr.email}</p>
                                        <p className='text-sm text-gray-600'>{addr.address},{addr.city},{addr.state},{addr.zipCode},{addr.country}</p>
                                        <button onClick={() => dispatch(deleteAddress(index))} className="absolute top-4 right-4 text-red-600 hover:text-red-700">Delete</button>
                                    </div>
                                })
                            }
                            <Button onClick={() => setShowForm(true)}
                                variant="outline"
                                className="w-full bg-white hover:bg-[#f5f5f7] border-[#e0e0e0] text-[#121212]">+ Add Address</Button>
                            <Button
                                disabled={selectedAddress === null}
                                onClick={handlePayment}
                                className="w-full bg-[#1a237e] hover:bg-[#0d1759] text-white">Proceed to Checkout</Button>

                        </div>

                    )
                }
            </div>
            {/* Right Side Order Summary */}
            <div>
                <Card className="w-[400px] shadow-ambient border-[#f0edec]">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className='flex justify-between'>
                            <span>Subtotal ({cart.items.length}) items</span>
                            <span>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Shipping</span>
                            <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                                {shipping === 0 ? "Free" : `₹${shipping}`}
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Tax</span>
                            <span>₹{tax}</span>
                        </div>
                        <Separator />
                        <div className='flex justify-between font-bold text-lg'>
                            <span>Total</span>
                            <span className="text-[#1a237e] font-display font-bold">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className='text-sm text-muted-foreground pt-4'>
                            <p>*Free shipping on orders above 299</p>
                            <p>* 30-days return policy</p>
                            <p>* Cash on delivery available</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AddressForm