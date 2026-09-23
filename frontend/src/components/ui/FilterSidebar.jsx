import React from 'react'
import { Input } from './input'
import { Button } from './button'

const FilterSidebar = ({ search, setSearch, category, setCategory, brand, setBrand, setPriceRange, allProducts, priceRange }) => {
    const Category = allProducts.map((p) => p.category)
    const UniqueCategory = ["All Products", ...new Set(Category)]

    const Brands = allProducts.map((p) => p.brand)
    const UniqueBrand = ["All Brands", ...new Set(Brands)]

    const handleCategoryClick = (val) => {
        setCategory(val === "All Products" ? "All" : val)
    }

    const handleBrandChange = (e) => {
        setBrand(e.target.value === "All Brands" ? "All" : e.target.value)
    }

    const handleMinChange = (e) => {
        const value = Number(e.target.value)
        if (value <= priceRange[1]) setPriceRange([value, priceRange[1]])
    }

    const handleMaxChange = (e) => {
        const value = Number(e.target.value)
        if (value >= priceRange[0]) setPriceRange([priceRange[0], value])
    }

    const resetFilter = () => {
        setSearch("")
        setCategory("All")
        setBrand("All")
        setPriceRange([0, 999999])
    }

    const isSelected = (val) => {
        if (val === "All Products") return category === "All"
        return category === val
    }

    return (
        <div className='bg-white border border-[#f0f0f0] mt-1 p-6 rounded-lg shadow-ambient h-max hidden md:block w-64 flex-shrink-0'>
            {/* Filters heading */}
            <h2 className='font-display font-bold text-lg text-[#121212] mb-6'>Filters</h2>

            {/* Category */}
            <h3 className='font-display font-semibold text-[#121212] text-xs uppercase tracking-wider mb-3'>Category</h3>
            <div className='flex flex-col gap-2.5'>
                {
                    UniqueCategory.map((items, index) => (
                        <label key={index} className='flex items-center gap-3 cursor-pointer group'>
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-[#1a237e] rounded cursor-pointer"
                                checked={isSelected(items)}
                                onChange={() => handleCategoryClick(items)}
                            />
                            <span className="text-sm text-[#5c5c6d] font-body group-hover:text-[#121212] transition-colors">{items}</span>
                        </label>
                    ))
                }
            </div>

            {/* Brand */}
            <h3 className='mt-7 font-display font-semibold text-[#121212] text-xs uppercase tracking-wider mb-3'>Brand</h3>
            <select
                className='bg-[#f5f5f7] p-2.5 rounded border border-[#e0e0e0] w-full text-sm font-body focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent'
                value={brand === "All" ? "All Brands" : brand}
                onChange={handleBrandChange}
            >
                {
                    UniqueBrand.map((items, index) => (
                        <option key={index} value={items}>{items}</option>
                    ))
                }
            </select>

            {/* Price Range */}
            <h3 className='mt-7 font-display font-semibold text-[#121212] text-xs uppercase tracking-wider mb-3'>Price Range</h3>
            <div className='flex gap-3 items-center'>
                <div className='flex-1'>
                    <label className='text-[10px] font-display uppercase tracking-wider text-[#5c5c6d] mb-1 block'>Min</label>
                    <input
                        type="number"
                        min="0"
                        max="5000"
                        value={priceRange[0]}
                        onChange={handleMinChange}
                        className='w-full p-2 text-sm border border-[#e0e0e0] rounded bg-[#f5f5f7] focus:outline-none focus:border-[#1a237e] font-body'
                    />
                </div>
                <span className="text-[#5c5c6d] text-sm mt-5">-</span>
                <div className='flex-1'>
                    <label className='text-[10px] font-display uppercase tracking-wider text-[#5c5c6d] mb-1 block'>Max</label>
                    <input
                        type="number"
                        min="0"
                        max="999999"
                        value={priceRange[1]}
                        onChange={handleMaxChange}
                        className='w-full p-2 text-sm border border-[#e0e0e0] rounded bg-[#f5f5f7] focus:outline-none focus:border-[#1a237e] font-body'
                    />
                </div>
            </div>

            {/* Reset button */}
            <Button onClick={resetFilter} className='mt-8 w-full bg-[#1a237e] hover:bg-[#0d1759] text-white p-2.5 rounded font-medium transition-colors cursor-pointer'>Reset Filters</Button>
        </div>
    )
}

export default FilterSidebar