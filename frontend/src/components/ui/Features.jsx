import React from 'react'
import { Headphones, Truck, Shield, RefreshCw } from 'lucide-react'

export const Features = () => {
    const features = [
        {
            icon: <Truck className='w-5 h-5 text-[#1a237e]' />,
            title: "Free Shipping",
            description: "On all orders over ₹500"
        },
        {
            icon: <Shield className='w-5 h-5 text-[#1a237e]' />,
            title: "Secure Payment",
            description: "100% secure transactions"
        },
        {
            icon: <RefreshCw className='w-5 h-5 text-[#1a237e]' />,
            title: "30 Days Return",
            description: "Hassle-free return policy"
        },
        {
            icon: <Headphones className='w-5 h-5 text-[#1a237e]' />,
            title: "24/7 Support",
            description: "Expert support team"
        }
    ]

    return (
        <section className='py-20 bg-[#f5f5f7]'>
            <div className='max-w-[1280px] mx-auto px-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {features.map((feature, index) => (
                        <div key={index} className='flex flex-col items-center text-center p-8 bg-white rounded-lg border border-[#f0f0f0] shadow-ambient hover:shadow-ambient-hover transition-all duration-300 hover:-translate-y-1'>
                            <div className='w-12 h-12 bg-[#e0e0ff] rounded-lg flex items-center justify-center mb-5'>
                                {feature.icon}
                            </div>
                            <h3 className='font-display text-base font-semibold text-[#121212] mb-1.5'>{feature.title}</h3>
                            <p className='text-sm text-[#5c5c6d] font-body'>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
