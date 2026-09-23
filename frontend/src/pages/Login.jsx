
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'


const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handlechange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/login`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.success) {
                localStorage.setItem('accessToken', res.data.accessToken);
                dispatch(setUser(res.data.user));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-[#f5f5f7]'>
            <Card className="w-full max-w-sm shadow-ambient border-[#f0f0f0]">
                <CardHeader>
                    <CardTitle className="font-display text-[#121212]">Login to Your account</CardTitle>
                    <CardDescription className="font-body text-[#5c5c6d]">
                        Enter given details to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-4">

                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={formData.email}
                                onChange={handlechange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <div className='relative'>
                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="Enter Your Password"
                                    value={formData.password}
                                    onChange={handlechange}
                                    type={showPassword ? 'text' : 'password'}
                                    required />
                                {
                                    showPassword ? <EyeOff onClick={() => setShowPassword(false)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2' /> :
                                        <Eye onClick={() => setShowPassword(true)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2' />
                                }
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button disabled={loading} onClick={submitHandler} type="submit" className="w-full cursor-pointer bg-[#1a237e] hover:bg-[#0d1759] rounded text-white font-medium">
                        {loading ? <><Loader2 className='h-4 w-4 animate-spin mr-2' />Please wait</> : 'Login'}
                    </Button>
                    <p className='text-[#5c5c6d] text-sm font-body'> Don't have an account? <Link to={"/signup"} className='hover:underline cursor-pointer text-[#1a237e] font-display font-medium'>SignUp</Link></p>
                </CardFooter>
            </Card>
        </div >
    )
}

export default Login