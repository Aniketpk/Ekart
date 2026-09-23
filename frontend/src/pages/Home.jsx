import React from 'react'
import Hero from '@/components/ui/Hero'
import { Features } from '@/components/ui/Features'
import ShopByCategory from '@/components/ui/ShopByCategory'
import Newsletter from '@/components/ui/Newsletter'

const Home = () => {
    return (
        <>
        <Hero />
        <Features />
        <ShopByCategory />
        <Newsletter />
        </>
    )
}

export default Home