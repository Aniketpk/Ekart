import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'

const Newsletter = () => {
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email.trim()) {
            toast.success('Subscribed successfully!')
            setEmail('')
        }
    }

    return (
        <section className='py-16 bg-[#f5f5f7]'>
            <div className='max-w-[1280px] mx-auto px-6'>
                <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
                    {/* Left text */}
                    <div className='md:max-w-md'>
                        <h2 className='font-display text-2xl md:text-3xl font-bold text-[#121212] mb-3'>
                            Stay in the Loop
                        </h2>
                        <p className='text-sm text-[#5c5c6d] font-body leading-relaxed'>
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals delivered straight to your inbox.
                        </p>
                    </div>

                    {/* Right form */}
                    <form onSubmit={handleSubmit} className='flex w-full md:w-auto gap-0'>
                        <input
                            type='email'
                            placeholder='Enter your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='px-5 py-3 text-sm font-body bg-white border border-[#e0e0e0] border-r-0 rounded-l-md focus:outline-none focus:border-[#1a237e] w-full md:w-80 transition-colors'
                        />
                        <button
                            type='submit'
                            className='flex items-center gap-2 px-6 py-3 bg-[#1a237e] text-white text-sm font-semibold rounded-r-md hover:bg-[#0d1759] transition-colors whitespace-nowrap'
                        >
                            Subscribe <Send className='w-3.5 h-3.5' />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Newsletter
