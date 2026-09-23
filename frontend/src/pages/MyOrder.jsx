
import { OrderCard } from '@/components/ui/OrderCard'
import axios from 'axios'

import React, { useEffect, useState } from 'react'


const MyOrder = () => {
  
    const [userOrder,setUserOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    const getUserOrders = async () => {
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
            setUserOrder([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        getUserOrders()
    },[])

    return (
      <div className="max-w-7xl mx-auto p-6 mt-20 w-full min-h-[calc(100vh-200px)]">
        <OrderCard userOrder={userOrder} loading={loading} />
      </div>
    )
}

export default MyOrder
