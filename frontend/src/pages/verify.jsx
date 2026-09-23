import React from 'react'

const Verify = () => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-[#fcf9f8] px-4'>
            <div className='bg-white p-10 rounded-xl shadow-ambient border border-[#f0edec] w-full max-w-md text-center'>
                <h2 className='font-display text-2xl font-semibold text-[#1a237e] mb-4'>Check Your Email</h2>
                <p className='font-body text-[#454652] text-sm'>
                    We've sent a verification code to your email address. Please check your inbox and click the verification link.
                </p>
            </div>
        </div>
    )
}

export default Verify
