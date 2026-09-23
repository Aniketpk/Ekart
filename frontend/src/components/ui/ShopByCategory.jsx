import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const categories = [
    {
        title: 'Wireless Headphones',
        label: 'PREMIUM AUDIO',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        filter: 'HeadPhone'
    },
    {
        title: 'Laptops & Tablets',
        label: 'WORK & PLAY',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
        filter: 'Laptop'
    },
    {
        title: 'Smartphones',
        label: 'CONNECTED',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
        filter: 'Mobile'
    }
]

const ShopByCategory = () => {
    const navigate = useNavigate()

    return (
        <section className='py-20 bg-white'>
            <div className='max-w-[1280px] mx-auto px-6'>
                {/* Header */}
                <div className='flex items-end justify-between mb-10'>
                    <div>
                        <p className='font-mono-label text-[#1a237e] mb-2'>Curated Selection</p>
                        <h2 className='font-display text-3xl md:text-4xl font-bold text-[#121212]'>Shop by Category</h2>
                    </div>
                    <button
                        onClick={() => navigate('/products')}
                        className='hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#1a237e] hover:text-[#0d1759] transition-colors group'
                    >
                        View All
                        <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
                    </button>
                </div>

                {/* Category Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(`/products?category=${encodeURIComponent(cat.filter)}`)}
                            className='group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3] bg-[#121212]'
                        >
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70'
                            />
                            {/* Dark gradient overlay */}
                            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                            {/* Content */}
                            <div className='absolute bottom-0 left-0 p-6'>
                                <p className='font-mono-label text-white/70 mb-1'>{cat.label}</p>
                                <h3 className='font-display text-xl font-bold text-white'>{cat.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ShopByCategory
