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
import userLogo from '../assets/user-avatar.jpg'
import { toast } from "sonner"
import axios from "axios"
import { setUser } from "@/redux/userSlice"
import { Loader2, Camera, ArrowRight } from "lucide-react"
import MyOrder from "./MyOrder"
import Footer from "@/components/ui/Footer"


const Profile = () => {
    const { user } = useSelector(store => store.user)
    const params = useParams()
    const userId = params.userId
    const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : null
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
          <main className="min-h-screen bg-transparent px-4 pb-14 pt-28 sm:px-6 sm:pt-32">
            <div className="mx-auto max-w-5xl">
              <p className="font-mono-label text-[#426a8c]">Your E-Kart account</p>
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-.04em] text-slate-950 sm:text-5xl">Account</h1>
              <Tabs defaultValue="profile" className="mt-7 w-full">
                <TabsList className="mb-6 grid w-full max-w-sm grid-cols-2"><TabsTrigger value="profile">Profile details</TabsTrigger><TabsTrigger value="orders">Order history</TabsTrigger></TabsList>
                <TabsContent value="profile" className="mt-0 space-y-5">
                  <section className="relative isolate flex flex-col gap-5 overflow-hidden rounded-[1.75rem] bg-[#122b43] p-5 text-white shadow-xl sm:flex-row sm:items-center sm:p-7">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_82%_45%,rgba(97,146,185,.34),transparent_40%),linear-gradient(115deg,#10243a,#1d405b)]"/>
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/35 bg-white/10 shadow-lg sm:h-28 sm:w-28"><img src={updateUser?.profilePic || userLogo} alt={`${updateUser.firstName} ${updateUser.lastName}`} className="h-full w-full object-cover"/><button type="button" aria-label="Change profile photo" onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-white text-[#173b5c] shadow"><Camera size={15}/></button><input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange}/></div>
                    <div className="min-w-0 flex-1"><p className="font-mono-label text-sky-200">Personal account</p><h2 className="mt-1 truncate font-display text-2xl font-semibold sm:text-3xl">{updateUser.firstName} {updateUser.lastName}</h2><p className="mt-1 truncate text-sm text-slate-200">{updateUser.email}</p><p className="mt-3 text-xs text-sky-100/80">{memberYear ? `Member since ${memberYear}` : 'Manage your E-Kart profile'}</p></div>
                    <div className="rounded-2xl border border-white/15 bg-white/[.08] px-5 py-4 backdrop-blur-md sm:min-w-44"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-sky-100/75">Paid orders total</p><p className="mt-1 font-display text-2xl font-semibold">₹{totalSpent.toLocaleString('en-IN')}</p></div>
                  </section>
                  <form onSubmit={handleSubmit} className="glass-surface-strong rounded-[1.75rem] p-5 sm:p-8">
                    <div className="mb-6"><p className="font-mono-label text-[#426a8c]">Profile settings</p><h2 className="mt-1 font-display text-2xl font-semibold text-slate-950">Personal information</h2><p className="mt-2 text-sm text-slate-600">Update the details used for your E-Kart account.</p></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[['firstName','First name','text'],['lastName','Last name','text'],['email','Email address','email'],['phone','Phone number','tel']].map(([name,label,type])=><div key={name} className="grid gap-2"><Label htmlFor={`profile-${name}`} className="text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</Label><Input id={`profile-${name}`} type={type} name={name} value={updateUser[name] || ''} onChange={handleChange} disabled={name==='email'} autoComplete={name} className="glass-input min-h-12 rounded-xl px-4 disabled:opacity-60"/></div>)}
                    </div>
                    <div className="my-7 border-t border-slate-200/70"/><div className="mb-4"><h3 className="font-display text-lg font-semibold text-slate-900">Delivery address</h3><p className="mt-1 text-sm text-slate-600">Keep your shipping details up to date.</p></div>
                    <div className="grid gap-4 sm:grid-cols-3"><div className="grid gap-2 sm:col-span-3"><Label htmlFor="profile-address" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Street address</Label><textarea id="profile-address" name="address" value={updateUser.address || ''} onChange={handleChange} rows={3} className="glass-input resize-y rounded-xl p-3.5 text-sm outline-none focus:border-sky-700"/></div>{[['city','City'],['state','State / region'],['zipCode','Postal code']].map(([name,label])=><div key={name} className="grid gap-2"><Label htmlFor={`profile-${name}`} className="text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</Label><Input id={`profile-${name}`} name={name} value={updateUser[name] || ''} onChange={handleChange} className="glass-input min-h-12 rounded-xl px-4"/></div>)}</div>
                    <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-200/70 pt-5"><Button disabled={loading} type="submit" className="min-h-11 rounded-full bg-[#173b5c] px-6 text-white hover:bg-[#102c47]">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Saving…</> : <>Save changes <ArrowRight className="ml-2 h-4 w-4"/></>}</Button><Button type="button" variant="ghost" onClick={handleDiscard} className="min-h-11 rounded-full px-5 text-slate-600">Discard changes</Button></div>
                  </form>
                </TabsContent>
                <TabsContent value="orders" className="mt-0"><MyOrder/></TabsContent>
              </Tabs>
            </div>
          </main>
          <Footer/>
        </>
    )
}

export default Profile
