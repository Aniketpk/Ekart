import React from 'react'
import { CreditCard, PackageSearch, MapPin, ClipboardList } from 'lucide-react'

export const Features = () => {
    const features = [
        {
            icon: <PackageSearch className='w-5 h-5 text-[#173b5c]' />,
            title: "Browse the catalog",
            description: "Explore the products listed in E-Kart."
        },
        {
            icon: <CreditCard className='w-5 h-5 text-[#173b5c]' />,
            title: "Protected payment",
            description: "Checkout payments are verified before orders are confirmed."
        },
        {
            icon: <ClipboardList className='w-5 h-5 text-[#173b5c]' />,
            title: "Order history",
            description: "Review your orders from your account."
        },
        {
            icon: <MapPin className='w-5 h-5 text-[#173b5c]' />,
            title: "Delivery details",
            description: "Add a delivery address during checkout."
        }
    ]

    return (
        <section className='bg-transparent px-4 py-10 sm:px-6 sm:py-14'>
            <div className='mx-auto max-w-[1280px]'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {features.map((feature, index) => (
                        <div key={index} className='flex flex-col items-center text-center glass-surface rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7'>
                            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/90 bg-white/70 shadow-inner'>
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
