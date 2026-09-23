import React, { useEffect, useState } from 'react'
import { OrderCard } from '@/components/ui/OrderCard'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const ShowUserOrders = () => {
  const params = useParams()
  const [userOrder, setUserOrder] = useState([])
  const [loading, setLoading] = useState(true)

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/user-order/${params.userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        setUserOrder(res.data.orders)
      } else {
        setUserOrder([])
      }
    } catch (error) {
      console.error("Error fetching user orders:", error)
      setUserOrder([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.userId) {
      getUserOrders()
    }
  }, [params.userId])

  return (
    <div className='w-full p-6'>
      <OrderCard userOrder={userOrder} loading={loading} title="User Orders" />
    </div>
  )
}

export default ShowUserOrders