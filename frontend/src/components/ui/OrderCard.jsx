import React from 'react'
import { Button } from './button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const OrderCard = ({ userOrder, loading, title = "My Orders" }) => {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col gap-3 w-full'>
            <div className='w-full'>
                <div className='flex items-center gap-4 mb-8'>
                    <h1 className='text-2xl font-display font-bold text-[#121212]'>{title}</h1>
                </div>
                {
                    loading ? (
                        <p className='text-gray-800 space-y-6 text-2xl'>Loading orders...</p>
                    ) : userOrder?.length === 0 ? (
                        <p className='text-gray-800 space-y-6 text-2xl'> No Order found for this user</p>
                    ) : (
                        <div className='space-y-6 w-full'>
                            {
                                userOrder?.map((order) => (
                                    <div key={order._id} className='shadow-ambient rounded-lg p-6 border border-[#f0f0f0] bg-white' >
                                        <div className='flex justify-between items-center mb-6 border-b border-[#f0f0f0] pb-4'>
                                            <h2 className='text-lg font-display font-bold text-[#121212]'>
                                                Order ID:{" "}
                                                <span className='font-mono-label text-[#5c5c6d] text-base font-normal'>{order._id}</span>
                                            </h2>
                                            <div className='flex items-center gap-6'>
                                                <span className={`px-2.5 py-1 rounded text-xs font-semibold ${order.status === "Paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : order.status === "Failed" ? "bg-red-50 text-red-700 border border-red-100" : order.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-gray-100 text-[#5c5c6d]"}`}>
                                                    {order.status}
                                                </span>
                                                <p className='text-sm text-[#5c5c6d] font-body'>
                                                    Amount:
                                                    <span className='font-display font-bold text-[#1a237e] ml-2 text-base'>
                                                        {order.currency} {order.amount?.toFixed(2)}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Items List */}
                                        <div className='space-y-4'>
                                            {order.products?.map((item, idx) => (
                                                <div key={idx} className='flex items-center gap-4'>
                                                    <img
                                                        onClick={() => navigate(`/products/${item.productId?._id}`)}
                                                        src={item.productId?.productImg?.[0]?.url || ""}
                                                        alt={item.productId?.productName}
                                                        className='w-16 h-16 object-cover rounded bg-[#f5f5f7] cursor-pointer hover:opacity-80 transition-opacity border border-[#f0f0f0]'
                                                    />
                                                    <div className='flex-1'>
                                                        <h3
                                                            onClick={() => navigate(`/products/${item.productId?._id}`)}
                                                            className='font-display font-semibold text-[#121212] cursor-pointer hover:text-[#1a237e] transition-colors'
                                                        >
                                                            {item.productId?.productName}
                                                        </h3>
                                                        <p className='text-sm font-body text-[#5c5c6d] mt-1'>Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className='font-display font-bold text-[#121212]'>₹{item.productId?.productPrice}</p>
                                                </div>

                                            ))}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}
