import { API_BASE_URL } from '@/lib/apiBase'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('Verifying your email…')
    const navigate = useNavigate();

    const verifyEmail = useCallback(async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/user/verify`,{},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success) {
                setStatus('Email verified successfully')
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }
        } catch (error) {
            console.log(error);
            setStatus('Email verification failed. The link may have expired.')
        }
    }, [navigate, token])
    useEffect(() => {
        if (!token) return
        const timer = window.setTimeout(() => { void verifyEmail() }, 0)
        return () => window.clearTimeout(timer)
    }, [token, verifyEmail])

    return (
        <main className='flex min-h-screen items-center justify-center bg-transparent px-4 py-10'>
            <div className='w-full max-w-md glass-surface-strong rounded-[2rem] p-7 text-center shadow-xl sm:p-10'>
                <Link to="/" className="mb-4 inline-flex font-display text-lg font-bold text-[#173b5c]">E-Kart</Link>
                <h1 role="status" className='font-display text-xl font-semibold text-slate-950'>{status}</h1>
                {status.startsWith('Email verification failed') && <Link to="/login" className="mt-5 inline-flex rounded-xl bg-[#173b5c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#102c47]">Return to log in</Link>}
            </div>
        </main>
    )
}

export default VerifyEmail
