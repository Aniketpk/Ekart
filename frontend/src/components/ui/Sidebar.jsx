import { LayoutDashboard, PackagePlus, PackageSearch, Users, Settings, FileText } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaRegEdit } from 'react-icons/fa'

const navItemClass = ({ isActive }) =>
    `text-sm ${isActive ? 'bg-[#1a237e] text-white' : 'bg-transparent text-[#121212] hover:bg-[#e0e0ff]'} flex items-center gap-3 font-medium cursor-pointer p-3 rounded-md w-full transition-colors duration-200`

const Sidebar = () => {
    return (
        <div className='hidden fixed md:block border-r bg-white border-[#e0e0e0] w-[240px] p-5 pt-24 h-screen z-10 top-0 left-0'>
            <div className='pt-6 space-y-6'>
                {/* Management Section */}
                <div>
                    <p className='text-[10px] font-display uppercase tracking-widest text-[#5c5c6d] mb-3 px-3'>Management</p>
                    <div className='space-y-1'>
                        <NavLink to='/dashboard/sales' className={navItemClass}>
                            <LayoutDashboard className="w-[18px] h-[18px]" /><span>Dashboard</span>
                        </NavLink>

                        <NavLink to='/dashboard/add-product' className={navItemClass}>
                            <PackagePlus className="w-[18px] h-[18px]" /><span>Add Product</span>
                        </NavLink>

                        <NavLink to='/dashboard/products' className={navItemClass}>
                            <PackageSearch className="w-[18px] h-[18px]" /><span>Products</span>
                        </NavLink>

                        <NavLink to='/dashboard/users' className={navItemClass}>
                            <Users className="w-[18px] h-[18px]" /><span>Users</span>
                        </NavLink>

                        <NavLink to='/dashboard/orders' className={navItemClass}>
                            <FaRegEdit className="w-[18px] h-[18px]" /><span>Orders</span>
                        </NavLink>
                    </div>
                </div>

                {/* Settings Section */}
                <div>
                    <p className='text-[10px] font-display uppercase tracking-widest text-[#5c5c6d] mb-3 px-3'>Settings</p>
                    <div className='space-y-1'>
                        <NavLink to='/dashboard/sales' end={false} className={({ isActive }) =>
                            `text-sm bg-transparent text-[#121212] hover:bg-[#e0e0ff] flex items-center gap-3 font-medium cursor-pointer p-3 rounded-md w-full transition-colors duration-200`
                        }>
                            <Settings className="w-[18px] h-[18px]" /><span>Configuration</span>
                        </NavLink>

                        <NavLink to='/dashboard/sales' end={false} className={({ isActive }) =>
                            `text-sm bg-transparent text-[#121212] hover:bg-[#e0e0ff] flex items-center gap-3 font-medium cursor-pointer p-3 rounded-md w-full transition-colors duration-200`
                        }>
                            <FileText className="w-[18px] h-[18px]" /><span>Reports</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Sidebar