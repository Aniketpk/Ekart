import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/ui/Sidebar'
const Dashboard = () => {
  return (
    <div className='flex min-h-screen pt-[74px] bg-[#f5f5f7]'>
      <Sidebar />
      <div className='flex-1 md:ml-[240px]'>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard