import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/ui/Sidebar'
const Dashboard = () => {
  return (
    <div className='min-h-screen bg-transparent pb-10 pt-[124px] md:pt-[106px]'>
      <Sidebar />
      <div className='mx-auto max-w-[1500px] px-3 sm:px-5 md:ml-[270px] md:mr-5 md:px-0'>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
