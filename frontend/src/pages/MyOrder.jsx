
import { OrderCard } from '@/components/ui/OrderCard'
import axios from 'axios'

import React, { useCallback, useEffect, useState } from 'react'


const MyOrder = () => {
  
    const [userOrder,setUserOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)

    const getUserOrders = useCallback(async () => {
        setLoading(true)
        setLoadError(false)
        try {
            const accessToken = localStorage.getItem('accessToken') 
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/myorder`,{
                headers:{Authorization: `Bearer ${accessToken}`}
            })
            if(res.data.success){
                setUserOrder(res.data.orders)
            } else {
                setUserOrder([])
            }
        } catch (error) {
            console.error(error)
            setLoadError(true)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(()=>{
        void getUserOrders()
    },[getUserOrders])

    return (
      <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <OrderCard userOrder={userOrder} loading={loading} error={loadError} />
        {loadError && <div className="-mt-5 flex justify-center"><button onClick={() => void getUserOrders()} className="rounded-xl bg-[#173b5c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#102c47]">Retry</button></div>}
      </div>
    )
}

export default MyOrder
