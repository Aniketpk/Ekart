import { API_BASE_URL } from '@/lib/apiBase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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
      const res = await axios.get(`${API_BASE_URL}/api/v1/order/sales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })
      if (res.data.success) {
        let salesData = res.data.salesByDate || []
        if (!salesData.length) {
          try {
            const allRes = await axios.get(`${API_BASE_URL}/api/v1/order/all`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (allRes.data.success && Array.isArray(allRes.data.orders)) {
              const grouped = {}
              allRes.data.orders
                .filter((o) => o.status === 'Paid')
                .forEach((o) => {
                  const d = new Date(o.createdAt).toISOString().split('T')[0]
                  grouped[d] = (grouped[d] || 0) + (o.amount || 0)
                })
              salesData = Object.entries(grouped)
                .map(([date, amount]) => ({ date, amount }))
                .sort((a, b) => a.date.localeCompare(b.date))
            }
          } catch (e) {
            console.error('Fallback orders fetch failed:', e)
          }
        }
        setStats({ ...res.data, salesByDate: salesData })
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchStats() }, 0)
    return () => window.clearTimeout(timer)
  }, [fetchStats])

  const formatDateTick = (dateStr) => {
    if (!dateStr) return ''
    try {
      const parts = dateStr.split('-')
      if (parts.length === 3) {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        const day = parts[parts[0].length === 4 ? 2 : 0]
        const m = parseInt(parts[1], 10) - 1
        return `${day} ${months[m] || ''}`
      }
      return dateStr
    } catch {
      return dateStr
    }
  }

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
            <CardTitle className="font-display">Sales Overview & Trends</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 350, minHeight: 350 }}>
            {stats.salesByDate && stats.salesByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                <BarChart data={stats.salesByDate} margin={{ top: 15, right: 20, left: 10, bottom: 5 }} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#5c5c6d' }} tickFormatter={formatDateTick} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#5c5c6d' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(23, 59, 92, 0.12)' }}
                    itemStyle={{ color: '#173b5c', fontWeight: 'bold' }}
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Sales']}
                    labelFormatter={(label) => `Date: ${formatDateTick(label)}`}
                  />
                  <Bar
                    dataKey="amount"
                    name="Sales"
                    fill="#173b5c"
                    maxBarSize={36}
                    radius={[7, 7, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center p-6">
                <p className="font-semibold text-slate-700">No sales recorded yet</p>
                <p className="mt-1 text-xs text-slate-500">Paid customer orders will automatically appear on this timeline.</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default AdminSales
