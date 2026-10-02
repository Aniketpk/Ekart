import React from 'react'
import { Link } from 'react-router-dom'

const Verify = () => {
    return (
        <main className='flex min-h-screen items-center justify-center bg-transparent px-4 py-10'>
            <div className='w-full max-w-md glass-surface-strong rounded-[2rem] p-7 text-center shadow-xl sm:p-10'>
                <Link to="/" className="mb-4 inline-flex font-display text-lg font-bold text-[#173b5c]">E-Kart</Link>
                <h1 className='mb-3 font-display text-2xl font-semibold text-slate-950'>Check your email</h1>
                <p className='text-sm leading-6 text-slate-600'>
                    We've sent a verification code to your email address. Please check your inbox and click the verification link.
                </p>
            </div>
        </main>
    )
}

export default Verify
