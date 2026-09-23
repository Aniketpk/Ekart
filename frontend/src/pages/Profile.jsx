import { Button } from "@/components/ui/button"
import { useParams } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useDispatch, useSelector } from "react-redux"
import userLogo from '../assets/user.jpg'
import { toast } from "sonner"
import axios from "axios"
import { setUser } from "@/redux/userSlice"
import { Loader2, Camera, ArrowRight } from "lucide-react"
import store from "@/redux/store"
import MyOrder from "./MyOrder"
import Footer from "@/components/ui/Footer"


const Profile = () => {
    const { user } = useSelector(store => store.user)
    const params = useParams()
    const userId = params.userId
    const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : 2026
    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        zipCode: user?.zipCode || "",
        profilePic: user?.profilePic || "",
        role: user?.role || ""
    })
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [totalSpent, setTotalSpent] = useState(0)
    const dispatch = useDispatch()
    const fileInputRef = useRef(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken")
                const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/myorder`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                if (res.data.success && res.data.orders) {
                    const paidOrders = res.data.orders.filter(order => order.status === "Paid")
                    const total = paidOrders.reduce((sum, order) => sum + (order.amount || 0), 0)
                    setTotalSpent(total)
                }
            } catch (error) {
                console.error("Error fetching orders for spent calculation:", error)
            }
        }
        if (user) {
            fetchOrders()
        }
    }, [user])

    useEffect(() => {
        if (user) {
            setUpdateUser({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                zipCode: user.zipCode || "",
                profilePic: user.profilePic || "",
                role: user.role || ""
            })
        }
    }, [user])
    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
            setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
        }
    };

    const handleDiscard = () => {
        if (user) {
            setUpdateUser({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                zipCode: user.zipCode || "",
                profilePic: user.profilePic || "",
                role: user.role || ""
            })
            setFile(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken")
        setLoading(true)
        try {
            // use formData for text + file
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
            const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": undefined
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setUser(res.data.user))
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
            <div className="flex flex-col justify-center items-center min-h-screen pt-24 pb-12 bg-[#f5f5f7] px-4">
                {/* Page heading */}
                <h1 className="font-display font-bold text-4xl text-[#121212] mb-6">Account</h1>

                <Tabs defaultValue="profile" className="max-w-4xl mx-auto items-center w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList className="grid w-full max-w-xs grid-cols-2">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="profile" className="mt-0">
                        <div>
                            <div className="w-full flex flex-col md:flex-row gap-10 justify-between items-start">
                                {/* profile image card */}
                                <div className="flex flex-col items-center w-full md:w-72 bg-white p-8 rounded-lg shadow-ambient border border-[#f0f0f0] flex-shrink-0">
                                    <div className="relative w-36 h-36 rounded-md overflow-hidden border-2 border-[#e0e0e0] bg-[#f5f5f7] flex items-center justify-center mb-5">
                                        <img src={updateUser?.profilePic || userLogo} alt="profile" className="w-full h-full object-cover" />
                                        {/* Camera overlay button */}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-2 right-2 w-8 h-8 bg-[#1a237e] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#0d1759] transition-colors cursor-pointer"
                                        >
                                            <Camera className="w-4 h-4" />
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <h2 className="font-display font-bold text-xl text-[#121212] mb-1">{updateUser.firstName} {updateUser.lastName}</h2>
                                    <p className="font-body text-sm text-[#5c5c6d] mb-6 text-center">Premium Member since {memberYear}</p>

                                    <div className="w-full border-t border-[#f0f0f0] pt-5 mb-2">
                                        <p className="text-[10px] font-display uppercase tracking-widest text-[#5c5c6d] mb-1">Total Spent</p>
                                        <div className="flex justify-between items-center">
                                            <p className="font-display font-bold text-2xl text-[#1a237e]">₹{totalSpent.toLocaleString()}</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#8ad3d7] opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {/* profile form */}
                                <form onSubmit={handleSubmit} className='space-y-6 shadow-ambient border border-[#f0f0f0] p-10 rounded-lg bg-white flex-1 w-full'>
                                    <div className="mb-6">
                                        <h2 className="font-display font-bold text-2xl text-[#121212] mb-2">Personal Information</h2>
                                        <p className="font-body text-sm text-[#5c5c6d]">Update your details to ensure a seamless checkout and delivery experience.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="relative">
                                            <Label className='absolute -top-2 left-3 bg-white px-1 text-[10px] font-display uppercase tracking-widest text-[#1a237e] z-10'>First Name</Label>
                                            <Input type="text" name="firstName" value={updateUser.firstName} onChange={handleChange} placeholder="First Name" className="w-full border-2 border-[#f0f0f0] rounded bg-white px-4 py-6 text-base font-body focus-visible:ring-0 focus-visible:border-[#1a237e] transition-colors" />
                                        </div>
                                        <div className="relative">
                                            <Label className='absolute -top-2 left-3 bg-white px-1 text-[10px] font-display uppercase tracking-widest text-[#1a237e] z-10'>Last Name</Label>
                                            <Input type="text" name="lastName" value={updateUser.lastName} onChange={handleChange} placeholder="Last Name" className="w-full border-2 border-[#f0f0f0] rounded bg-white px-4 py-6 text-base font-body focus-visible:ring-0 focus-visible:border-[#1a237e] transition-colors" />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Label className='absolute -top-2 left-3 bg-white px-1 text-[10px] font-display uppercase tracking-widest text-[#1a237e] z-10'>Email Address</Label>
                                        <Input type="email" name="email" value={updateUser.email} placeholder="Email" disabled className="w-full border-2 border-[#f0f0f0] rounded bg-[#f5f5f7] px-4 py-6 text-base font-body cursor-not-allowed opacity-70" />
                                    </div>
                                    <div className="relative">
                                        <Label className='absolute -top-2 left-3 bg-white px-1 text-[10px] font-display uppercase tracking-widest text-[#1a237e] z-10'>Phone Number</Label>
                                        <Input type="text" name="phone" value={updateUser.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border-2 border-[#f0f0f0] rounded bg-white px-4 py-6 text-base font-body focus-visible:ring-0 focus-visible:border-[#1a237e] transition-colors" />
                                    </div>
                                    <div className="pt-6 border-t border-[#f0f0f0] mt-6">
                                        <div className="relative mb-6">
                                            <Label className='absolute -top-2 left-3 bg-white px-1 text-[10px] font-display uppercase tracking-widest text-[#1a237e] z-10'>Primary Shipping Address</Label>
                                            <textarea name="address" value={updateUser.address} onChange={handleChange} placeholder="Street Address" rows={3} className="w-full border-2 border-[#f0f0f0] rounded bg-white px-4 py-4 text-base font-body focus-visible:ring-0 focus:outline-none focus:border-[#1a237e] transition-colors resize-none" />
                                        </div>

                                        {/* 3-column: City / Zip Code / State */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="relative">
                                                <Label className='absolute -top-2 left-3 bg-white px-1 text-[10px] font-display uppercase tracking-widest text-[#1a237e] z-10'>City</Label>
                                                <Input type="text" name="city" value={updateUser.city} onChange={handleChange} placeholder="City" className="w-full border-2 border-[#f0f0f0] rounded bg-white px-4 py-6 text-base font-body focus-visible:ring-0 focus-visible:border-[#1a237e] transition-colors" />
                                            </div>
                                            <div className="relative">
                                                <Label className='absolute -top-2 left-3 bg-white px-1 text-[10px] font-display uppercase tracking-widest text-[#1a237e] z-10'>Zip Code</Label>
                                                <Input type="text" name="zipCode" value={updateUser.zipCode} onChange={handleChange} placeholder="Zip Code" className="w-full border-2 border-[#f0f0f0] rounded bg-white px-4 py-6 text-base font-body focus-visible:ring-0 focus-visible:border-[#1a237e] transition-colors" />
                                            </div>
                                            <div className="relative">
                                                <Label className='absolute -top-2 left-3 bg-white px-1 text-[10px] font-display uppercase tracking-widest text-[#1a237e] z-10'>State</Label>
                                                <Input type="text" name="state" value={updateUser.state} onChange={handleChange} placeholder="State" className="w-full border-2 border-[#f0f0f0] rounded bg-white px-4 py-6 text-base font-body focus-visible:ring-0 focus-visible:border-[#1a237e] transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 flex gap-4 items-center">
                                        {
                                            loading ? (
                                                <Button disabled className="bg-[#1a237e] text-white font-medium px-8 py-2.5 rounded hover:bg-[#0d1759] transition-colors">
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </Button>
                                            ) : (
                                                <Button type="submit" className="bg-[#1a237e] text-white font-medium px-8 py-2.5 rounded hover:bg-[#0d1759] transition-colors shadow-sm hover:shadow-ambient cursor-pointer">
                                                    Update Profile <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            )
                                        }
                                        <Button type="button" variant="ghost" onClick={handleDiscard} className="text-[#5c5c6d] hover:text-[#121212] font-medium px-4 cursor-pointer">Discard Changes</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="orders">
                        <MyOrder />
                    </TabsContent>

                </Tabs>
            </div>
            <Footer />
        </>
    )
}

export default Profile