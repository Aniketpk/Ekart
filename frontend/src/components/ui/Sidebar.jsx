import { LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaRegEdit } from 'react-icons/fa'

const navItemClass = ({ isActive }) =>
    `text-xs md:text-sm ${isActive ? 'bg-[#173b5c] text-white shadow-sm' : 'text-slate-600 hover:bg-white/70 hover:text-[#173b5c]'} flex items-center gap-2 md:gap-3 font-medium cursor-pointer p-2.5 md:p-3 rounded-xl md:w-full whitespace-nowrap transition-colors duration-200`

const Sidebar = () => {
    return (
        <div className='fixed left-3 right-3 top-[82px] z-40 w-auto overflow-x-auto rounded-full glass-surface-strong px-2 py-1.5 shadow-lg md:left-4 md:right-auto md:top-24 md:h-[calc(100vh-112px)] md:w-[232px] md:overflow-x-hidden md:overflow-y-auto md:rounded-[1.65rem] md:border-white/80 md:p-4 md:pt-5'>
            <div className='flex w-max items-center gap-1 md:w-auto md:flex-col md:items-stretch md:gap-6 md:pt-2'>
                {/* Management Section */}
                <div>
                    <p className='hidden text-[10px] font-display uppercase tracking-widest text-[#5c5c6d] mb-3 px-3 md:block'>Management</p>
                    <div className='flex items-center gap-1 md:flex-col md:items-stretch md:gap-1'>
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

            </div>
        </div>
    )
}
export default Sidebar
