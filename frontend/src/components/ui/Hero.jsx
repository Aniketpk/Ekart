import React from 'react'
import { Button } from './button'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate()

    return (
        <section className='bg-gradient-to-br from-[#1a237e] to-[#0d1759] text-white py-24 lg:py-32 overflow-hidden'>
            <div className='max-w-[1280px] mx-auto px-6'>
                <div className='grid md:grid-cols-2 gap-16 items-center'>
                    <div className='space-y-8'>
                        <p className='font-mono-label text-[#8ad3d7] tracking-widest'>
                            SPECIAL LAUNCH OFFER
                        </p>
                        <h1 className='font-display text-5xl md:text-6xl lg:text-[56px] font-bold tracking-tight leading-[1.1]'>
                            Latest Electronics{' '}
                            <span className='text-[#bdc2ff]'>
                                At Best Prices
                            </span>
                        </h1>
                        <p className='text-lg text-blue-100/80 max-w-lg leading-relaxed font-body'>
                            Discover cutting-edge technology with unbeatable deals on smartphones, laptops, and more. Upgrade your tech today with premium hardware designed for the modern lifestyle.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 pt-2'>
                            <Button
                                size="lg"
                                onClick={() => navigate('/products')}
                                className='bg-white text-[#1a237e] hover:bg-gray-50 font-semibold px-8 py-6 rounded shadow-ambient transition-all duration-200 hover:shadow-ambient-hover'
                            >
                                Shop Now
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/products')}
                                className='border border-white/40 text-white hover:bg-white/10 bg-transparent px-8 py-6 rounded font-semibold transition-all duration-200'
                            >
                                View Deals
                            </Button>
                        </div>
                    </div>

                    <div className='relative flex justify-center md:justify-end'>
                        <div className='relative z-10'>
                            <img
                                src="/hero.png"
                                alt="Latest Gadgets"
                                className='w-full max-w-md md:max-w-lg object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500 rounded-lg'
                            />
                        </div>
                        {/* Subtle ambient glow */}
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#4c56af] rounded-full filter blur-[120px] opacity-20'></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
