import { API_BASE_URL } from '@/lib/apiBase'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Edit, Eye, Search } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';


const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()

  const getAllusers = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/all-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const filteredUsers = users.filter(user=>
    `${user?.firstName} ${user?.lastName} ${user?.email}`.toLowerCase().includes(searchTerm.toLowerCase())|| user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    const timer = window.setTimeout(() => { void getAllusers() }, 0)
    return () => window.clearTimeout(timer)
  }, [getAllusers]);

  return (
    <div className='w-full p-6'>
      <h1 className='font-display text-2xl font-bold text-[#121212]'>User Management</h1>
      <p className="text-[#5c5c6d] font-body mt-1">Views and manage registered users</p>
      <div className='relative mt-8 flex w-full max-w-sm'>
        <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-[#5c5c6d]" />
        <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="pl-10 border-[#e0e0e0] focus-visible:ring-[#173b5c]" placeholder="Search users" />
      </div>
      <div className='mt-7 mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {users && users.length > 0 &&
          filteredUsers.map((user, index) => {
            return (
              <div key={index} className='glass-surface rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:p-6'>
                <div className='flex items-center gap-4'>
                  <img 
                    src={user?.profilePic || "https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"} 
                    alt="" 
                    className='rounded-full w-14 aspect-square object-cover border border-[#e0e0e0]' 
                  />
                  <div>
                    <h1 className='font-display font-semibold text-[#121212]'>{user?.firstName + " " + user?.lastName}</h1>
                    <h3 className="text-sm text-[#5c5c6d] font-body">{user?.email}</h3>
                  </div>
                </div>
                <div className='flex gap-3 mt-6 border-t border-[#f0f0f0] pt-4'> 
                  <Button onClick ={()=>navigate(`/dashboard/users/${user?._id}`)} variant='outline' className="flex-1 border-[#e0e0e0] text-[#121212] hover:text-[#173b5c] hover:bg-[#f5f5f7]"><Edit className="w-4 h-4 mr-2"/>Edit</Button>
                  <Button onClick ={()=>navigate(`/dashboard/users/orders/${user?._id}`)} className="flex-1 bg-[#173b5c] hover:bg-[#102c47] text-white"><Eye className="w-4 h-4 mr-2"/>Orders</Button>
                  
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default AdminUsers
