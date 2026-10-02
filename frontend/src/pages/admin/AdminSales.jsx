import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: []
  })

  const fetchStats = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/sales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })
      if (res.data.success) {
        setStats(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchStats() }, 0)
    return () => window.clearTimeout(timer)
  }, [fetchStats])
  return (
    <div className='w-full'>
      <div className='grid gap-6 lg:grid-cols-4 p-6'>
        {/* stats card*/}

        <Card className="glass-surface-strong border-white/80 text-slate-900 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display font-medium text-slate-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="font-display text-3xl font-bold text-[#173b5c]">{stats.totalUsers}</CardContent>
        </Card>
        <Card className="glass-surface-strong border-white/80 text-slate-900 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display font-medium text-slate-500">Total products </CardTitle>
          </CardHeader>
          <CardContent className="font-display text-3xl font-bold text-[#173b5c]">{stats.totalProducts}</CardContent>
        </Card>
        <Card className="glass-surface-strong border-white/80 text-slate-900 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display font-medium text-slate-500">Total orders</CardTitle>
          </CardHeader>
          <CardContent className="font-display text-3xl font-bold text-[#173b5c]">{stats.totalOrders}</CardContent>
        </Card>
        <Card className="glass-surface-strong border-white/80 text-slate-900 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display font-medium text-slate-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="font-display text-3xl font-bold">₹{stats.totalSales?.toLocaleString('en-IN')}</CardContent>
        </Card>
        {/**sales chats */}
        <Card className="lg:col-span-4 shadow-ambient border-[#f0f0f0]">
          <CardHeader>
            <CardTitle className="font-display">Sales Last 30 days</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#5c5c6d' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#5c5c6d' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(26, 35, 126, 0.08)' }}
                  itemStyle={{ color: '#173b5c', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#173b5c" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#173b5c" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#173b5c" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default AdminSales
