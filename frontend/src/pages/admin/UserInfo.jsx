import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from '@/components/ui/input'
import userLogo from '../../assets/user.jpg'
import axios from 'axios'
import { toast } from 'sonner'

const UserInfo = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    profilePic: "",
    role: ""
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const getUser = async () => {
    const accessToken = localStorage.getItem("accessToken")
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/get-user/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        
        }
      })
      if (res.data.success) {
        setUpdateUser(res.data.user)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser()
  }, [id])

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const accessToken = localStorage.getItem("accessToken")
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("firstName", updateUser.firstName)
      formData.append("lastName", updateUser.lastName)
      formData.append("email", updateUser.email)
      formData.append("phone", updateUser.phone)
      formData.append("address", updateUser.address)
      formData.append("city", updateUser.city)
      formData.append("state", updateUser.state)
      formData.append("zipCode", updateUser.zipCode)
      formData.append("role", updateUser.role)

      if (file) {
        formData.append("file", file)
      }
      const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/user/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": undefined
        }
      })
      if (res.data.success) {
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full p-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex flex-col'>
          <div className='flex items-center gap-4 mb-8'>
            <Button variant="outline" onClick={() => navigate(-1)} className="border-[#e0e0e0] text-[#121212]"><ArrowLeft className="w-4 h-4" /></Button>
            <h1 className='font-display font-bold text-2xl text-[#121212]'>Update Profile</h1>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-12 items-start">
            {/* profile image */}
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-[#1a237e] shadow-ambient bg-[#f5f5f7] flex items-center justify-center">
                <img src={updateUser?.profilePic || userLogo} alt="profile" className="w-full h-full object-cover" />
              </div>
              <Label className='cursor-pointer bg-[#1a237e] text-white px-5 py-2.5 rounded hover:bg-[#0d1759] transition-colors duration-200 font-medium text-sm shadow-sm'>
                Change Image
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </Label>
            </div>
            {/* profile form */}
            <form onSubmit={handleSubmit} className='space-y-4 shadow-ambient border border-[#f0f0f0] p-8 rounded-lg bg-white flex-1 w-full'>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className='block text-sm font-medium'>First Name</Label>
                  <Input type="text" name="firstName" value={updateUser?.firstName || ""} onChange={handleChange} placeholder="First Name" className="w-full border rounded-lg px-3 py-2 my-1 " />
                </div>
                <div>
                  <Label className='block text-sm font-medium'>Last Name</Label>
                  <Input type="text" name="lastName" value={updateUser?.lastName || ""} onChange={handleChange} placeholder="Last Name" className="w-full border rounded-lg px-3 py-2 my-1 " />
                </div>
              </div>
              <div>
                <Label className='block text-sm font-medium'>Email</Label>
                <Input type="email" name="email" value={updateUser?.email || ""} placeholder="Email" disabled className="w-full border rounded-lg px-3 py-2 my-1 bg-gray-100 cursor-not-allowed " />
              </div>
              <div>
                <Label className='block text-sm font-medium'>Phone</Label>
                <Input type="text" name="phone" value={updateUser?.phone || ""} onChange={handleChange} placeholder="Phone" className="w-full border rounded-lg px-3 py-2 my-1 " />
              </div>
              <div>
                <Label className='block text-sm font-medium'>Address</Label>
                <Input type="text" name="address" value={updateUser?.address || ""} onChange={handleChange} placeholder="Address" className="w-full border rounded-lg px-3 py-2 my-1 " />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className='block text-sm font-medium'>City</Label>
                  <Input type="text" name="city" value={updateUser?.city || ""} onChange={handleChange} placeholder="City" className="w-full border rounded-lg px-3 py-2 my-1 " />
                </div>
                <div>
                  <Label className='block text-sm font-medium'>Zip Code</Label>
                  <Input type="text" name="zipCode" value={updateUser?.zipCode || ""} onChange={handleChange} placeholder="Zip Code" className="w-full border rounded-lg px-3 py-2 my-1 " />
                </div>
              </div>
              <div>
                <Label className='block text-sm font-medium'>State</Label>
                <Input type="text" name="state" value={updateUser?.state || ""} onChange={handleChange} placeholder="State" className="w-full border rounded-lg px-3 py-2 my-1 " />
              </div>

              <div className='flex gap-3 items-center'>
                <Label className='block text-sm font-medium'>Role: </Label>
                <RadioGroup value={updateUser?.role} 
                onValueChange={(value) => setUpdateUser({...updateUser, role: value})}
                className='flex items-center'>
                  <div>
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>
                  <div>
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
              </div>

              {
                loading ? (
                  <Button disabled className="w-full mt-6 bg-[#1a237e] text-white font-medium py-2.5 rounded hover:bg-[#0d1759] transition-colors">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </Button>
                ) : (

                  <Button type="submit" className="w-full mt-6 bg-[#1a237e] text-white font-medium py-2.5 rounded hover:bg-[#0d1759] transition-colors shadow-sm hover:shadow-ambient">Update Profile</Button>
                )
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo