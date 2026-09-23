import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState("Verifying...")
    const navigate = useNavigate();

    const verifyEmail = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/verify`,{},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success) {
                setStatus('✅ Email Verified Successfully')
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }
        } catch (error) {
            console.log(error);
            setStatus("❌ Email Verification Failed");
        }
    }
    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token])

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#fcf9f8] px-4'>
            <div className='bg-white p-10 rounded-xl shadow-ambient border border-[#f0edec] w-full max-w-md text-center'>
                <h2 className='text-xl font-display font-semibold text-[#121212]'>{status}</h2>
            </div>
        </div>
    )
}

export default VerifyEmail